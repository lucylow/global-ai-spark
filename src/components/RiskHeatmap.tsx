import { motion } from 'framer-motion';
import { AlertTriangle, Droplets, Flame, Mountain } from 'lucide-react';

interface RiskHeatmapProps {
  riskData?: {
    flood?: number;
    fire?: number;
    coastalErosion?: number;
    subsidence?: number;
  };
  location?: string;
}

export default function RiskHeatmap({ riskData, location }: RiskHeatmapProps) {
  if (!riskData) {
    return (
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="text-xl font-semibold mb-4">Climate Risk Heatmap</h3>
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Analyze a property to view risk heatmap</p>
        </div>
      </div>
    );
  }

  const riskTypes = [
    {
      key: 'flood',
      label: 'Flood Risk',
      icon: Droplets,
      value: riskData.flood || 0,
      color: 'blue'
    },
    {
      key: 'fire',
      label: 'Bushfire Risk', 
      icon: Flame,
      value: riskData.fire || 0,
      color: 'orange'
    },
    {
      key: 'coastalErosion',
      label: 'Coastal Erosion',
      icon: Mountain,
      value: riskData.coastalErosion || 0,
      color: 'cyan'
    },
    {
      key: 'subsidence',
      label: 'Subsidence Risk',
      icon: AlertTriangle,
      value: riskData.subsidence || 0,
      color: 'yellow'
    }
  ];

  const getRiskLevel = (value: number) => {
    if (value > 0.7) return 'High';
    if (value > 0.4) return 'Medium';
    return 'Low';
  };

  const getRiskColor = (value: number, colorType: string) => {
    const intensity = Math.round(value * 100);
    
    switch (colorType) {
      case 'blue':
        return `hsl(217, 71%, ${Math.max(20, 80 - intensity)}%)`;
      case 'orange':
        return `hsl(25, 85%, ${Math.max(20, 80 - intensity)}%)`;
      case 'cyan':
        return `hsl(188, 78%, ${Math.max(20, 80 - intensity)}%)`;
      case 'yellow':
        return `hsl(48, 89%, ${Math.max(20, 80 - intensity)}%)`;
      default:
        return `hsl(0, 0%, ${Math.max(20, 80 - intensity)}%)`;
    }
  };

  return (
    <motion.div 
      className="bg-card rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-4">Climate Risk Heatmap</h3>
      
      {location && (
        <p className="text-sm text-muted-foreground mb-6">
          Risk assessment for: <span className="font-medium">{location}</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {riskTypes.map((risk, index) => {
          const Icon = risk.icon;
          return (
            <motion.div
              key={risk.key}
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: getRiskColor(risk.value, risk.color),
                borderColor: getRiskColor(risk.value * 1.2, risk.color)
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" style={{ color: getRiskColor(risk.value * 2, risk.color) }} />
                <span className="text-sm font-medium">
                  {getRiskLevel(risk.value)}
                </span>
              </div>
              
              <h4 className="font-medium text-sm mb-1">{risk.label}</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-90">
                  {(risk.value * 100).toFixed(1)}%
                </span>
                <div className="w-12 h-1 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black/40"
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.value * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Risk Summary */}
      <div className="space-y-3">
        <h4 className="font-medium">Risk Assessment Summary</h4>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            {riskTypes
              .filter(risk => risk.value > 0.3)
              .map(risk => (
                <div key={risk.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <risk.icon className="w-4 h-4" />
                    {risk.label}
                  </span>
                  <span className={`font-medium ${
                    risk.value > 0.7 ? 'text-red-600' : 
                    risk.value > 0.4 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getRiskLevel(risk.value)} Risk
                  </span>
                </div>
              ))}
          </div>
          
          {riskTypes.every(risk => risk.value <= 0.3) && (
            <p className="text-sm text-green-600">
              ✅ Low overall climate risk profile
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}