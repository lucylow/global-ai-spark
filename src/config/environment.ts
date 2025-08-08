// Environment Configuration
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://9yhyi3c8nkjv.manus.space/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'PropGuard AI',
  ENABLE_BLOCKCHAIN: import.meta.env.VITE_ENABLE_BLOCKCHAIN === 'true',
  ENABLE_XNODE: import.meta.env.VITE_ENABLE_XNODE === 'true',
  ENVIRONMENT: import.meta.env.MODE || 'development'
};

export const isProduction = ENV.ENVIRONMENT === 'production';
export const isDevelopment = ENV.ENVIRONMENT === 'development';