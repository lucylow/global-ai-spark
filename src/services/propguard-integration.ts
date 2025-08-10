import { realtyBaseAPI, PropertyDetails, PropertySearchParams } from './api/realtybase';
import { googleMapsAPI } from './api/maps';
import { propGuardAPI } from './api/propguard';

export interface EnhancedPropertyAnalysis {
  property: PropertyDetails;
  location_analysis: {
    geocode: any[];
    nearby_amenities: any[];
    risk_factors: any;
  };
  ai_insights: {
    valuation_analysis: any;
    risk_assessment: any;
    market_sentiment: any;
    compliance_check: any;
  };
  propguard_score: number;
  recommendations: string[];
}

class PropGuardIntegrationService {
  
  // Comprehensive property analysis combining all services
  async analyzeProperty(address: string): Promise<EnhancedPropertyAnalysis> {
    try {
      console.log(`Starting comprehensive analysis for: ${address}`);
      
      // Step 1: Search for property in Realty Base
      const searchResults = await realtyBaseAPI.searchProperties({
        location: address,
        property_type: 'for-sale',
        limit: 1
      });

      if (searchResults.length === 0) {
        throw new Error('Property not found in database');
      }

      const property = searchResults[0];

      // Step 2: Get location analysis from Google Maps
      const locationAnalysis = await googleMapsAPI.analyzePropertyLocation(address);

      // Step 3: Get AI insights from PropGuard
      const [valuationAnalysis, riskAssessment, marketSentiment] = await Promise.all([
        propGuardAPI.analyzeProperty(`Analyze valuation for ${property.address}`),
        propGuardAPI.analyzeProperty(`Assess risks for ${property.address}`),
        propGuardAPI.getPropertySentiment(property.address)
      ]);

      // Step 4: Generate comprehensive PropGuard score
      const propguardScore = this.calculatePropGuardScore(property, locationAnalysis, riskAssessment);

      // Step 5: Generate recommendations
      const recommendations = this.generateRecommendations(property, locationAnalysis, riskAssessment);

      return {
        property,
        location_analysis: locationAnalysis,
        ai_insights: {
          valuation_analysis: valuationAnalysis,
          risk_assessment: riskAssessment,
          market_sentiment: marketSentiment,
          compliance_check: await this.checkCompliance(property)
        },
        propguard_score: propguardScore,
        recommendations
      };

    } catch (error) {
      console.error('Property analysis error:', error);
      throw error;
    }
  }

  // Search properties with enhanced data
  async searchPropertiesEnhanced(params: PropertySearchParams): Promise<PropertyDetails[]> {
    try {
      const properties = await realtyBaseAPI.searchProperties(params);
      
      // Enhance each property with basic location data
      const enhancedProperties = await Promise.all(
        properties.slice(0, 5).map(async (property) => {
          try {
            const geocode = await googleMapsAPI.geocodeAddress(property.address);
            return {
              ...property,
              enhanced_location: geocode[0] || null
            };
          } catch (error) {
            console.warn(`Failed to enhance property ${property.address}:`, error);
            return property;
          }
        })
      );

      return enhancedProperties;
    } catch (error) {
      console.error('Enhanced search error:', error);
      throw error;
    }
  }

  // Test all integrations
  async testIntegrations(): Promise<{
    realty_base: any;
    google_maps: any;
    propguard_ai: any;
  }> {
    try {
      const [realtyHealth, mapsHealth, propguardHealth] = await Promise.all([
        realtyBaseAPI.checkHealth().catch(e => ({ error: e.message })),
        googleMapsAPI.checkHealth().catch(e => ({ error: e.message })),
        propGuardAPI.checkSystemHealth().catch(e => ({ error: e.message }))
      ]);

      return {
        realty_base: realtyHealth,
        google_maps: mapsHealth,
        propguard_ai: propguardHealth
      };
    } catch (error) {
      console.error('Integration test error:', error);
      throw error;
    }
  }

  // Generate market analysis for a location
  async getMarketAnalysis(location: string): Promise<{
    realty_data: any;
    location_insights: any;
    ai_analysis: any;
  }> {
    try {
      const [realtyMarket, locationData, aiAnalysis] = await Promise.all([
        realtyBaseAPI.getMarketAnalysis({ 
          location, 
          property_type: 'for-sale',
          analysis_depth: 'comprehensive' 
        }),
        googleMapsAPI.analyzePropertyLocation(location),
        propGuardAPI.getMarketSentiment({ location })
      ]);

      return {
        realty_data: realtyMarket,
        location_insights: locationData,
        ai_analysis: aiAnalysis
      };
    } catch (error) {
      console.error('Market analysis error:', error);
      throw error;
    }
  }

  private calculatePropGuardScore(property: PropertyDetails, locationAnalysis: any, riskAssessment: any): number {
    let score = 70; // Base score

    // Property value factors
    if (property.propguard_valuation?.confidence_score) {
      score += property.propguard_valuation.confidence_score * 0.2;
    }

    // Risk factors
    if (property.propguard_risk?.overall_score) {
      score -= (property.propguard_risk.overall_score - 50) * 0.3;
    }

    // Location factors
    const amenityScore = Math.min(locationAnalysis.nearby_amenities?.length || 0, 10) * 2;
    score += amenityScore;

    // Transport access
    const transportScore = Math.min(locationAnalysis.risk_factors?.transport?.length || 0, 5) * 3;
    score += transportScore;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private generateRecommendations(property: PropertyDetails, locationAnalysis: any, riskAssessment: any): string[] {
    const recommendations: string[] = [];

    // Risk-based recommendations
    if (property.propguard_risk?.climate_risks?.flood > 70) {
      recommendations.push("Consider flood insurance due to high flood risk in the area");
    }

    if (property.propguard_risk?.climate_risks?.fire > 60) {
      recommendations.push("Implement fire safety measures and check building materials");
    }

    // Location-based recommendations
    if (locationAnalysis.risk_factors?.transport?.length < 2) {
      recommendations.push("Limited public transport access may affect resale value");
    }

    if (locationAnalysis.nearby_amenities?.length > 5) {
      recommendations.push("Excellent amenity access enhances property value");
    }

    // Market recommendations
    if (property.propguard_market_sentiment?.trend === 'bullish') {
      recommendations.push("Strong market conditions favor this investment");
    }

    return recommendations;
  }

  private async checkCompliance(property: PropertyDetails): Promise<any> {
    try {
      return await propGuardAPI.analyzeProperty(`Check APRA compliance for ${property.address}`);
    } catch (error) {
      console.warn('Compliance check failed:', error);
      return { error: 'Compliance check unavailable' };
    }
  }
}

export const propGuardIntegration = new PropGuardIntegrationService();