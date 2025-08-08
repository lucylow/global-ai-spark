// Application Constants
export const APP_CONSTANTS = {
  APP_NAME: 'PropGuard AI',
  APP_DESCRIPTION: 'AI-Powered Property Risk Assessment & Valuation',
  API_VERSION: 'v1',
  DEFAULT_TIMEOUT: 10000,
  REFRESH_INTERVAL: 30000,
  
  // Risk thresholds
  RISK_THRESHOLDS: {
    LOW: 0.3,
    MEDIUM: 0.6,
    HIGH: 0.8
  },
  
  // LVR limits
  LVR_LIMITS: {
    RESIDENTIAL: 0.8,
    INVESTMENT: 0.7,
    COMMERCIAL: 0.65
  },
  
  // Supported property types
  PROPERTY_TYPES: [
    'house',
    'apartment',
    'townhouse',
    'unit',
    'commercial',
    'land'
  ] as const
};

export type PropertyType = typeof APP_CONSTANTS.PROPERTY_TYPES[number];