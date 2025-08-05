import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Shield, AlertTriangle } from 'lucide-react';

interface PropertyData {
  address: string;
  valuation: number;
  riskScore: number;
  climateRisk: string;
  lvrRatio: number;
}

interface PropertyValuationFormProps {
  onValuation: (data: PropertyData) => void;
}

export default function PropertyValuationForm({ onValuation }: PropertyValuationFormProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const mockValuation = async (address: string): Promise<PropertyData> => {
    // Simulate AI valuation with climate risk analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseValue = Math.floor(Math.random() * 500000) + 750000;
    const riskScore = Math.random();
    const climateAdjustment = riskScore * 0.15; // Up to 15% adjustment
    const finalValuation = Math.floor(baseValue * (1 - climateAdjustment));
    
    return {
      address,
      valuation: finalValuation,
      riskScore,
      climateRisk: riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low',
      lvrRatio: 0.8 - (riskScore * 0.2) // Lower LVR for higher risk
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    try {
      const result = await mockValuation(address);
      onValuation(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Property Valuation</h2>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            APRA CPS 230
          </Badge>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                type="text"
                placeholder="e.g. 28 Mountain View Rd, Katoomba NSW"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full gradient-primary text-white"
            disabled={loading || !address.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Climate Risk...
              </>
            ) : (
              'Get AI-Powered Valuation'
            )}
          </Button>
        </form>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Real-time climate risk assessment</p>
          <p>• APRA CPS 230 compliant methodology</p>
          <p>• Dynamic LVR calculation</p>
        </div>
      </div>
    </Card>
  );
}