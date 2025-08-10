import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Waves, Flame, Mountain, Navigation, MapPin, Plus, Minus } from 'lucide-react';

interface PropertyMapProps {
  property?: {
    coordinates?: { lat: number; lng: number };
    address?: string;
    riskData?: {
      flood: number;
      fire: number;
      coastal: number;
    };
  };
  riskData?: {
    flood?: number;
    fire?: number;
    coastalErosion?: number;
    subsidence?: number;
  };
  activeLayers?: {
    flood: boolean;
    fire: boolean;
    erosion: boolean;
  };
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  property, 
  riskData,
  activeLayers = {
    flood: true,
    fire: true,
    erosion: false
  }
}) => {
  const [zoom, setZoom] = useState(15);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const coordinates = property?.coordinates || { lat: -37.8136, lng: 144.9631 };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const generateRiskVisualization = () => {
    const currentRiskData = property?.riskData || riskData;
    if (!currentRiskData) return [];
    
    const risks = [
      { 
        label: 'Flood Risk', 
        value: currentRiskData.flood || 0, 
        color: 'bg-blue-500', 
        active: activeLayers.flood 
      },
      { 
        label: 'Fire Risk', 
        value: currentRiskData.fire || 0, 
        color: 'bg-orange-500', 
        active: activeLayers.fire 
      },
      { 
        label: 'Erosion Risk', 
        value: (property?.riskData?.coastal || riskData?.coastalErosion || 0), 
        color: 'bg-yellow-500', 
        active: activeLayers.erosion 
      }
    ];
    
    return risks.filter(risk => risk.active && risk.value > 20);
  };

  // Google Maps style component
  const GoogleMapsStyle = () => (
    <div className="w-full h-96 relative bg-gradient-to-br from-green-100 to-blue-100 rounded overflow-hidden">
      {/* Grid pattern to simulate map */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* Streets overlay */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Main roads */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d1d5db" strokeWidth="3" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#d1d5db" strokeWidth="3" />
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#e5e7eb" strokeWidth="2" />
      </svg>

      {/* Property marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" fill="currentColor" />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
            {property?.address || '123 Collins Street'}
          </div>
        </div>
      </div>

      {/* Risk overlays */}
      {(property?.riskData || riskData) && (
        <>
          {(property?.riskData?.flood || riskData?.flood || 0) > 30 && activeLayers.flood && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500 opacity-20 rounded-full animate-pulse"></div>
          )}
          {(property?.riskData?.fire || riskData?.fire || 0) > 30 && activeLayers.fire && (
            <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500 opacity-20 rounded-full"></div>
          )}
        </>
      )}

      {/* Map type indicator */}
      <div className="absolute bottom-4 left-4 bg-white rounded px-2 py-1 text-xs shadow">
        {mapType === 'roadmap' ? 'Map' : 'Satellite'}
      </div>
    </div>
  );

  const activeRisks = generateRiskVisualization();

  return (
    <div className="space-y-6">
      {/* Interactive Map */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-500" />
            Property Location & Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <GoogleMapsStyle />

            {/* Google Maps-style controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              {/* Zoom controls */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <button 
                  onClick={() => setZoom(Math.min(zoom + 1, 20))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 rounded-t-lg"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => setZoom(Math.max(zoom - 1, 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-b-lg"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Map type toggle */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <button 
                  onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-600"
                >
                  {mapType === 'roadmap' ? 'SAT' : 'MAP'}
                </button>
              </div>
            </div>

            {/* Property info card */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {property?.address || '123 Collins Street'}
                  </h3>
                  <p className="text-xs text-gray-500">Melbourne VIC 3000</p>
                  <div className="mt-2 flex items-center space-x-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">4.5★</span>
                    <span className="text-xs text-gray-500">Property rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis Panel */}
      {(property?.riskData || riskData) && (
        <Card>
          <CardHeader>
            <CardTitle>Climate Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Waves className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium">Flood Risk</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRiskColor((property?.riskData?.flood || riskData?.flood || 0))}>
                      {getRiskLevel((property?.riskData?.flood || riskData?.flood || 0))}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {(property?.riskData?.flood || riskData?.flood || 0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Flame className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="font-medium">Fire Risk</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRiskColor((property?.riskData?.fire || riskData?.fire || 0))}>
                      {getRiskLevel((property?.riskData?.fire || riskData?.fire || 0))}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {(property?.riskData?.fire || riskData?.fire || 0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Mountain className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-medium">Coastal Risk</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRiskColor((property?.riskData?.coastal || riskData?.coastalErosion || 0))}>
                      {getRiskLevel((property?.riskData?.coastal || riskData?.coastalErosion || 0))}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {(property?.riskData?.coastal || riskData?.coastalErosion || 0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Risk Mitigation Recommendations</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {(property?.riskData?.flood || riskData?.flood || 0) > 50 && (
                  <li>• Consider flood insurance and drainage improvements</li>
                )}
                {(property?.riskData?.fire || riskData?.fire || 0) > 50 && (
                  <li>• Install fire-resistant landscaping and materials</li>
                )}
                {(property?.riskData?.coastal || riskData?.coastalErosion || 0) > 50 && (
                  <li>• Monitor sea-level rise projections</li>
                )}
                <li>• Regular property risk assessments recommended</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyMap;