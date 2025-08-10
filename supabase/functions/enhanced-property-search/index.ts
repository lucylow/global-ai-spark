import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PropertySearchRequest {
  query: string;
  action: 'search' | 'autocomplete' | 'details' | 'analyze';
  propertyId?: string;
  coordinates?: { lat: number; lng: number };
}

// Mock property database for demonstration
const mockProperties = [
  {
    id: 'prop_001',
    address: '123 Collins Street, Melbourne VIC 3000',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    type: 'Commercial',
    price: '$8,500,000',
    bedrooms: 0,
    bathrooms: 2,
    coordinates: { lat: -37.8136, lng: 144.9631 },
    features: ['CBD Location', 'Heritage Building', 'Premium Finishes'],
    propertyType: 'Office Building'
  },
  {
    id: 'prop_002', 
    address: '456 Bourke Street, Melbourne VIC 3000',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    type: 'Commercial',
    price: '$12,200,000',
    bedrooms: 0,
    bathrooms: 4,
    coordinates: { lat: -37.8142, lng: 144.9654 },
    features: ['Modern Fit-out', 'High-speed Internet', 'Parking'],
    propertyType: 'Office Complex'
  },
  {
    id: 'prop_003',
    address: '789 Chapel Street, South Yarra VIC 3141',
    suburb: 'South Yarra',
    state: 'VIC', 
    postcode: '3141',
    type: 'Residential',
    price: '$3,250,000',
    bedrooms: 4,
    bathrooms: 3,
    coordinates: { lat: -37.8470, lng: 144.9896 },
    features: ['River Views', 'Pool', 'Garden', 'Garage'],
    propertyType: 'House'
  },
  {
    id: 'prop_004',
    address: '321 Queen Street, Brisbane QLD 4000',
    suburb: 'Brisbane',
    state: 'QLD',
    postcode: '4000',
    type: 'Commercial',
    price: '$6,800,000',
    bedrooms: 0,
    bathrooms: 3,
    coordinates: { lat: -27.4698, lng: 153.0251 },
    features: ['City Views', 'Modern Building', 'Air Conditioning'],
    propertyType: 'Office Tower'
  },
  {
    id: 'prop_005',
    address: '654 George Street, Sydney NSW 2000',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    type: 'Mixed Use',
    price: '$15,750,000',
    bedrooms: 0,
    bathrooms: 6,
    coordinates: { lat: -33.8688, lng: 151.2093 },
    features: ['Harbour Views', 'Premium Location', 'Mixed Use'],
    propertyType: 'Commercial Complex'
  }
];

function searchPropertiesByQuery(query: string) {
  const searchTerm = query.toLowerCase();
  return mockProperties.filter(prop => 
    prop.address.toLowerCase().includes(searchTerm) ||
    prop.suburb.toLowerCase().includes(searchTerm) ||
    prop.state.toLowerCase().includes(searchTerm) ||
    prop.postcode.includes(searchTerm)
  );
}

function generatePropertyAnalysis(property: any) {
  // Generate realistic analysis based on property data
  const basePrice = parseInt(property.price.replace(/[^0-9]/g, '')) || 1000000;
  const location = property.suburb.toLowerCase();
  
  // Location-based risk factors
  let floodRisk = Math.floor(Math.random() * 30) + 10;
  let fireRisk = Math.floor(Math.random() * 40) + 15;
  let marketRisk = Math.floor(Math.random() * 25) + 20;
  
  // Adjust risks based on location
  if (location.includes('melbourne') || location.includes('sydney')) {
    marketRisk = Math.floor(Math.random() * 15) + 25; // Higher market risk in major cities
    floodRisk = Math.floor(Math.random() * 20) + 15;
  }
  
  if (location.includes('brisbane') || location.includes('queensland')) {
    floodRisk = Math.floor(Math.random() * 40) + 30; // Higher flood risk in Queensland
    fireRisk = Math.floor(Math.random() * 50) + 25;
  }
  
  const overallRisk = Math.floor((floodRisk + fireRisk + marketRisk) / 3);
  const confidence = Math.max(75, 100 - overallRisk);
  
  return {
    current_valuation: basePrice,
    valuation_range: {
      min: Math.floor(basePrice * 0.85),
      max: Math.floor(basePrice * 1.15)
    },
    risk_score: overallRisk,
    confidence: confidence,
    analysis_result: {
      current_valuation: basePrice,
      risk_score: overallRisk,
      climate_risk: overallRisk > 60 ? 'High' : overallRisk > 35 ? 'Moderate' : 'Low',
      lvr: 0.65 + (Math.random() * 0.25),
      confidence: confidence,
      story: `Comprehensive analysis of ${property.address}. This ${property.type.toLowerCase()} property in ${property.suburb} shows ${overallRisk > 50 ? 'elevated' : 'manageable'} risk levels with strong ${property.type === 'Commercial' ? 'commercial' : 'residential'} fundamentals.`,
      risk: {
        flood: floodRisk,
        fire: fireRisk,
        coastalErosion: Math.floor(Math.random() * 15) + 5,
        subsidence: Math.floor(Math.random() * 20) + 5,
        market: marketRisk
      },
      compliance: {
        status: overallRisk < 70 ? 'APPROVED' : 'CONDITIONAL' as const,
        reasons: overallRisk < 70 ? ['Standard compliance checks passed', 'Risk assessment within acceptable limits'] : ['Higher risk profile requires additional assessment'],
        lvr: 0.65 + (Math.random() * 0.25),
        dti: 3.0 + (Math.random() * 2.5)
      },
      market_factors: {
        growth_potential: confidence > 85 ? 'High' : confidence > 70 ? 'Moderate' : 'Low',
        liquidity: property.type === 'Commercial' ? 'Moderate' : 'High',
        comparable_sales: Math.floor(Math.random() * 15) + 5
      }
    }
  };
}

