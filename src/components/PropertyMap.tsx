import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Waves, Flame, Mountain, Navigation } from 'lucide-react';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(15);

  // Get Mapbox token from Supabase Edge Function
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        // For now, use demo mode without real Mapbox
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting Mapbox token:', error);
        setIsLoading(false);
      }
    };
    getMapboxToken();
  }, []);

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

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

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
            <div className="w-full h-96 relative bg-gray-200 rounded overflow-hidden">
              {/* Map background with street-like pattern */}
              <div 
                className="w-full h-full bg-gray-100"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
                    linear-gradient(#e5e7eb 1px, transparent 1px),
                    linear-gradient(90deg, #f3f4f6 1px, transparent 1px),
                    linear-gradient(#f3f4f6 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px, 60px 60px, 20px 20px, 20px 20px',
                  backgroundPosition: '0 0, 0 0, 0 0, 0 0'
                }}
              >
                {/* Property markers */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {/* Main property marker */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-y-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-600 absolute left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
                  </div>
                </div>

                {/* Risk overlays */}
                {activeRisks.map((risk, index) => (
                  <div
                    key={risk.label}
                    className={`
                      absolute rounded-full opacity-30 animate-pulse
                      ${risk.color}
                    `}
                    style={{
                      width: `${risk.value * 3 + 150}px`,
                      height: `${risk.value * 3 + 150}px`,
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%)`,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                ))}

                {/* Street names overlay */}
                <div className="absolute top-20 left-20 text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded shadow">
                  Collins Street
                </div>
                <div className="absolute bottom-20 right-20 text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded shadow">
                  Bourke Street
                </div>
              </div>

              {/* Google Maps-style controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                {/* Zoom controls */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                  <button 
                    onClick={() => setZoom(Math.min(zoom + 1, 20))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 rounded-t-lg"
                  >
                    <span className="text-lg font-bold text-gray-600">+</span>
                  </button>
                  <button 
                    onClick={() => setZoom(Math.max(zoom - 1, 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-b-lg"
                  >
                    <span className="text-lg font-bold text-gray-600">−</span>
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