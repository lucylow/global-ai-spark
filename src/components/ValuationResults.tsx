import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Coins } from 'lucide-react';

interface PropertyData {
  address: string;
  valuation: number;
  riskScore: number;
  climateRisk: string;
  lvrRatio: number;
}

interface ValuationResultsProps {
  data: PropertyData;
}

export default function ValuationResults({ data }: ValuationResultsProps) {
  const baseValue = Math.floor(data.valuation / (1 - data.riskScore * 0.15));
  const adjustment = baseValue - data.valuation;
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <AlertTriangle className="w-3 h-3" />;
      case 'Medium': return <TrendingDown className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Valuation Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Valuation Report</h3>
            <Badge className={getRiskColor(data.climateRisk)}>
              {getRiskIcon(data.climateRisk)}
              {data.climateRisk} Risk
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {data.address}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Base Property Value:</span>
              <span className="font-medium">${baseValue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-red-600">
              <span>Climate Risk Adjustment:</span>
              <span className="font-medium">-${adjustment.toLocaleString()}</span>
            </div>
            
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold">Final Valuation:</span>
              <span className="text-2xl font-bold text-primary">
                ${data.valuation.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Assessment */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Climate Risk Assessment</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Risk Score:</span>
              <span className="font-medium">{(data.riskScore * 100).toFixed(1)}%</span>
            </div>
            <Progress value={data.riskScore * 100} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Flood Risk</div>
              <div className="font-medium">{data.riskScore > 0.6 ? 'High' : 'Low'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Fire Risk</div>
              <div className="font-medium">{data.riskScore > 0.5 ? 'Medium' : 'Low'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* LVR Certificate */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dynamic LVR Certificate</h3>
            <Coins className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Maximum LVR:</span>
              <span className="font-bold text-purple-600">
                {(data.lvrRatio * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Dynamically adjusted based on climate risk assessment
            </div>
          </div>
          
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Shield className="w-4 h-4 mr-2" />
            Mint NFT Certificate
          </Button>
          
          <div className="text-xs text-purple-600 text-center">
            APRA CPS 230 Compliant • Blockchain Verified
          </div>
        </div>
      </Card>
    </div>
  );
}