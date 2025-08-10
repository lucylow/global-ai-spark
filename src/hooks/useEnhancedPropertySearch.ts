import { useState, useCallback } from 'react';
import { propertyAnalysisService, PropertySearchResult, PropertyDetails, PropertyAnalysisResult } from '@/services/propertyAnalysisService';

export const useEnhancedPropertySearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PropertySearchResult[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);
  const [analysis, setAnalysis] = useState<PropertyAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchProperties = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await propertyAnalysisService.searchProperties(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Property search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const selectProperty = useCallback(async (propertyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const details = await propertyAnalysisService.getPropertyDetails(propertyId);
      setSelectedProperty(details);
      return details;
    } catch (err) {
      console.error('Failed to select property:', err);
      setError(err instanceof Error ? err.message : 'Failed to load property details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeProperty = useCallback(async (query: string, coordinates?: { lat: number; lng: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await propertyAnalysisService.analyzeProperty(query, coordinates);
      setAnalysis(result);
      setSelectedProperty(result.property);
      
      if (result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      console.error('Property analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSelectedProperty(null);
    setAnalysis(null);
    setError(null);
  }, []);

  const setDataMode = useCallback((mode: 'auto' | 'mock' | 'api') => {
    propertyAnalysisService.setDataMode(mode);
    clearResults();
  }, [clearResults]);

  return {
    // State
    isLoading,
    isSearching,
    searchResults,
    selectedProperty,
    analysis,
    error,

    // Actions
    searchProperties,
    selectProperty,
    analyzeProperty,
    clearResults,
    setDataMode,

    // Derived data
    hasResults: searchResults.length > 0,
    hasAnalysis: analysis !== null,
    analysisData: analysis ? {
      valuation: analysis.analysis,
      sentiment: analysis.sentiment,
      marketSentiment: analysis.marketSentiment,
      fireRisk: analysis.fireRisk,
      dataSource: analysis.dataSource
    } : null
  };
};