import { apiService } from '../api/baseApiService';
import { authService } from '../auth/authService';

// Interfaces for different prediction models
interface LeadScoringPrediction {
  leadId: string;
  score: number;
  conversionProbability: number;
  insights: string[];
}

interface OpportunityPrediction {
  opportunityId: string;
  closeProbability: number;
  expectedRevenue: number;
  riskFactor: number;
  recommendedActions: string[];
}

interface SalesForecastPrediction {
  period: string;
  totalRevenuePrediction: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  trendIndicators: {
    direction: 'positive' | 'negative' | 'neutral';
    momentum: number;
  };
}

interface PredictionOptions {
  timeframe?: 'short' | 'medium' | 'long';
  confidenceThreshold?: number;
  detailLevel?: 'basic' | 'advanced';
}

class PredictionEngine {
  private static instance: PredictionEngine;
  private cacheExpiration: number = 5 * 60 * 1000; // 5 minutes
  private predictionCache: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): PredictionEngine {
    if (!PredictionEngine.instance) {
      PredictionEngine.instance = new PredictionEngine();
    }
    return PredictionEngine.instance;
  }

  // Lead Scoring Prediction
  async predictLeadScore(
    leadId: string, 
    options: PredictionOptions = {}
  ): Promise<LeadScoringPrediction | null> {
    const cacheKey = `lead_score_${leadId}`;
    
    // Check cache first
    const cachedPrediction = this.checkCache(cacheKey);
    if (cachedPrediction) return cachedPrediction;

    try {
      const prediction = await apiService.post<PredictionOptions, LeadScoringPrediction>(
        `/predictions/lead-score/${leadId}`,
        options
      );

      this.updateCache(cacheKey, prediction);
      return prediction;
    } catch (error) {
      console.error('Lead scoring prediction failed', error);
      return null;
    }
  }

  // Opportunity Prediction
  async predictOpportunity(
    opportunityId: string, 
    options: PredictionOptions = {}
  ): Promise<OpportunityPrediction | null> {
    const cacheKey = `opportunity_prediction_${opportunityId}`;
    
    // Check cache first
    const cachedPrediction = this.checkCache(cacheKey);
    if (cachedPrediction) return cachedPrediction;

    try {
      const prediction = await apiService.post<PredictionOptions, OpportunityPrediction>(
        `/predictions/opportunity/${opportunityId}`,
        options
      );

      this.updateCache(cacheKey, prediction);
      return prediction;
    } catch (error) {
      console.error('Opportunity prediction failed', error);
      return null;
    }
  }

  // Sales Forecast Prediction
  async predictSalesForecast(
    options: PredictionOptions = {}
  ): Promise<SalesForecastPrediction | null> {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const cacheKey = `sales_forecast_${user.id}`;
    
    // Check cache first
    const cachedPrediction = this.checkCache(cacheKey);
    if (cachedPrediction) return cachedPrediction;

    try {
      const prediction = await apiService.post<PredictionOptions, SalesForecastPrediction>(
        `/predictions/sales-forecast`,
        {
          ...options,
          userId: user.id
        }
      );

      this.updateCache(cacheKey, prediction);
      return prediction;
    } catch (error) {
      console.error('Sales forecast prediction failed', error);
      return null;
    }
  }

  // Batch Prediction for Multiple Leads
  async batchLeadScorePrediction(
    leadIds: string[], 
    options: PredictionOptions = {}
  ): Promise<LeadScoringPrediction[]> {
    try {
      const predictions = await apiService.post<
        { leadIds: string[], options: PredictionOptions }, 
        LeadScoringPrediction[]
      >('/predictions/lead-scores', {
        leadIds,
        options
      });

      // Update individual caches
      predictions.forEach(prediction => {
        this.updateCache(`lead_score_${prediction.leadId}`, prediction);
      });

      return predictions;
    } catch (error) {
      console.error('Batch lead scoring prediction failed', error);
      return [];
    }
  }

  // Private caching methods
  private updateCache(key: string, data: any): void {
    this.predictionCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private checkCache(key: string): any {
    const cachedItem = this.predictionCache.get(key);
    
    if (!cachedItem) return null;

    // Check cache expiration
    if (Date.now() - cachedItem.timestamp > this.cacheExpiration) {
      this.predictionCache.delete(key);
      return null;
    }

    return cachedItem.data;
  }

  // Cache management methods
  clearCache(): void {
    this.predictionCache.clear();
  }

  setCacheExpiration(minutes: number): void {
    this.cacheExpiration = minutes * 60 * 1000;
  }
}

// Export singleton instance
export const predictionEngine = PredictionEngine.getInstance();
export default predictionEngine;