import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyMap from '@/components/PropertyMap';
import PropertyMetrics from '@/components/PropertyMetrics';
import ValuationResults from '@/components/ValuationResults';
import RiskHeatmap from '@/components/RiskHeatmap';
import MarketSentiment from '@/components/MarketSentiment';
import PropertyNFTMinter from '@/components/PropertyNFTMinter';
import NFTVerifier from '@/components/NFTVerifier';
import ValuationReport from '@/components/ValuationReport';
import { Badge } from '@/components/ui/badge';
import { Shield, Building, TrendingUp, BarChart3, Map, FileText, Coins } from 'lucide-react';

interface PropertyData {
  address: string;
  valuation: number;
  riskScore: number;
  climateRisk: string;
  lvrRatio: number;
  story?: string;
  sentiment?: {
    score: number;
    magnitude: number;
    keywords: [string, number][];
  };
  risk: {
    flood: number;
    fire: number;
    coastalErosion: number;
    subsidence: number;
    market: number;
  };
  compliance: {
    status: 'APPROVED' | 'REVIEW' | 'REJECTED';
    reasons: string[];
    lvr: number;
    dti: number;
  };
}

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [riskLayers, setRiskLayers] = useState({
    flood: true,
    fire: true,
    erosion: false
  });

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call with demo data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate demo property data based on command
      const demoData: PropertyData = {
        address: command.includes('Sydney') ? '123 Harbour St, Sydney NSW 2000' : 
                command.includes('Melbourne') ? '456 Collins St, Melbourne VIC 3000' :
                command.includes('Brisbane') ? '789 Queen St, Brisbane QLD 4000' :
                '28 Mountain View Rd, Katoomba NSW 2780',
        valuation: Math.floor(Math.random() * 500000) + 800000,
        riskScore: Math.random() * 0.8,
        climateRisk: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
        lvrRatio: 0.65 + Math.random() * 0.2,
        story: "Recent flooding concerns in surrounding areas have increased climate risk premiums. Property features elevated construction which provides some protection.",
        sentiment: {
          score: (Math.random() - 0.5) * 2,
          magnitude: Math.random(),
          keywords: [
            ['infrastructure', Math.random()],
            ['location', Math.random()],
            ['schools', Math.random()],
            ['transport', Math.random()],
            ['safety', Math.random()]
          ]
        },
        risk: {
          flood: Math.random() * 0.8,
          fire: Math.random() * 0.7,
          coastalErosion: Math.random() * 0.3,
          subsidence: Math.random() * 0.4,
          market: Math.random() * 0.6
        },
        compliance: {
          status: Math.random() > 0.8 ? 'REVIEW' : 'APPROVED',
          reasons: ['Climate risk assessment complete', 'APRA CPS 230 compliant'],
          lvr: 0.65 + Math.random() * 0.15,
          dti: 4 + Math.random() * 2
        }
      };
      
      setPropertyData(demoData);
    } catch (err) {
      setError('Failed to assess property');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRiskLayer = (layer: string) => {
    setRiskLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  PropGuard AI
                </span>
              </h1>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'map', label: 'Risk Map', icon: Map },
                  { id: 'nft', label: 'Blockchain', icon: Coins },
                  { id: 'report', label: 'Report', icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary text-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex">
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Command Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-lg p-6 mb-8 border"
        >
          <form onSubmit={handleCommandSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="command" className="block text-sm font-medium text-card-foreground mb-1">
                Property Intelligence Assistant
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground">🔍</span>
                </div>
                <input
                  type="text"
                  id="command"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Ask about any property: 'Value 123 Main St, Sydney' or 'Risk for Katoomba properties'"
                  className="block w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Analyzing...' : 'Assess'}
                  </button>
                </div>
              </div>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                Examples: "Compare values in Bondi", "Flood risk for Brisbane properties", "Market sentiment in Perth"
              </p>
            </div>
          </form>
        </motion.div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Map */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border">
                <PropertyMap 
                  riskData={propertyData?.risk} 
                  activeLayers={riskLayers}
                />
              </div>
              
              {/* Risk Layer Controls */}
              <div className="bg-card rounded-xl shadow-lg p-4 border">
                <h3 className="font-medium text-card-foreground mb-3">Risk Visualization Layers</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(riskLayers).map(([layer, active]) => (
                    <button
                      key={layer}
                      onClick={() => toggleRiskLayer(layer)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        active
                          ? layer === 'flood' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : layer === 'fire'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                      }`}
                    >
                      {layer} {active ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Metrics */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl shadow-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Property Analytics</h2>
                {propertyData ? (
                  <PropertyMetrics metrics={propertyData} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Property Analyzed</h3>
                    <p className="text-sm">Enter a property query to see AI-powered valuation metrics</p>
                  </div>
                )}
              </div>
              
              <MarketSentiment 
                sentiment={propertyData?.sentiment} 
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
        
        {/* Risk Map View */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RiskHeatmap 
              riskData={propertyData?.risk} 
              location={propertyData?.address}
            />
            
            <div className="bg-card rounded-xl shadow-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">Climate Risk Projections</h3>
              {propertyData?.risk ? (
                <div className="space-y-4">
                  {Object.entries(propertyData.risk).map(([riskType, value]) => (
                    <div key={riskType}>
                      <div className="flex justify-between mb-1">
                        <span className="capitalize font-medium">{riskType.replace(/([A-Z])/g, ' $1')} Risk</span>
                        <span>{Math.round(Number(value) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            Number(value) > 0.7 
                              ? 'bg-destructive' 
                              : Number(value) > 0.4 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Number(value) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">Risk Mitigation Strategies</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                      <li>Flood-resistant construction materials</li>
                      <li>Defensible space around property</li>
                      <li>Stormwater management system</li>
                      <li>Insurance premium discounts available</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analyze a property to view detailed risk data</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Blockchain NFT Section */}
        {activeTab === 'nft' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl shadow-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Valuation Certification</h2>
              {propertyData ? (
                <PropertyNFTMinter report={propertyData} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">NFT Minting</h3>
                  <p className="text-sm">Analyze a property to mint a valuation NFT certificate</p>
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-xl shadow-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Verify Valuation NFT</h2>
              <NFTVerifier />
            </div>
          </div>
        )}

        {/* Professional Valuation Report */}
        {activeTab === 'report' && propertyData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl shadow-lg overflow-hidden border"
          >
            <ValuationReport 
              valuation={propertyData.valuation}
              risk={propertyData.risk}
              compliance={propertyData.compliance}
              property={{ address: propertyData.address }}
            />
          </motion.div>
        )}
        
        {activeTab === 'report' && !propertyData && (
          <div className="bg-card rounded-xl shadow-lg p-12 text-center border">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Report Available</h3>
            <p className="text-muted-foreground">Analyze a property to generate a comprehensive valuation report</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
