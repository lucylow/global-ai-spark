import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { realtyBaseAPI } from '@/services/api/realtybase';
import { googleMapsAPI } from '@/services/api/maps';
import { propGuardIntegration } from '@/services/propguard-integration';

export const APITestPanel = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isTestingHealth, setIsTestingHealth] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [isTestingIntegration, setIsTestingIntegration] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isTestingAnalysis, setIsTestingAnalysis] = useState(false);

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

  const testAllIntegrations = async () => {
    setIsTestingIntegration(true);
    try {
      const result = await propGuardIntegration.testIntegrations();
      setIntegrationStatus(result);
    } catch (error) {
      setIntegrationStatus({ error: error.message });
    }
    setIsTestingIntegration(false);
  };

  const testPropertyAnalysis = async () => {
    setIsTestingAnalysis(true);
    try {
      const result = await propGuardIntegration.analyzeProperty('123 Collins Street, Melbourne VIC');
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult({ error: error.message });
    }
    setIsTestingAnalysis(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🧪</span>
          <span>PropGuard AI Integration Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Health Test */}
          <div className="space-y-3">
            <Button 
              onClick={testHealthEndpoint}
              disabled={isTestingHealth}
              className="w-full"
            >
              {isTestingHealth ? 'Testing...' : 'Test Realty Base'}
            </Button>
            
            {healthStatus && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Realty Base Status:</div>
                {healthStatus.error ? (
                  <Badge className="bg-red-100 text-red-800">Error: {healthStatus.error}</Badge>
                ) : (
                  <div className="space-y-1">
                    <Badge className="bg-green-100 text-green-800">
                      Status: {healthStatus.status || 'Connected'}
                    </Badge>
                    <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-20">
                      {JSON.stringify(healthStatus, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Integration Test */}
          <div className="space-y-3">
            <Button 
              onClick={testAllIntegrations}
              disabled={isTestingIntegration}
              className="w-full"
            >
              {isTestingIntegration ? 'Testing...' : 'Test All Integrations'}
            </Button>
            
            {integrationStatus && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Integration Status:</div>
                {integrationStatus.error ? (
                  <Badge className="bg-red-100 text-red-800">Error: {integrationStatus.error}</Badge>
                ) : (
                  <div className="space-y-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      Realty: {integrationStatus.realty_base?.status || 'Unknown'}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      Maps: {integrationStatus.google_maps?.status || 'Unknown'}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      AI: {integrationStatus.propguard_ai?.status || 'Unknown'}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Property Analysis Test */}
          <div className="space-y-3">
            <Button 
              onClick={testPropertyAnalysis}
              disabled={isTestingAnalysis}
              className="w-full"
            >
              {isTestingAnalysis ? 'Analyzing...' : 'Test Property Analysis'}
            </Button>
            
            {analysisResult && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Analysis Result:</div>
                {analysisResult.error ? (
                  <Badge className="bg-red-100 text-red-800">Error: {analysisResult.error}</Badge>
                ) : (
                  <div className="space-y-1">
                    <Badge className="bg-green-100 text-green-800">
                      Score: {analysisResult.propguard_score || 'N/A'}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      Recommendations: {analysisResult.recommendations?.length || 0}
                    </Badge>
                    <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-20">
                      {JSON.stringify(analysisResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Integration Status:</strong><br/>
          <strong>Realty Base:</strong> Supabase Edge Function + RapidAPI<br/>
          <strong>Google Maps:</strong> Supabase Edge Function + Google API<br/>
          <strong>PropGuard AI:</strong> Manus Backend Integration
        </div>
      </CardContent>
    </Card>
  );
};