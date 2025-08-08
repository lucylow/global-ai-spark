import { ENV } from '@/config/environment';

export interface PropertySearchParams {
  location: string;
  property_type?: 'for-sale' | 'for-rent' | 'sold';
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_category?: 'house' | 'unit' | 'townhouse' | 'villa' | 'land';
  sort_by?: 'price-asc' | 'price-desc' | 'date-desc' | 'relevance';
  limit?: number;
}

export interface PropertyDetails {
  listing_id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  car_spaces: number;
  land_size: number;
  building_size: number;
  features: string[];
  photos: string[];
  latitude?: number;
  longitude?: number;
  // PropGuard AI enhanced data
  propguard_valuation?: {
    ai_valuation: number;
    confidence_score: number;
    valuation_range: {
      min: number;
      max: number;
    };
  };
  propguard_risk?: {
    risk_grade: 'Low' | 'Medium' | 'High';
    overall_score: number;
    climate_risks: {
      flood: number;
      fire: number;
      coastal: number;
      geological: number;
    };
    market_risks: {
      volatility: number;
      liquidity: number;
    };
  };
  propguard_market_sentiment?: {
    sentiment_score: number;
    trend: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    summary: string;
    indicators: {
      price_growth: number;
      auction_clearance: number;
      days_on_market: number;
      volume_change: number;
    };
  };
  propguard_compliance?: {
    apra_cps230_compliant: boolean;
    risk_category: string;
    compliance_score: number;
    nccp_act_compliant: boolean;
    basel_iii_compliant: boolean;
    lvr_thresholds: {
      '80_percent': number;
      '90_percent': number;
      '95_percent': number;
    };
  };
}

export interface MarketAnalysis {
  location: string;
  property_type: string;
  market_metrics: {
    median_price: number;
    price_growth_yoy: number;
    days_on_market: number;
    auction_clearance_rate: number;
    listing_volume: number;
  };
  ai_insights: {
    market_sentiment: string;
    investment_outlook: string;
    risk_assessment: string;
    recommendations: string[];
  };
  trend_analysis: {
    price_trend: 'rising' | 'falling' | 'stable';
    market_heat: 'hot' | 'warm' | 'cool' | 'cold';
    supply_demand_balance: 'oversupply' | 'balanced' | 'undersupply';
  };
}

export interface ValuationReport {
  report_id: string;
  property_details: PropertyDetails;
  comprehensive_analysis: {
    ai_valuation: number;
    confidence_level: number;
    methodology: string;
    comparable_properties: any[];
  };
  risk_assessment: {
    overall_risk: string;
    risk_factors: string[];
    mitigation_strategies: string[];
  };
  market_analysis: MarketAnalysis;
  compliance_certificate: {
    apra_compliant: boolean;
    certificate_id: string;
    blockchain_hash?: string;
  };
  generated_at: string;
}

class RealtyBaseAPI {
  private baseURL = ENV.API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/realty${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('RealtyBase API Error:', error);
      throw error;
    }
  }

  // Health check
  async checkHealth(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // Search properties with AI enhancement
  async searchProperties(params: PropertySearchParams): Promise<PropertyDetails[]> {
    const response = await this.request<{ properties: PropertyDetails[] }>('/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.properties;
  }

  // Get detailed property information with PropGuard AI analysis
  async getPropertyDetails(listingId: string): Promise<PropertyDetails> {
    const response = await this.request<{ property_details: PropertyDetails }>(`/property/${listingId}`);
    return response.property_details;
  }

  // Get property history and trends
  async getPropertyHistory(listingId: string): Promise<{
    price_history: Array<{ date: string; price: number; event_type: string }>;
    market_trends: {
      suburb_trends: any;
      comparable_sales: any[];
    };
  }> {
    return this.request('/property-history', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    });
  }

  // Comprehensive market analysis
  async getMarketAnalysis(params: {
    location: string;
    property_type: string;
    analysis_depth?: 'basic' | 'comprehensive';
  }): Promise<MarketAnalysis> {
    const response = await this.request<{ market_analysis: MarketAnalysis }>('/market-analysis', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.market_analysis;
  }

  // Generate comprehensive valuation report
  async generateValuationReport(params: {
    listing_id: string;
    loan_amount?: number;
    include_blockchain?: boolean;
  }): Promise<ValuationReport> {
    const response = await this.request<{ report: ValuationReport }>('/valuation-report', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.report;
  }

  // Bulk property analysis (up to 20 properties)
  async bulkAnalysis(listingIds: string[]): Promise<{
    analyses: PropertyDetails[];
    portfolio_summary: {
      total_value: number;
      average_risk: string;
      diversification_score: number;
      recommendations: string[];
    };
  }> {
    return this.request('/bulk-analysis', {
      method: 'POST',
      body: JSON.stringify({ listing_ids: listingIds }),
    });
  }

  // Cache management
  async getCacheStatus(): Promise<{ cache_stats: any }> {
    return this.request('/cache/status');
  }

  async clearCache(): Promise<{ message: string }> {
    return this.request('/cache/clear', { method: 'POST' });
  }
}

export const realtyBaseAPI = new RealtyBaseAPI();