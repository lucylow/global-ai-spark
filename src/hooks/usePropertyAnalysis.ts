import { useState } from 'react';
import { propGuardIntegration, EnhancedPropertyAnalysis } from '@/services/propguard-integration';
import { toast } from 'sonner';

export const usePropertyAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EnhancedPropertyAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeProperty = async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast.info('Starting comprehensive property analysis...');
      
      const result = await propGuardIntegration.analyzeProperty(address);
      setAnalysis(result);
      
      toast.success(`Analysis complete! PropGuard Score: ${result.propguard_score}/100`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      toast.error(`Analysis failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchProperties = async (params: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast.info('Searching properties with enhanced data...');
      
      const results = await propGuardIntegration.searchPropertiesEnhanced(params);
      
      toast.success(`Found ${results.length} properties with enhanced data`);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toast.error(`Search failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketAnalysis = async (location: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast.info('Analyzing market conditions...');
      
      const result = await propGuardIntegration.getMarketAnalysis(location);
      
      toast.success('Market analysis complete');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Market analysis failed';
      setError(errorMessage);
      toast.error(`Market analysis failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    analysis,
    error,
    analyzeProperty,
    searchProperties,
    getMarketAnalysis
  };
};