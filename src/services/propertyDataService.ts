import { PropertyAnalysis, SentimentAnalysis, MarketSentiment } from '@/types/property';
import { propGuardAPI } from '@/services/api/propguard';
import { realtyBaseAPI } from '@/services/api/realtybase';
import { supabase } from '@/integrations/supabase/client';
import { 
  isCollinsStreetAddress, 
  getCollinsStreetPropertyAnalysis, 
  getCollinsStreetSentiment, 
  getCollinsStreetMarketSentiment 
} from '@/data/mockData';

export type DataMode = 'demo' | 'live' | 'auto';

export interface PropertyDataResult {
  analysis: PropertyAnalysis | null;
  sentiment: SentimentAnalysis | null;
  marketSentiment: MarketSentiment | null;
  dataSource: 'mock' | 'propguard' | 'realtybase' | 'supabase';
  error: string | null;
}

class PropertyDataService {
  private dataMode: DataMode = 'auto';
  private apiHealthStatus = {
    propguard: false,
    realtybase: false,
    supabase: true
  };

  setDataMode(mode: DataMode) {
    this.dataMode = mode;
  }

  getDataMode(): DataMode {
    return this.dataMode;
  }

  async analyzeProperty(query: string): Promise<PropertyDataResult> {
    // Force demo mode or Collins Street demo
    if (this.dataMode === 'demo' || isCollinsStreetAddress(query)) {
      return this.getMockData();
    }

    // Live mode - try all APIs with fallbacks
    if (this.dataMode === 'live') {
      return this.getLiveData(query);
    }

    // Auto mode - try live first, fallback to mock
    try {
      const liveResult = await this.getLiveData(query);
      if (liveResult.analysis || liveResult.sentiment || liveResult.marketSentiment) {
        return liveResult;
      }
    } catch (error) {
      console.warn('Live API failed, falling back to mock data:', error);
    }

    return this.getMockData();
  }

  private async getMockData(): Promise<PropertyDataResult> {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      analysis: getCollinsStreetPropertyAnalysis(),
      sentiment: getCollinsStreetSentiment(),
      marketSentiment: getCollinsStreetMarketSentiment(),
      dataSource: 'mock',
      error: null
    };
  }

  private async getLiveData(query: string): Promise<PropertyDataResult> {
    const results = await Promise.allSettled([
      this.trySupabaseEdgeFunction(query),
      this.tryPropGuardAPI(query),
      this.tryRealtyBaseAPI(query)
    ]);

    // Check results and return the first successful one
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.analysis) {
        return result.value;
      }
    }

    // If all failed, return error
    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message || 'Unknown error');

    return {
      analysis: null,
      sentiment: null,
      marketSentiment: null,
      dataSource: 'mock',
      error: `All APIs failed: ${errors.join(', ')}`
    };
  }

  private async trySupabaseEdgeFunction(query: string): Promise<PropertyDataResult> {
    try {
      const { data, error } = await supabase.functions.invoke('property-analysis', {
        body: { query }
      });

      if (error) throw error;

      return {
        analysis: data.analysis,
        sentiment: data.sentiment,
        marketSentiment: data.marketSentiment,
        dataSource: 'supabase',
        error: null
      };
    } catch (error) {
      throw new Error(`Supabase Edge Function failed: ${error}`);
    }
  }

  private async tryPropGuardAPI(query: string): Promise<PropertyDataResult> {
    try {
      const [propertyResult, sentimentResult, marketResult] = await Promise.allSettled([
        propGuardAPI.analyzeProperty(query),
        propGuardAPI.getPropertySentiment(query),
        propGuardAPI.getMarketSentiment({ location: query })
      ]);

      const analysis = propertyResult.status === 'fulfilled' ? propertyResult.value as PropertyAnalysis : null;
      const sentiment = sentimentResult.status === 'fulfilled' ? (sentimentResult.value as any).sentiment_analysis : null;
      const marketSentiment = marketResult.status === 'fulfilled' ? (marketResult.value as any).market_sentiment : null;

      if (!analysis && !sentiment && !marketSentiment) {
        throw new Error('No data returned from PropGuard API');
      }

      return {
        analysis,
        sentiment,
        marketSentiment,
        dataSource: 'propguard',
        error: null
      };
    } catch (error) {
      throw new Error(`PropGuard API failed: ${error}`);
    }
  }

  private async tryRealtyBaseAPI(query: string): Promise<PropertyDataResult> {
    try {
      const searchResults = await realtyBaseAPI.searchProperties({ location: query });
      if (!searchResults || searchResults.length === 0) {
        throw new Error('No properties found');
      }

      const property = searchResults[0];
      // Use type assertion since we know the API structure
      const propertyWithAI = property as any;
      
      const analysis: PropertyAnalysis = {
        current_valuation: propertyWithAI.ai_valuation?.estimated_value || 0,
        valuation_range: {
          min: propertyWithAI.ai_valuation?.confidence_range?.min || 0,
          max: propertyWithAI.ai_valuation?.confidence_range?.max || 0
        },
        risk_score: propertyWithAI.ai_insights?.risk_assessment?.overall_score || 0,
        confidence: propertyWithAI.ai_valuation?.confidence_score || 0,
        analysis_result: propertyWithAI.ai_insights || {}
      };

      return {
        analysis,
        sentiment: null,
        marketSentiment: null,
        dataSource: 'realtybase',
        error: null
      };
    } catch (error) {
      throw new Error(`RealtyBase API failed: ${error}`);
    }
  }

  async checkAPIHealth(): Promise<typeof this.apiHealthStatus> {
    const healthChecks = await Promise.allSettled([
      propGuardAPI.checkSystemHealth().then(() => true).catch(() => false),
      realtyBaseAPI.checkHealth().then(() => true).catch(() => false),
      supabase.functions.invoke('property-analysis', { body: { healthCheck: true } })
        .then(() => true).catch(() => false)
    ]);

    this.apiHealthStatus = {
      propguard: healthChecks[0].status === 'fulfilled' ? healthChecks[0].value : false,
      realtybase: healthChecks[1].status === 'fulfilled' ? healthChecks[1].value : false,
      supabase: healthChecks[2].status === 'fulfilled' ? healthChecks[2].value : false
    };

    return this.apiHealthStatus;
  }

  getAPIHealthStatus() {
    return this.apiHealthStatus;
  }
}

export const propertyDataService = new PropertyDataService();