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

  async generatePropertyRecommendations(propertyData: any) {
    return propGuardAPI.request('/llm/property-recommendations', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  async getInvestmentInsights(propertyData: any) {
    return propGuardAPI.request('/llm/investment-insights', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  async getPredictiveAnalysis(propertyData: any) {
    return propGuardAPI.request('/llm/predictive-analysis', {
      method: 'POST',
      body: JSON.stringify({ property_data: propertyData })
    });
  }

  async getMarketIntelligence(location: string, propertyType?: string) {
    return propGuardAPI.request('/llm/market-intelligence', {
      method: 'POST',
      body: JSON.stringify({ location, property_type: propertyType })
    });
  }

  async generateNaturalLanguageReport(analysisData: any) {
    return propGuardAPI.request('/llm/natural-language-report', {
      method: 'POST',
      body: JSON.stringify({ analysis_data: analysisData })
    });
  }

  async getChatResponse(message: string, context?: any) {
    return propGuardAPI.request('/llm/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
  }

  async getLLMHealth() {
    return propGuardAPI.request('/llm/health');
  }
}

export const llmAPI = new LLMAPI();