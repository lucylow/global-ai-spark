import { useState, useEffect } from 'react';

interface PropertyMapProps {
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

export default function PropertyMap({ riskData, activeLayers = {
  flood: true,
  fire: true,
  erosion: false
} }: PropertyMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter] = useState({ lat: -33.8688, lng: 151.2093 }); // Sydney
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const generateRiskVisualization = () => {
    if (!riskData) return null;
    const risks = [
      { label: 'Flood Risk', value: riskData.flood || 0, color: 'bg-blue-500', active: activeLayers.flood },
      { label: 'Fire Risk', value: riskData.fire || 0, color: 'bg-orange-500', active: activeLayers.fire },
      { label: 'Erosion Risk', value: riskData.coastalErosion || 0, color: 'bg-yellow-500', active: activeLayers.erosion }
    ];
    return risks.filter(risk => risk.active && risk.value > 0.2);
  };

  const activeRisks = generateRiskVisualization();

  return (
    <div className="w-full h-[500px] relative bg-gray-200 rounded-xl overflow-hidden shadow-lg">
      {/* Google Maps-style map container */}
      <div className="w-full h-full relative">
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
          {activeRisks && activeRisks.map((risk, index) => (
            <div
              key={risk.label}
              className={`
                absolute rounded-full opacity-30 animate-pulse
                ${risk.color}
              `}
              style={{
                width: `${risk.value * 300 + 150}px`,
                height: `${risk.value * 300 + 150}px`,
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

          {/* Map type selector */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <select className="text-xs bg-transparent outline-none">
              <option>Map</option>
              <option>Satellite</option>
              <option>Terrain</option>
            </select>
          </div>
        </div>

        {/* Google Maps-style search box */}
        <div className="absolute top-4 left-4 right-20">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search Google Maps" 
                className="flex-1 outline-none text-sm"
                defaultValue="123 Collins Street, Melbourne VIC"
              />
            </div>
          </div>
        </div>

        {/* Risk layer controls (Google Maps style) */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Layers</div>
          <div className="space-y-2">
            {Object.entries(activeLayers).map(([layer, active]) => (
              <label key={layer} className="flex items-center text-xs">
                <input 
                  type="checkbox" 
                  checked={active} 
                  className="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  readOnly
                />
                <span className="capitalize">{layer} Risk</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property info card (Google Maps style) */}
        {riskData && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">123 Collins Street</h3>
                <p className="text-xs text-gray-500">Melbourne VIC 3000</p>
                <div className="mt-2 flex items-center space-x-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">4.5★</span>
                  <span className="text-xs text-gray-500">Property rating</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scale indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 text-xs text-gray-600 shadow border border-gray-200">
          100 m
        </div>
      </div>
    </div>
  );
}