import { supabase } from '@/integrations/supabase/client';
import { PropertyAnalysis, SentimentAnalysis, MarketSentiment } from '@/types/property';
import { COLLINS_STREET_MOCK_DATA, isCollinsStreetAddress } from '@/data/mockData';

export interface PropertySearchResult {
  id: string;
  address: string;
  type: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface PropertyDetails {
  id: string;
  address: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  propertyType?: string;
  features?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyAnalysisResult {
  property: PropertyDetails;
  analysis: PropertyAnalysis;
  sentiment: SentimentAnalysis;
  marketSentiment: MarketSentiment;
  fireRisk?: any;
  dataSource: string;
  timestamp?: string;
  error?: string;
}

export class PropertyAnalysisService {
  private static instance: PropertyAnalysisService;
  private dataMode: 'auto' | 'mock' | 'api' = 'auto';

  public static getInstance(): PropertyAnalysisService {
    if (!PropertyAnalysisService.instance) {
      PropertyAnalysisService.instance = new PropertyAnalysisService();
    }
    return PropertyAnalysisService.instance;
  }

  public setDataMode(mode: 'auto' | 'mock' | 'api') {
    this.dataMode = mode;
  }

  public async searchProperties(query: string): Promise<PropertySearchResult[]> {
    try {
      console.log('Searching properties for:', query);

      if (this.dataMode === 'mock' || (this.dataMode === 'auto' && isCollinsStreetAddress(query))) {
        // Return mock data for Collins Street or when in mock mode
        return [{
          id: 'collins_street_mock',
          address: '123 Collins Street, Melbourne VIC 3000',
          type: 'Commercial',
          suburb: 'Melbourne',
          state: 'VIC',
          postcode: '3000'
        }];
      }

      const { data, error } = await supabase.functions.invoke('enhanced-property-search', {
        body: { query, action: 'autocomplete' }
      });

      if (error) {
        console.error('Property search error:', error);
        return [];
      }

      return data?.suggestions || [];
    } catch (error) {
      console.error('Property search failed:', error);
      return [];
    }
  }

  public async getPropertyDetails(propertyId: string): Promise<PropertyDetails | null> {
    try {
      console.log('Getting property details for:', propertyId);

      if (propertyId === 'collins_street_mock' || this.dataMode === 'mock') {
        return {
          id: 'collins_street_mock',
          address: '123 Collins Street, Melbourne VIC 3000',
          price: '$8,500,000',
          propertyType: 'Commercial Office',
          features: ['CBD Location', 'Heritage Building', 'Premium Finishes'],
          coordinates: { lat: -37.8136, lng: 144.9631 }
        };
      }

      const { data, error } = await supabase.functions.invoke('enhanced-property-search', {
        body: { propertyId, action: 'details' }
      });

      if (error) {
        console.error('Property details error:', error);
        return null;
      }

      return data?.property || null;
    } catch (error) {
      console.error('Failed to get property details:', error);
      return null;
    }
  }

  public async analyzeProperty(query: string, coordinates?: { lat: number; lng: number }): Promise<PropertyAnalysisResult> {
    try {
      console.log('Analyzing property:', query, 'Mode:', this.dataMode);

      // Use mock data for Collins Street or when in mock mode
      if (this.dataMode === 'mock' || (this.dataMode === 'auto' && isCollinsStreetAddress(query))) {
        return {
          property: {
            id: 'collins_street_mock',
            address: query,
            price: '$8,500,000',
            propertyType: 'Commercial Office',
            features: ['CBD Location', 'Heritage Building', 'Premium Finishes'],
            coordinates: { lat: -37.8136, lng: 144.9631 }
          },
          analysis: COLLINS_STREET_MOCK_DATA.propertyAnalysis,
          sentiment: COLLINS_STREET_MOCK_DATA.sentimentAnalysis,
          marketSentiment: COLLINS_STREET_MOCK_DATA.marketSentiment,
          fireRisk: { current_risk: 28, risk_level: 'Moderate', hotspots_nearby: 2, last_updated: new Date().toISOString() },
          dataSource: 'mock_data'
        };
      }

      // Try enhanced property search first
      const { data, error } = await supabase.functions.invoke('enhanced-property-search', {
        body: { query, action: 'analyze', coordinates }
      });

      if (error) {
        console.warn('Enhanced search failed, trying legacy function:', error);
        
        // Fallback to original property analysis function
        const { data: legacyData, error: legacyError } = await supabase.functions.invoke('property-analysis', {
          body: { query }
        });

        if (legacyError) {
          console.error('Both analysis methods failed:', legacyError);
          throw new Error('Property analysis unavailable');
        }

        return this.transformLegacyResponse(query, legacyData);
      }

      return {
        property: data.property,
        analysis: data.analysis,
        sentiment: data.sentiment,
        marketSentiment: data.marketSentiment,
        fireRisk: data.fireRisk,
        dataSource: data.dataSource || 'enhanced_search',
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('Property analysis failed:', error);
      
      // Return fallback mock data to ensure the app continues working
      return this.generateFallbackAnalysis(query, coordinates);
    }
  }

  private transformLegacyResponse(query: string, legacyData: any): PropertyAnalysisResult {
    return {
      property: {
        id: 'legacy_' + Date.now(),
        address: query,
        coordinates: { lat: -37.8136, lng: 144.9631 } // Default Melbourne coordinates
      },
      analysis: legacyData.analysis || this.generateMockAnalysis(),
      sentiment: legacyData.sentiment || { sentiment: 5.0, risk_level: 0.3 },
      marketSentiment: legacyData.marketSentiment || {
        sentiment_score: 4.0,
        trend: 'neutral' as const,
        confidence: 75,
        summary: `Market analysis for ${query}`
      },
      fireRisk: legacyData.fireRisk,
      dataSource: legacyData.dataSource || 'legacy_api'
    };
  }

  private generateFallbackAnalysis(query: string, coordinates?: { lat: number; lng: number }): PropertyAnalysisResult {
    const mockValuation = Math.floor(Math.random() * 5000000) + 1000000;
    const mockRisk = Math.floor(Math.random() * 40) + 30;
    
    return {
      property: {
        id: 'fallback_' + Date.now(),
        address: query,
        price: '$' + mockValuation.toLocaleString(),
        coordinates: coordinates || { lat: -37.8136, lng: 144.9631 }
      },
      analysis: {
        current_valuation: mockValuation,
        valuation_range: {
          min: Math.floor(mockValuation * 0.9),
          max: Math.floor(mockValuation * 1.1)
        },
        risk_score: mockRisk,
        confidence: Math.floor(Math.random() * 20) + 75,
        analysis_result: {
          current_valuation: mockValuation,
          risk_score: mockRisk,
          climate_risk: mockRisk > 60 ? 'High' : mockRisk > 40 ? 'Moderate' : 'Low',
          lvr: 0.7 + Math.random() * 0.2,
          confidence: Math.floor(Math.random() * 20) + 75,
          story: `Fallback analysis for ${query}. Property shows standard risk profile for the area.`,
          risk: {
            flood: Math.floor(Math.random() * 30) + 20,
            fire: Math.floor(Math.random() * 40) + 15,
            coastalErosion: Math.floor(Math.random() * 20) + 5,
            subsidence: Math.floor(Math.random() * 15) + 5,
            market: Math.floor(Math.random() * 30) + 20
          },
          compliance: {
            status: 'APPROVED' as const,
            reasons: ['Standard analysis completed'],
            lvr: 0.7 + Math.random() * 0.2,
            dti: 3.5 + Math.random() * 2
          }
        }
      },
      sentiment: {
        sentiment: 4.0 + Math.random() * 2,
        risk_level: mockRisk / 100
      },
      fireRisk: { current_risk: mockRisk, risk_level: mockRisk > 50 ? 'High' : 'Moderate', hotspots_nearby: Math.floor(Math.random() * 5), last_updated: new Date().toISOString() },
      marketSentiment: {
        sentiment_score: 3.5 + Math.random() * 2,
        trend: 'neutral' as const,
        confidence: 70,
        summary: `Fallback market analysis for ${query} area.`
      },
      dataSource: 'fallback',
      error: 'Using fallback data due to API unavailability'
    };
  }

  private generateMockAnalysis(): PropertyAnalysis {
    const valuation = Math.floor(Math.random() * 3000000) + 1000000;
    const risk = Math.floor(Math.random() * 50) + 25;
    
    return {
      current_valuation: valuation,
      valuation_range: {
        min: Math.floor(valuation * 0.85),
        max: Math.floor(valuation * 1.15)
      },
      risk_score: risk,
      confidence: Math.floor(Math.random() * 25) + 75,
      analysis_result: {
        current_valuation: valuation,
        risk_score: risk,
        climate_risk: risk > 60 ? 'High' : risk > 35 ? 'Moderate' : 'Low',
        lvr: 0.6 + Math.random() * 0.3,
        confidence: Math.floor(Math.random() * 25) + 75,
        story: 'Mock property analysis generated.',
        risk: {
          flood: Math.floor(Math.random() * 40) + 10,
          fire: Math.floor(Math.random() * 50) + 15,
          coastalErosion: Math.floor(Math.random() * 25) + 5,
          subsidence: Math.floor(Math.random() * 20) + 5,
          market: Math.floor(Math.random() * 35) + 15
        },
        compliance: {
          status: 'APPROVED' as const,
          reasons: ['Mock compliance check passed'],
          lvr: 0.6 + Math.random() * 0.3,
          dti: 3.0 + Math.random() * 2.5
        }
      }
    };
  }

  public async checkAPIHealth(): Promise<any> {
    try {
      const { data } = await supabase.functions.invoke('enhanced-property-search', {
        body: { query: 'health', action: 'search' }
      });
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        enhanced_search: true
      };
    } catch (error) {
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        error: error.message,
        enhanced_search: false
      };
    }
  }
}

// Export singleton instance
export const propertyAnalysisService = PropertyAnalysisService.getInstance();