import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Home, Loader2, Building, CheckCircle2 } from 'lucide-react';
import { useEnhancedPropertySearch } from '@/hooks/useEnhancedPropertySearch';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

interface PropertySearchProps {
  onAnalyze: (query: string, analysisResult?: any) => void;
  isLoading: boolean;
  dataMode?: 'auto' | 'mock' | 'api';
  onDataModeChange?: (mode: 'auto' | 'mock' | 'api') => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ 
  onAnalyze, 
  isLoading: externalLoading,
  dataMode = 'auto',
  onDataModeChange 
}) => {
  const [query, setQuery] = useState('123 Collins Street, Melbourne VIC');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    isLoading: searchLoading,
    isSearching,
    searchResults,
    analysis,
    error,
    searchProperties,
    selectProperty,
    analyzeProperty,
    clearResults,
    setDataMode: setSearchDataMode
  } = useEnhancedPropertySearch();

  // Update data mode when prop changes
  useEffect(() => {
    setSearchDataMode(dataMode);
  }, [dataMode, setSearchDataMode]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 2) {
        await searchProperties(query);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, searchProperties]);

  const handleSelectProperty = async (result: any) => {
    setQuery(result.address);
    setShowSuggestions(false);
    
    try {
      const analysisResult = await analyzeProperty(result.address);
      if (analysisResult) {
        onAnalyze(result.address, analysisResult);
      }
    } catch (err) {
      console.error('Failed to analyze selected property:', err);
      onAnalyze(result.address);
    }
  };

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    try {
      const analysisResult = await analyzeProperty(query);
      onAnalyze(query, analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      onAnalyze(query);
    }
  };

  const handleDemoClick = async () => {
    const demoAddress = '123 Collins Street, Melbourne VIC 3000';
    setQuery(demoAddress);
    
    // For demo, always use mock data
    const mockResult = {
      property: {
        address: demoAddress,
        coordinates: { lat: -37.8136, lng: 144.9631 }
      },
      analysis: COLLINS_STREET_MOCK_DATA.propertyAnalysis,
      sentiment: COLLINS_STREET_MOCK_DATA.sentimentAnalysis,
      marketSentiment: COLLINS_STREET_MOCK_DATA.marketSentiment,
      dataSource: 'mock_demo'
    };
    
    onAnalyze(demoAddress, mockResult);
  };

  const isProcessing = externalLoading || searchLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-primary" />
          <span>Property Intelligence Assistant</span>
          <Badge variant="secondary">Enhanced Search</Badge>
          {analysis?.dataSource && (
            <Badge variant="outline" className="text-xs">
              {analysis.dataSource === 'mock_data' ? 'Demo Mode' : 
               analysis.dataSource === 'fallback' ? 'Offline Mode' : 'Live Data'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">⚠️ {error}</p>
          </div>
        )}
        
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any Australian property address..."
                className="pl-10 pr-10"
                onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button onClick={handleAnalyze} disabled={isProcessing || !query.trim()}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Home className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {/* Property Suggestions Dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={result.id || index}
                  onClick={() => handleSelectProperty(result)}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{result.address}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.suburb} {result.state} {result.postcode}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {result.type}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="p-2 bg-muted/50 text-xs text-muted-foreground text-center">
                Enhanced Property Search
              </div>
            </div>
          )}
        </div>

        {/* Demo Section */}
        <div className="space-y-3">{/**/}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDemoClick}
            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            <Building className="mr-2 h-4 w-4" />
            Try Demo: 123 Collins Street
          </Button>
          
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>Demo Property:</strong> 123 Collins Street - Prime CBD heritage commercial property with comprehensive risk assessment and $8.5M valuation
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-green-600 border-green-300">
              🌊 Flood Analysis ✓
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              🔥 Fire Risk ✓
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              🏗️ APRA Compliance ✓
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              🔗 Blockchain NFT ✓
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};