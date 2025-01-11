import { apiService } from '../services/api/baseApiService';
import { StorageUtils } from './storageUtils';
import { eventBus } from './eventBusUtils';

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS'
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  timestamp: number;
  channel: NotificationChannel[];
  read: boolean;
  data?: Record<string, any>;
}

export class NotificationUtils {
  // Local notification storage
  private static notifications: Notification[] = [];
  
  // Maximum number of stored notifications
  private static MAX_NOTIFICATIONS = 100;

  // Notification preferences
  private static preferences = {
    channels: [NotificationChannel.IN_APP],
    soundEnabled: true,
    desktopNotificationsEnabled: false
  };

  // Configure notification preferences
  static configure(config: {
    channels?: NotificationChannel[];
    soundEnabled?: boolean;
    desktopNotificationsEnabled?: boolean;
  }) {
    this.preferences = {
      ...this.preferences,
      ...config
    };

    // Persist preferences
    StorageUtils.setItem('notification-preferences', this.preferences);
  }

  // Create a new notification
  static createNotification(
    message: string, 
    options?: {
      type?: NotificationType;
      title?: string;
      channel?: NotificationChannel[];
      data?: Record<string, any>;
    }
  ): Notification {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type: options?.type || NotificationType.INFO,
      title: options?.title,
      timestamp: Date.now(),
      channel: options?.channel || this.preferences.channels,
      read: false,
      data: options?.data
    };

    // Store notification
    this.storeNotification(notification);

    // Trigger notification dispatch
    this.dispatchNotification(notification);

    return notification;
  }

  // Store notification
  private static storeNotification(notification: Notification): void {
    // Maintain max notifications limit
    if (this.notifications.length >= this.MAX_NOTIFICATIONS) {
      this.notifications.shift();
    }

    this.notifications.push(notification);

    // Persist to storage
    StorageUtils.setItem('notifications', this.notifications, {
      encrypted: true
    });

    // Emit event
    eventBus.publish('notification:created', notification);
  }

  // Dispatch notification through various channels
  private static async dispatchNotification(
    notification: Notification
  ): Promise<void> {
    try {
      // In-app notification
      if (notification.channel.includes(NotificationChannel.IN_APP)) {
        this.showInAppNotification(notification);
      }

      // Desktop notification
      if (this.preferences.desktopNotificationsEnabled) {
        this.showDesktopNotification(notification);
      }

      // Sound notification
      if (this.preferences.soundEnabled) {
        this.playNotificationSound();
      }

      // Send to server for multi-channel dispatch
      await apiService.post('/notifications/dispatch', notification);
    } catch (error) {
      console.error('Notification dispatch failed', error);
    }
  }

  // Show in-app notification
  private static showInAppNotification(
    notification: Notification
  ): void {
    // Publish to event bus for UI components
    eventBus.publish('notification:inapp', notification);
  }

  // Show desktop notification
  private static showDesktopNotification(
    notification: Notification
  ): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new window.Notification(
            notification.title || 'Notification', 
            {
              body: notification.message,
              icon: '/path/to/icon.png'
            }
          );
        }
      });
    }
  }

  // Play notification sound
  private static playNotificationSound(): void {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play();
    } catch (error) {
      console.warn('Failed to play notification sound', error);
    }
  }

  // Get notifications
  static getNotifications(options?: {
    unreadOnly?: boolean;
    limit?: number;
  }): Notification[] {
    let filteredNotifications = [...this.notifications];

    if (options?.unreadOnly) {
      filteredNotifications = filteredNotifications.filter(
        notif => !notif.read
      );
    }

    if (options?.limit) {
      filteredNotifications = filteredNotifications.slice(-options.limit);
    }

    return filteredNotifications;
  }

  // Mark notification as read
  static markAsRead(notificationId: string): void {
    const notification = this.notifications.find(
      notif => notif.id === notificationId
    );

    if (notification) {
      notification.read = true;

      // Persist changes
      StorageUtils.setItem('notifications', this.notifications, {
        encrypted: true
      });

      // Emit event
      eventBus.publish('notification:read', notification);
    }
  }

  // Clear notifications
  static clearNotifications(options?: {
    type?: NotificationType;
    channel?: NotificationChannel;
  }): void {
    this.notifications = this.notifications.filter(notif => {
      if (options?.type && notif.type !== options.type) {
        return true;
      }
      if (options?.channel && 
          !notif.channel.includes(options.channel)) {
        return true;
      }
      return false;
    });

    // Clear storage
    StorageUtils.removeItem('notifications');

    // Emit event
    eventBus.publish('notifications:cleared', options);
  }

  // Subscribe to notification events
  static onNotification(
    callback: (notification: Notification) => void
  ): () => void {
    return eventBus.subscribe('notification:created', callback);
  }
}

// Initialize notification preferences
NotificationUtils.configure({
  channels: [
    NotificationChannel.IN_APP, 
    NotificationChannel.EMAIL
  ],
  soundEnabled: true,
  desktopNotificationsEnabled: true
});

// Example usage
export const notifications = NotificationUtils;

// Create a notification
notifications.createNotification(
  'New lead assigned', 
  {
    type: NotificationType.SUCCESS,
    data: { leadId: '123' }
  }
);

// Listen for notifications
const unsubscribe = notifications.onNotification(
  (notification) => {
    console.log('New notification:', notification);
  }
);

// Later, unsubscribe if needed
// unsubscribe();