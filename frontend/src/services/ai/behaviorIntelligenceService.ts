import { apiService } from '../api/baseApiService';
import { authService } from '../auth/authService';

interface UserBehaviorProfile {
  userId: string;
  interactions: BehaviorInteraction[];
  insights: BehaviorInsight[];
}

interface BehaviorInteraction {
  type: 'click' | 'hover' | 'scroll' | 'navigation';
  target: string;
  timestamp: number;
  duration?: number;
}

interface BehaviorInsight {
  category: string;
  score: number;
  confidence: number;
}

interface PredictiveRecommendation {
  type: string;
  confidence: number;
  description: string;
}

class BehaviorIntelligenceService {
  private static instance: BehaviorIntelligenceService;
  private behaviorTrackingEnabled: boolean = true;

  private constructor() {
    this.initializeBehaviorTracking();
  }

  public static getInstance(): BehaviorIntelligenceService {
    if (!BehaviorIntelligenceService.instance) {
      BehaviorIntelligenceService.instance = new BehaviorIntelligenceService();
    }
    return BehaviorIntelligenceService.instance;
  }

  // Initialize behavior tracking
  private initializeBehaviorTracking(): void {
    if (!this.behaviorTrackingEnabled) return;

    this.setupEventListeners();
  }

  // Setup global event listeners
  private setupEventListeners(): void {
    document.addEventListener('click', this.trackUserInteraction);
    document.addEventListener('mousemove', this.throttle(this.trackMouseMovement, 500));
    window.addEventListener('scroll', this.throttle(this.trackScrollBehavior, 300));
  }

  // Track user interactions
  private trackUserInteraction = (event: MouseEvent): void => {
    if (!this.behaviorTrackingEnabled) return;

    const target = event.target as HTMLElement;
    const interaction: BehaviorInteraction = {
      type: 'click',
      target: this.getElementIdentifier(target),
      timestamp: Date.now()
    };

    this.sendBehaviorData(interaction);
  }

  // Track mouse movement
  private trackMouseMovement = (event: MouseEvent): void => {
    if (!this.behaviorTrackingEnabled) return;

    // Advanced mouse tracking logic
    const interaction: BehaviorInteraction = {
      type: 'hover',
      target: this.getElementIdentifier(event.target as HTMLElement),
      timestamp: Date.now()
    };

    this.sendBehaviorData(interaction);
  }

  // Track scroll behavior
  private trackScrollBehavior = (): void => {
    if (!this.behaviorTrackingEnabled) return;

    const interaction: BehaviorInteraction = {
      type: 'scroll',
      target: 'window',
      timestamp: Date.now(),
      duration: this.calculateScrollDuration()
    };

    this.sendBehaviorData(interaction);
  }

  // Get unique element identifier
  private getElementIdentifier(element: HTMLElement): string {
    return element.id || 
           element.className || 
           element.tagName.toLowerCase();
  }

  // Throttle function to limit event frequency
  private throttle(
    func: (...args: any[]) => void, 
    delay: number
  ): (...args: any[]) => void {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return func(...args);
    };
  }

  // Calculate scroll duration
  private calculateScrollDuration(): number {
    // Implement scroll duration calculation logic
    return 0;
  }

  // Send behavior data to server
  private async sendBehaviorData(
    interaction: BehaviorInteraction
  ): Promise<void> {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      await apiService.post('/behavior/track', {
        userId: user.id,
        interaction
      });
    } catch (error) {
      console.error('Failed to send behavior data', error);
    }
  }

  // Generate user behavior profile
  async generateBehaviorProfile(): Promise<UserBehaviorProfile | null> {
    try {
      const user = authService.getCurrentUser();
      if (!user) return null;

      const profile = await apiService.get<UserBehaviorProfile>(
        `/behavior/profile/${user.id}`
      );

      return profile;
    } catch (error) {
      console.error('Failed to generate behavior profile', error);
      return null;
    }
  }

  // Generate predictive recommendations
  async generateRecommendations(): Promise<PredictiveRecommendation[]> {
    try {
      const user = authService.getCurrentUser();
      if (!user) return [];

      const recommendations = await apiService.get<PredictiveRecommendation[]>(
        `/behavior/recommendations/${user.id}`
      );

      return recommendations;
    } catch (error) {
      console.error('Failed to generate recommendations', error);
      return [];
    }
  }

  // Toggle behavior tracking
  public toggleBehaviorTracking(enable: boolean): void {
    this.behaviorTrackingEnabled = enable;
  }

  // Get current tracking status
  public getBehaviorTrackingStatus(): boolean {
    return this.behaviorTrackingEnabled;
  }
}

// Export singleton instance
export const behaviorIntelligenceService = BehaviorIntelligenceService.getInstance();
export default behaviorIntelligenceService;