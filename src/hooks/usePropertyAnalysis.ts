import { useState, useCallback } from 'react';
import { PropertyAnalysis, SentimentAnalysis, MarketSentiment } from '@/types/property';
import { propertyDataService, DataMode } from '@/services/propertyDataService';

export const usePropertyAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<DataMode>('auto');
  const [dataSource, setDataSource] = useState<string>('');
  const [apiHealth, setApiHealth] = useState<any>(null);

  const analyzeProperty = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      propertyDataService.setDataMode(dataMode);
      const result = await propertyDataService.analyzeProperty(query);
      
      setAnalysis(result.analysis);
      setSentiment(result.sentiment);
      setMarketSentiment(result.marketSentiment);
      setDataSource(result.dataSource);
      setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  }, [dataMode]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setSentiment(null);
    setMarketSentiment(null);
    setError(null);
    setDataSource('');
  }, []);

  const checkAPIHealth = useCallback(async () => {
    const health = await propertyDataService.checkAPIHealth();
    setApiHealth(health);
  }, []);

  const handleDataModeChange = useCallback((mode: DataMode) => {
    setDataMode(mode);
    propertyDataService.setDataMode(mode);
  }, []);

  return {
    isLoading,
    analysis,
    sentiment,
    marketSentiment,
    error,
    dataMode,
    dataSource,
    apiHealth,
    analyzeProperty,
    clearAnalysis,
    checkAPIHealth,
    setDataMode: handleDataModeChange
  };
};