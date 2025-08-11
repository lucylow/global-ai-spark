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
import { searchProperties } from '@/data/mockProperties';

export type DataMode = 'demo' | 'live' | 'auto';

export interface FireRiskData {
  riskScore: number;
  riskLevel: string;
  nearbyFires: number;
  closestFireDistance: number;
  totalFRP: number;
  dataSource: string;
  lastUpdated: string;
}

export interface PropertyDataResult {
  analysis: PropertyAnalysis | null;
  sentiment: SentimentAnalysis | null;
  marketSentiment: MarketSentiment | null;
  fireRisk: FireRiskData | null;
  dataSource: 'mock' | 'propguard' | 'realtybase' | 'supabase';
  error: string | null;
}

class PropertyDataService {
  private dataMode: DataMode = 'demo';
  private apiHealthStatus = {
    propguard: false,
    realtybase: false,
    supabase: true,
    nasa: false
  };

  setDataMode(mode: DataMode) {
    this.dataMode = mode;
  }

  getDataMode(): DataMode {
    return this.dataMode;
  }

  async analyzeProperty(query: string): Promise<PropertyDataResult> {
    // Force demo mode - now supports dynamic property search
    if (this.dataMode === 'demo') {
      return this.getMockData(query);
    }

    // Live mode - try all APIs with fallbacks
    if (this.dataMode === 'live') {
      try {
        return await this.getLiveData(query);
      } catch (error) {
        console.warn('Live API failed, falling back to mock data:', error);
        return this.getMockData(query);
      }
    }

    // Auto mode - use mock data by default to ensure functionality
    return this.getMockData(query);
  }

  private async getMockData(query?: string): Promise<PropertyDataResult> {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use dynamic property search if query provided
    if (query) {
      const properties = searchProperties(query);
      if (properties.length > 0) {
        const property = properties[0];
        
        return {
          analysis: {
            current_valuation: property.valuation,
            valuation_range: property.valuationRange,
            risk_score: property.riskScore,
            confidence: property.confidence,
            analysis_result: {
              current_valuation: property.valuation,
              risk_score: property.riskScore,
              confidence: property.confidence
            }
          },
          sentiment: { sentiment: Math.random() * 10, risk_level: property.riskScore },
          marketSentiment: {
            sentiment_score: Math.random() * 10,
            trend: property.riskScore > 70 ? 'bearish' : 'bullish',
            confidence: property.confidence,
            summary: `Market analysis for ${property.address}`
          },
          fireRisk: {
            riskScore: property.risks.fire / 100,
            riskLevel: property.risks.fire > 70 ? 'High' : 'Moderate',
            nearbyFires: Math.floor(Math.random() * 5),
            closestFireDistance: 10 + Math.random() * 40,
            totalFRP: property.risks.fire + Math.random() * 20,
            dataSource: 'mock',
            lastUpdated: new Date().toISOString()
          },
          dataSource: 'mock',
          error: null
        };
      }
    }

    // Fallback to Collins Street
    return {
      analysis: getCollinsStreetPropertyAnalysis(),
      sentiment: getCollinsStreetSentiment(),
      marketSentiment: getCollinsStreetMarketSentiment(),
      fireRisk: {
        riskScore: 0.72,
        riskLevel: 'High',
        nearbyFires: 3,
        closestFireDistance: 15.2,
        totalFRP: 84.5,
        dataSource: 'mock',
        lastUpdated: new Date().toISOString()
      },
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
      fireRisk: null,
      dataSource: 'mock',
      error: `All APIs failed: ${errors.join(', ')}`
    };
  }

  private async trySupabaseEdgeFunction(query: string): Promise<PropertyDataResult> {
    try {
      // Get property coordinates (mock for now, should be extracted from query)
      const coords = this.extractCoordinates(query);
      
      // Call property analysis
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('property-analysis', {
        body: { query }
      });

      if (analysisError) throw analysisError;

      // Call NASA fire risk analysis
      let fireRisk = null;
      try {
        const { data: fireData, error: fireError } = await supabase.functions.invoke('nasa-fire-risk', {
          body: { 
            latitude: coords.lat, 
            longitude: coords.lng,
            radiusKm: 50 
          }
        });

        if (!fireError && fireData?.fireRisk) {
          fireRisk = fireData.fireRisk;
        }
      } catch (fireErr) {
        console.warn('Fire risk analysis failed:', fireErr);
      }

      return {
        analysis: analysisData.analysis,
        sentiment: analysisData.sentiment,
        marketSentiment: analysisData.marketSentiment,
        fireRisk,
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
        fireRisk: null, // PropGuard API doesn't provide NASA fire data
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
        fireRisk: null, // RealtyBase doesn't provide NASA fire data
        dataSource: 'realtybase',
        error: null
      };
    } catch (error) {
      throw new Error(`RealtyBase API failed: ${error}`);
    }
  }

  async checkAPIHealth(): Promise<typeof this.apiHealthStatus> {
    try {
      const healthChecks = await Promise.allSettled([
        propGuardAPI.checkSystemHealth().then(() => true).catch(() => false),
        realtyBaseAPI.checkHealth().then(() => true).catch(() => false),
        supabase.functions.invoke('property-analysis', { body: { healthCheck: true } })
          .then(() => true).catch(() => false),
        supabase.functions.invoke('nasa-fire-risk', { body: { latitude: -33.8688, longitude: 151.2093 } })
          .then(() => true).catch(() => false)
      ]);

      this.apiHealthStatus = {
        propguard: healthChecks[0].status === 'fulfilled' ? healthChecks[0].value : false,
        realtybase: healthChecks[1].status === 'fulfilled' ? healthChecks[1].value : false,
        supabase: healthChecks[2].status === 'fulfilled' ? healthChecks[2].value : false,
        nasa: healthChecks[3].status === 'fulfilled' ? healthChecks[3].value : false
      };
    } catch (error) {
      console.warn('API health check failed:', error);
      this.apiHealthStatus = {
        propguard: false,
        realtybase: false,
        supabase: false,
        nasa: false
      };
    }

    return this.apiHealthStatus;
  }

  getAPIHealthStatus() {
    return this.apiHealthStatus;
  }

  // Helper function to extract coordinates from address query
  private extractCoordinates(query: string): { lat: number; lng: number } {
    // For Collins Street demo
    if (isCollinsStreetAddress(query)) {
      return { lat: -37.8136, lng: 144.9631 };
    }
    
    // For other Australian cities (rough coordinates)
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      'sydney': { lat: -33.8688, lng: 151.2093 },
      'melbourne': { lat: -37.8136, lng: 144.9631 },
      'brisbane': { lat: -27.4698, lng: 153.0251 },
      'perth': { lat: -31.9505, lng: 115.8605 },
      'adelaide': { lat: -34.9285, lng: 138.6007 },
      'canberra': { lat: -35.2809, lng: 149.1300 },
      'hobart': { lat: -42.8821, lng: 147.3272 },
      'darwin': { lat: -12.4634, lng: 130.8456 }
    };

    const queryLower = query.toLowerCase();
    for (const [city, coords] of Object.entries(cityCoords)) {
      if (queryLower.includes(city)) {
        return coords;
      }
    }

    // Default to Sydney if no match
    return { lat: -33.8688, lng: 151.2093 };
  }
}

export const propertyDataService = new PropertyDataService();