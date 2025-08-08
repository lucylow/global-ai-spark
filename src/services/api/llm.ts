// LLM Integration API Service
import { propGuardAPI } from './propguard';

export class LLMAPI {
  async getPropertySentiment(description: string) {
    return propGuardAPI.getPropertySentiment(description);
  }

  async getMarketSentiment(marketData: any) {
    return propGuardAPI.getMarketSentiment(marketData);
  }

  async generateLVRReport(propertyData: any) {
    return propGuardAPI.request('/llm/generate-lvr-report', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  async getRiskAssessment(propertyData: any) {
    return propGuardAPI.request('/llm/risk-assessment', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  async getComprehensiveAnalysis(propertyData: any) {
    return propGuardAPI.request('/llm/comprehensive-analysis', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  async getLLMHealth() {
    return propGuardAPI.request('/llm/health');
  }
}

export const llmAPI = new LLMAPI();