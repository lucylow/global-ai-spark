import { PropertyAnalysis, SentimentAnalysis, MarketSentiment } from '@/types/property';

// Mock data for "123 Collins Street, Melbourne VIC"
export const COLLINS_STREET_MOCK_DATA = {
  // Property Details
  propertyData: {
    address: '123 Collins Street, Melbourne VIC',
    bedrooms: 2,
    bathrooms: 2,
    land_size: 0, // Apartment
    year_built: 1985,
    property_type: 'Apartment',
    lat: -37.8136,
    lng: 144.9631
  },

  // Property Analysis
  propertyAnalysis: {
    current_valuation: 8500000,
    valuation_range: {
      min: 8200000,
      max: 8900000
    },
    risk_score: 66,
    confidence: 92,
    lvr: 0.72,
    analysis_result: {
      current_valuation: 8500000,
      risk_score: 66,
      climate_risk: 'High',
      lvr: 0.72,
      confidence: 92,
      story: 'Prime Collins Street location with exposure to Yarra River flooding. Heritage-listed building with strong fundamentals but climate adaptation required.',
      risk: {
        flood: 72,
        fire: 45,
        coastalErosion: 38,
        subsidence: 15,
        market: 25
      },
      compliance: {
        status: 'APPROVED' as const,
        reasons: ['APRA CPS 230 Compliant', 'Climate risk assessed'],
        lvr: 0.72,
        dti: 4.2
      }
    }
  } as PropertyAnalysis,

  // Sentiment Analysis
  sentimentAnalysis: {
    sentiment: 7.8,
    risk_level: 2.1
  } as SentimentAnalysis,

  // Market Sentiment
  marketSentiment: {
    sentiment_score: 4.2,
    trend: 'bullish' as const,
    confidence: 85,
    summary: 'Melbourne CBD showing positive momentum with 4.2% growth over 12 months. Strong demand in premium Collins Street corridor despite climate risk considerations.'
  } as MarketSentiment,

  // Risk Analysis Data
  riskData: {
    floodRisk: { score: 72, level: 'High', color: 'destructive' },
    fireRisk: { score: 45, level: 'Moderate', color: 'warning' },
    erosionRisk: { score: 38, level: 'Low', color: 'secondary' },
    cyclonesRisk: { score: 10, level: 'Very Low', color: 'secondary' }
  },

  // Climate Projections
  climateProjections: [
    { year: '2030', temp: '+1.4°C', rainfall: '-8%', seaLevel: '+12cm' },
    { year: '2050', temp: '+2.3°C', rainfall: '-15%', seaLevel: '+28cm' },
    { year: '2070', temp: '+3.1°C', rainfall: '-22%', seaLevel: '+46cm' }
  ],

  // Risk Mitigation
  riskMitigation: [
    {
      priority: 'High',
      type: 'Flood Risk',
      cost: '$4,200',
      roi: '1.8 years',
      actions: [
        'Install flood sensors and early warning system',
        'Upgrade stormwater drainage capacity',
        'Waterproof basement and lower levels'
      ]
    },
    {
      priority: 'Medium',
      type: 'Fire Risk',
      cost: '$62,000',
      roi: 'Risk reduction 18%',
      actions: [
        'Install fire-resistant building cladding',
        'Upgrade fire suppression systems',
        'Create defensible space planning'
      ]
    }
  ],

  // System Health Status
  systemHealth: {
    propguard: { success: true, message: 'Online', latency: '142ms' },
    llm: { success: true, message: 'OpenAI GPT-4 Active', latency: '89ms' },
    blockchain: { success: true, message: 'Syncing (98%)', latency: '256ms' },
    xnode: { success: true, message: 'Real Estate API Connected', latency: '134ms' },
    pipeline: { success: true, message: 'Data Pipeline Active', latency: '67ms' }
  },

  // Analytics Confidence Timeline
  confidenceGrowth: [
    { date: '2023-01', confidence: 82 },
    { date: '2023-06', confidence: 85 },
    { date: '2023-12', confidence: 88 },
    { date: '2024-01', confidence: 92 }
  ]
};

// Helper function to check if address matches Collins Street
export const isCollinsStreetAddress = (address: string): boolean => {
  return address.toLowerCase().includes('123 collins street') || 
         address.toLowerCase().includes('collins street, melbourne');
};

// Export specific mock data getters
export const getCollinsStreetPropertyAnalysis = (): PropertyAnalysis => 
  COLLINS_STREET_MOCK_DATA.propertyAnalysis;

export const getCollinsStreetSentiment = (): SentimentAnalysis => 
  COLLINS_STREET_MOCK_DATA.sentimentAnalysis;

export const getCollinsStreetMarketSentiment = (): MarketSentiment => 
  COLLINS_STREET_MOCK_DATA.marketSentiment;

export const getCollinsStreetRiskData = () => 
  COLLINS_STREET_MOCK_DATA.riskData;

export const getCollinsStreetSystemHealth = () => 
  COLLINS_STREET_MOCK_DATA.systemHealth;