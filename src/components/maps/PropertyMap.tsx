import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedPropertyAnalysis } from '@/services/propguard-integration';
import { googleMapsAPI } from '@/services/api/maps';

interface PropertyMapProps {
  analysis: EnhancedPropertyAnalysis | null;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ analysis, onLocationSelect }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Mock Google Maps integration for now - in production you'd use the actual Google Maps SDK
  const loadGoogleMapsData = async () => {
    if (!analysis?.property?.address) return;
    
    try {
      const locationData = await googleMapsAPI.analyzePropertyLocation(analysis.property.address);
      console.log('Google Maps data loaded:', locationData);
      setMapLoaded(true);
    } catch (error) {
      console.error('Failed to load map data:', error);
      setMapError('Failed to load map data');
    }
  };

  useEffect(() => {
    if (analysis) {
      loadGoogleMapsData();
    }
  }, [analysis]);

  if (!analysis) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">🗺️</div>
            <div>Select a property to view location analysis</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const property = analysis.property;
  const locationAnalysis = analysis.location_analysis;

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Property Location Analysis</span>
          <Badge className="bg-blue-100 text-blue-800">
            PropGuard Score: {analysis.propguard_score}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="relative h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
          {/* Property Marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-white text-2xl">📍</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm">
                <h3 className="font-bold text-lg text-gray-800">{property.address}</h3>
                <div className="flex items-center justify-center mt-3 space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ${property.price ? (property.price / 1000000).toFixed(1) + 'M' : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{analysis.propguard_score}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="absolute top-4 left-4">
            <div className="bg-white rounded-xl p-3 shadow-xl border border-gray-100">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm">Risk Factors</h4>
              <div className="space-y-2">
                {property.propguard_risk && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Flood</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {property.propguard_risk.climate_risks?.flood || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Fire</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {property.propguard_risk.climate_risks?.fire || 0}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-xl p-3 shadow-xl border border-gray-100">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm">Nearby</h4>
              <div className="space-y-1 text-xs">
                <div>🏫 Schools: {locationAnalysis?.risk_factors?.schools?.length || 0}</div>
                <div>🚂 Transport: {locationAnalysis?.risk_factors?.transport?.length || 0}</div>
                <div>🏪 Amenities: {locationAnalysis?.nearby_amenities?.length || 0}</div>
                <div>🚒 Fire Stations: {locationAnalysis?.risk_factors?.fire_stations?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Bottom Recommendations */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white rounded-xl p-3 shadow-xl border border-gray-100">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm">AI Recommendations</h4>
              <div className="space-y-1">
                {analysis.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {mapError && (
            <div className="absolute bottom-4 right-4">
              <Badge className="bg-red-100 text-red-800 text-xs">
                Map Error: {mapError}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};