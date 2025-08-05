import { useState } from 'react';
import PropertyValuationForm from '@/components/PropertyValuationForm';
import ValuationResults from '@/components/ValuationResults';
import { Badge } from '@/components/ui/badge';
import { Shield, Building, TrendingUp } from 'lucide-react';

interface PropertyData {
  address: string;
  valuation: number;
  riskScore: number;
  climateRisk: string;
  lvrRatio: number;
}

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PropGuard AI
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 hidden sm:flex">
                <Shield className="w-3 h-3 mr-1" />
                APRA CPS 230 Compliant
              </Badge>
              <Badge variant="outline" className="hidden sm:flex">
                <TrendingUp className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <PropertyValuationForm onValuation={setPropertyData} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {propertyData ? (
              <ValuationResults data={propertyData} />
            ) : (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Property Selected</h3>
                  <p>Enter a property address to get started with AI-powered valuation</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/50 rounded-lg border">
            <Shield className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">APRA Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Meets CPS 230 climate risk requirements
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg border">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Advanced climate risk modeling
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg border">
            <Building className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Blockchain Verified</h3>
            <p className="text-sm text-muted-foreground">
              Dynamic LVR NFT certificates
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