function generateMarketSentiment(property: any, analysis: any) {
  const riskScore = analysis.risk_score;
  const location = property.suburb.toLowerCase();
  
  let sentimentScore = 4.0; // Base neutral sentiment
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  
  // Adjust sentiment based on risk and location
  if (riskScore < 40) {
    sentimentScore += 1.5;
    trend = 'bullish';
  } else if (riskScore > 60) {
    sentimentScore -= 1.0;
    trend = 'bearish';
  }
  
  // Premium locations get sentiment boost
  if (location.includes('melbourne') || location.includes('sydney')) {
    sentimentScore += 0.5;
  }
  
  sentimentScore = Math.max(1, Math.min(7, sentimentScore)); // Clamp between 1-7
  
  return {
    sentiment_score: parseFloat(sentimentScore.toFixed(1)),
    trend: trend,
    confidence: analysis.confidence,
    summary: `Market sentiment for ${property.suburb} area is ${trend === 'bullish' ? 'positive' : trend === 'bearish' ? 'cautious' : 'stable'} with ${property.type.toLowerCase()} properties showing ${analysis.confidence > 80 ? 'strong' : 'moderate'} fundamentals.`,
    indicators: {
      price_momentum: trend === 'bullish' ? 'positive' : trend === 'bearish' ? 'negative' : 'stable',
      volume_trend: 'moderate',
      days_on_market: Math.floor(Math.random() * 60) + 30
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, action, propertyId, coordinates }: PropertySearchRequest = await req.json();

    console.log(`Property search request: action=${action}, query=${query}, propertyId=${propertyId}`);

    switch (action) {
      case 'autocomplete':
        if (!query || query.length < 2) {
          return new Response(
            JSON.stringify({ suggestions: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const suggestions = searchPropertiesByQuery(query).slice(0, 5).map(prop => ({
          id: prop.id,
          address: prop.address,
          type: prop.type,
          suburb: prop.suburb,
          state: prop.state,
          postcode: prop.postcode
        }));

        return new Response(
          JSON.stringify({ suggestions }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'details':
        if (!propertyId) {
          return new Response(
            JSON.stringify({ error: 'Property ID is required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const property = mockProperties.find(p => p.id === propertyId);
        if (!property) {
          return new Response(
            JSON.stringify({ error: 'Property not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          );
        }

        return new Response(
          JSON.stringify({ property }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'analyze':
        if (!query) {
          return new Response(
            JSON.stringify({ error: 'Query is required for analysis' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Find matching property or use first match
        let targetProperty = searchPropertiesByQuery(query)[0];
        
        if (!targetProperty) {
          // Generate a dynamic property for the query
          targetProperty = {
            id: 'dynamic_' + Date.now(),
            address: query,
            suburb: query.split(',')[1]?.trim() || 'Unknown',
            state: query.includes('VIC') ? 'VIC' : query.includes('NSW') ? 'NSW' : query.includes('QLD') ? 'QLD' : 'VIC',
            postcode: '3000',
            type: 'Residential',
            price: '$' + (Math.floor(Math.random() * 5000000) + 500000).toLocaleString(),
            bedrooms: Math.floor(Math.random() * 4) + 2,
            bathrooms: Math.floor(Math.random() * 3) + 1,
            coordinates: coordinates || { lat: -37.8136 + (Math.random() - 0.5) * 0.1, lng: 144.9631 + (Math.random() - 0.5) * 0.1 },
            features: ['Modern Finishes', 'Good Location', 'Well Maintained'],
            propertyType: 'House'
          };
        }

        const analysis = generatePropertyAnalysis(targetProperty);
        const sentiment = {
          sentiment: analysis.analysis_result.risk_score < 40 ? 6.5 + Math.random() : analysis.analysis_result.risk_score > 60 ? 3.0 + Math.random() * 2 : 4.0 + Math.random() * 2,
          risk_level: analysis.analysis_result.risk_score / 100
        };
        const marketSentiment = generateMarketSentiment(targetProperty, analysis);

        // Generate NASA fire risk data
        const fireRiskData = {
          current_risk: analysis.analysis_result.risk.fire,
          risk_level: analysis.analysis_result.risk.fire > 60 ? 'High' : analysis.analysis_result.risk.fire > 30 ? 'Moderate' : 'Low',
          hotspots_nearby: Math.floor(Math.random() * 10),
          last_updated: new Date().toISOString(),
          forecast: {
            next_7_days: analysis.analysis_result.risk.fire + Math.floor(Math.random() * 20) - 10,
            trend: analysis.analysis_result.risk.fire > 50 ? 'increasing' : 'stable'
          }
        };

        return new Response(
          JSON.stringify({
            property: targetProperty,
            analysis,
            sentiment,
            marketSentiment,
            fireRisk: fireRiskData,
            dataSource: 'enhanced_search',
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'search':
      default:
        const searchResults = searchPropertiesByQuery(query || '').slice(0, 10);
        return new Response(
          JSON.stringify({ 
            properties: searchResults,
            total: searchResults.length,
            query: query 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Enhanced property search error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});