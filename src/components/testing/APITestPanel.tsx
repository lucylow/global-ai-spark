import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { realtyBaseAPI } from '@/services/api/realtybase';

export const APITestPanel = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isTestingHealth, setIsTestingHealth] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isTestingSearch, setIsTestingSearch] = useState(false);

  const testHealthEndpoint = async () => {
    setIsTestingHealth(true);
    try {
      const result = await realtyBaseAPI.checkHealth();
      setHealthStatus(result);
    } catch (error) {
      setHealthStatus({ error: error.message });
    }
    setIsTestingHealth(false);
  };

  const testPropertySearch = async () => {
    setIsTestingSearch(true);
    try {
      const result = await realtyBaseAPI.searchProperties({
        location: 'Melbourne VIC',
        property_type: 'for-sale',
        limit: 5
      });
      setSearchResults(result);
    } catch (error) {
      setSearchResults({ error: error.message });
    }
    setIsTestingSearch(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🧪</span>
          <span>RapidAPI Integration Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Health Test */}
          <div className="space-y-3">
            <Button 
              onClick={testHealthEndpoint}
              disabled={isTestingHealth}
              className="w-full"
            >
              {isTestingHealth ? 'Testing...' : 'Test Health Endpoint'}
            </Button>
            
            {healthStatus && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Health Status:</div>
                {healthStatus.error ? (
                  <Badge className="bg-red-100 text-red-800">Error: {healthStatus.error}</Badge>
                ) : (
                  <div className="space-y-1">
                    <Badge className="bg-green-100 text-green-800">
                      Status: {healthStatus.status || 'Connected'}
                    </Badge>
                    <pre className="text-xs bg-white p-2 rounded overflow-auto">
                      {JSON.stringify(healthStatus, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Test */}
          <div className="space-y-3">
            <Button 
              onClick={testPropertySearch}
              disabled={isTestingSearch}
              className="w-full"
            >
              {isTestingSearch ? 'Testing...' : 'Test Property Search'}
            </Button>
            
            {searchResults && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Search Results:</div>
                {searchResults.error ? (
                  <Badge className="bg-red-100 text-red-800">Error: {searchResults.error}</Badge>
                ) : (
                  <div className="space-y-1">
                    <Badge className="bg-green-100 text-green-800">
                      Found: {searchResults.length || 0} properties
                    </Badge>
                    <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(searchResults, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Backend URL:</strong> https://j6h5i7cpl1ye.manus.space<br/>
          <strong>Note:</strong> Ensure RAPIDAPI_KEY is configured on the backend server
        </div>
      </CardContent>
    </Card>
  );
};