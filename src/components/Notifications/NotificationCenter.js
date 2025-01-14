import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-center">
      <h2>Notification Center</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <p>Timestamp: {notification.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCenter;
