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

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property visualization...</p>
        </div>
      </div>
    );
  }

  // Create a simple visual representation without Three.js for now
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
    <div className="w-full h-[500px] relative bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl overflow-hidden">
      {/* Fallback visualization */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-80 h-80">
          {/* Property grid representation */}
          <div className="grid grid-cols-4 gap-2 p-4">
            {Array.from({ length: 16 }).map((_, i) => {
              const riskLevel = riskData ? 
                (riskData.flood || 0) + (riskData.fire || 0) + (riskData.coastalErosion || 0) : 
                Math.random() * 0.6;
              
              return (
                <div
                  key={i}
                  className={`
                    w-12 h-12 rounded-lg shadow-sm border-2 transition-all duration-500
                    ${riskLevel > 0.6 ? 'bg-red-400 border-red-600' : 
                      riskLevel > 0.3 ? 'bg-yellow-400 border-yellow-600' : 
                      'bg-green-400 border-green-600'}
                  `}
                  style={{
                    transform: `scale(${0.8 + Math.random() * 0.4})`,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              );
            })}
          </div>

          {/* Risk overlays */}
          {activeRisks && activeRisks.map((risk, index) => (
            <div
              key={risk.label}
              className={`
                absolute inset-0 rounded-full opacity-30 animate-pulse
                ${risk.color}
              `}
              style={{
                width: `${risk.value * 200 + 100}px`,
                height: `${risk.value * 200 + 100}px`,
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${0.5 + risk.value * 0.5})`,
                animationDelay: `${index * 200}ms`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        {riskData ? 'Property Risk Visualization' : 'Interactive Property Map'}
      </div>
      
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg text-xs">
        <div className="font-medium mb-2">Risk Indicators</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Risk layer indicator */}
      {riskData && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded text-xs">
          <div className="font-medium mb-1">Active Layers</div>
          <div className="space-y-1">
            {activeLayers.flood && <div className="text-blue-600">• Flood Zone</div>}
            {activeLayers.fire && <div className="text-orange-600">• Fire Risk</div>}
            {activeLayers.erosion && <div className="text-yellow-600">• Erosion Risk</div>}
          </div>
        </div>
      )}
    </div>
  );
}