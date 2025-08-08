import { useState, useCallback } from 'react';
import { propGuardAPI } from '@/services/api/propguard';
import { PropertyAnalysis, SentimentAnalysis, MarketSentiment } from '@/types/property';

export const usePropertyAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeProperty = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [propertyResult, sentimentResult, marketResult] = await Promise.allSettled([
        propGuardAPI.analyzeProperty(query),
        propGuardAPI.getPropertySentiment(query),
        propGuardAPI.getMarketSentiment({ location: query })
      ]);

      if (propertyResult.status === 'fulfilled') {
        setAnalysis(propertyResult.value as PropertyAnalysis);
      }

      if (sentimentResult.status === 'fulfilled') {
        const result = sentimentResult.value as any;
        setSentiment(result.sentiment_analysis);
      }

      if (marketResult.status === 'fulfilled') {
        const result = marketResult.value as any;
        setMarketSentiment(result.market_sentiment);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setSentiment(null);
    setMarketSentiment(null);
    setError(null);
  }, []);

  return {
    isLoading,
    analysis,
    sentiment,
    marketSentiment,
    error,
    analyzeProperty,
    clearAnalysis
  };
};