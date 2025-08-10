import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertySearch } from '@/components/dashboard/PropertySearch';
import { PropertyMap } from '@/components/maps/PropertyMap';
import { PropertyAnalytics } from '@/components/analytics/PropertyAnalytics';
import { usePropertyAnalysis } from '@/hooks/usePropertyAnalysis';
import { EnhancedPropertyAnalysis } from '@/services/propguard-integration';

export const EnhancedDashboard = () => {
  const { isLoading, analysis, analyzeProperty, searchProperties, getMarketAnalysis } = usePropertyAnalysis();
  const [currentAnalysis, setCurrentAnalysis] = useState<EnhancedPropertyAnalysis | null>(null);

  const handlePropertyAnalysis = async (query: string) => {
    try {
      const result = await analyzeProperty(query);
      setCurrentAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Premium Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PropGuard AI
                </h1>
                <p className="text-sm text-gray-500">AI-Driven Property Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Realty Base Connected
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Google Maps Integrated
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                AI-Powered Analysis
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Property Intelligence Assistant */}
        <PropertySearch onAnalyze={handlePropertyAnalysis} isLoading={isLoading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Map */}
          <PropertyMap 
            analysis={currentAnalysis} 
            onLocationSelect={(lat, lng) => console.log('Location selected:', lat, lng)}
          />

          {/* Analytics Panel */}
          <PropertyAnalytics analysis={currentAnalysis} />
        </div>

        {/* Detailed Analysis Tabs */}
        {currentAnalysis && (
          <Card className="mt-8 shadow-xl border-0">
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Property Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-600">Address</div>
                            <div className="font-medium">{currentAnalysis.property.address}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Value</div>
                            <div className="font-medium text-green-600">
                              ${currentAnalysis.property.price?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">PropGuard Score</div>
                            <div className="font-medium text-blue-600">{currentAnalysis.propguard_score}/100</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Location Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Schools Nearby</span>
                            <span className="font-medium">{currentAnalysis.location_analysis.risk_factors?.schools?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Transport Access</span>
                            <span className="font-medium">{currentAnalysis.location_analysis.risk_factors?.transport?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Amenities</span>
                            <span className="font-medium">{currentAnalysis.location_analysis.nearby_amenities?.length || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">AI Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Valuation Confidence</span>
                            <Badge className="bg-green-100 text-green-800">
                              {currentAnalysis.property.propguard_valuation?.confidence_score || 90}%
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Risk Grade</span>
                            <Badge className="bg-orange-100 text-orange-800">
                              {currentAnalysis.property.propguard_risk?.risk_grade || 'Medium'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Market Trend</span>
                            <Badge className="bg-blue-100 text-blue-800">
                              {currentAnalysis.property.propguard_market_sentiment?.trend || 'Stable'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Geocoding Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {currentAnalysis.location_analysis.geocode?.[0] ? (
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Formatted Address:</strong><br/>
                              {currentAnalysis.location_analysis.geocode[0].formatted_address}
                            </div>
                            <div>
                              <strong>Coordinates:</strong><br/>
                              {currentAnalysis.location_analysis.geocode[0].geometry.location.lat.toFixed(6)}, 
                              {currentAnalysis.location_analysis.geocode[0].geometry.location.lng.toFixed(6)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">Geocoding data not available</div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong>Flood Zones:</strong> {currentAnalysis.location_analysis.risk_factors?.flood_zones?.length || 0} nearby
                          </div>
                          <div>
                            <strong>Fire Stations:</strong> {currentAnalysis.location_analysis.risk_factors?.fire_stations?.length || 0} within 5km
                          </div>
                          <div>
                            <strong>Schools:</strong> {currentAnalysis.location_analysis.risk_factors?.schools?.length || 0} within 1km
                          </div>
                          <div>
                            <strong>Transport:</strong> {currentAnalysis.location_analysis.risk_factors?.transport?.length || 0} options
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="space-y-6">
                  <PropertyAnalytics analysis={currentAnalysis} />
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI-Generated Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                            <div className="text-sm">{rec}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EnhancedDashboard;