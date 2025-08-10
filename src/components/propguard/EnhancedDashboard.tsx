import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for 123 Collins Street, Melbourne VIC
const MOCK_PROPERTY_DATA = {
  address: "123 Collins Street, Melbourne VIC 3000",
  valuation: {
    current: 8500000,
    range: { min: 8200000, max: 8900000 },
    confidence: 92,
    breakdown: {
      land: 5200000,
      building: 3100000,
      intangibles: 200000
    }
  },
  risk: {
    composite: 66,
    grade: "High",
    factors: {
      flood: 72,
      fire: 45,
      erosion: 38,
      market: 58
    }
  },
  sentiment: {
    property: 7.8,
    market: 4.2,
    trend: "bullish"
  },
  compliance: {
    apra_cps230: 98,
    nccp_act: 95,
    basel_iii: 92,
    overall: 95
  },
  blockchain: {
    nft_id: "PG-V-123COLLINS-20240108",
    hash: "0x4a7c2...e9f1b",
    verified: true
  }
};

// Enhanced Dashboard Component
export const EnhancedDashboard = () => {
  const [activeProperty, setActiveProperty] = useState(MOCK_PROPERTY_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Premium Header */}
      <header className="bg-card shadow-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  PropGuard AI
                </h1>
                <p className="text-sm text-muted-foreground">AI-Driven Collateral Revaluation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                APRA CPS 230 Compliant
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                Blockchain Verified
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Property Intelligence Assistant */}
        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-card to-muted/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm">🤖</span>
              </div>
              <span>Property Intelligence Assistant</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Input
                placeholder="Ask about any property: 'Value 123 Collins Street Melbourne' or 'Risk assessment for CBD properties'"
                defaultValue="123 Collins Street, Melbourne VIC 3000"
                className="flex-1 h-12 text-lg border-2 border-border focus:border-primary"
              />
              <Button 
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg"
                onClick={() => setIsAnalyzing(true)}
              >
                {isAnalyzing ? 'Analyzing...' : 'Assess Property'}
              </Button>
            </div>
            
            <div className="flex space-x-3 mb-4">
              <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                <span className="mr-2">🌊</span> Flood Analysis ✓
              </Button>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                <span className="mr-2">🔥</span> Fire Risk ✓
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                <span className="mr-2">🏗️</span> Structural Assessment
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Demo Property:</strong> 123 Collins Street - Prime CBD heritage commercial property with $8.5M valuation
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Visualization */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Property Visualization</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Live Analysis</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-muted/50 to-muted rounded-lg relative overflow-hidden">
                  {/* Map Placeholder with Property Marker */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-destructive to-destructive/80 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl animate-pulse">
                        <span className="text-destructive-foreground text-3xl">📍</span>
                      </div>
                      <div className="bg-card rounded-lg p-4 shadow-lg max-w-sm">
                        <h3 className="font-bold text-lg">123 Collins Street</h3>
                        <p className="text-muted-foreground">Melbourne VIC 3000</p>
                        <p className="text-sm text-primary mt-2">Heritage Commercial Property</p>
                        <div className="flex items-center justify-center mt-3 space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">$8.5M</div>
                            <div className="text-xs text-muted-foreground">Valuation</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">66</div>
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Visualization Layers */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-card rounded-xl p-4 shadow-xl border border-border">
                      <h4 className="font-semibold mb-3">Risk Visualization Layers</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                            <span className="text-sm font-medium">Flood Risk</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">72</Badge>
                            <span className="text-xs text-red-500">↑ 4%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
                            <span className="text-sm font-medium">Fire Risk</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">45</Badge>
                            <span className="text-xs text-muted-foreground">→</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                            <span className="text-sm font-medium">Erosion Risk</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">38</Badge>
                            <span className="text-xs text-red-500">↑ 2%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Details Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-card rounded-xl p-4 shadow-xl border border-border">
                      <div className="text-sm text-muted-foreground mb-2">Property Details</div>
                      <div className="space-y-1">
                        <div className="text-xs"><strong>Built:</strong> 1928</div>
                        <div className="text-xs"><strong>Type:</strong> Commercial</div>
                        <div className="text-xs"><strong>Area:</strong> 5,200 sqm</div>
                        <div className="text-xs"><strong>Heritage:</strong> Listed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Panel */}
          <div className="space-y-6">
            {/* Property Analytics */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">🏠</span>
                  <span>Property Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Valuation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Valuation</span>
                      <Badge className="bg-green-100 text-green-800">92% Confidence</Badge>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      ${activeProperty.valuation.current.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Range: ${activeProperty.valuation.range.min.toLocaleString()} - ${activeProperty.valuation.range.max.toLocaleString()}
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <Badge className="bg-orange-100 text-orange-800">{activeProperty.risk.grade}</Badge>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Progress value={activeProperty.risk.composite} className="flex-1 h-3" />
                      <span className="text-lg font-semibold text-orange-600">{activeProperty.risk.composite}/100</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Primary risks: Flood exposure, heritage restrictions
                    </div>
                  </div>

                  {/* Market Sentiment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Market Sentiment</span>
                      <span className="text-lg">📈</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">+{activeProperty.sentiment.market}%</span>
                      <span className="text-sm text-muted-foreground">12-month trend</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Strong CBD market conditions
                    </div>
                  </div>

                  {/* Property Sentiment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Property Sentiment</span>
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-600">{activeProperty.sentiment.property}/10</span>
                      <span className="text-sm text-green-600">Positive</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Prime location, heritage value
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">⚡</span>
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm font-medium">PropGuard AI</div>
                      <div className="text-xs text-green-600">Online</div>
                    </div>
                    <div className="text-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm font-medium">Blockchain</div>
                      <div className="text-xs text-green-600">Synced</div>
                    </div>
                    <div className="text-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm font-medium">Data Pipeline</div>
                      <div className="text-xs text-yellow-600">Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm font-medium">API</div>
                      <div className="text-xs text-green-600">142ms</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis Tabs */}
        <Card className="mt-8 shadow-xl border-0">
          <CardContent className="p-6">
            <Tabs defaultValue="valuation" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="valuation">Valuation</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="compliance">APRA Compliance</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="valuation" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Valuation Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Land Value</span>
                          <span className="font-semibold">${(activeProperty.valuation.breakdown.land / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Building Value</span>
                          <span className="font-semibold">${(activeProperty.valuation.breakdown.building / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Intangibles</span>
                          <span className="font-semibold">${(activeProperty.valuation.breakdown.intangibles / 1000).toFixed(0)}K</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold">
                          <span>Total Value</span>
                          <span className="text-green-600">${(activeProperty.valuation.current / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Comparables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">111 Collins St</div>
                            <div className="text-xs text-muted-foreground">200m away</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">+15.6%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">130 Exhibition St</div>
                            <div className="text-xs text-muted-foreground">450m away</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">+8.0%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">150 Lonsdale St</div>
                            <div className="text-xs text-muted-foreground">600m away</div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">+23.0%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Risk Adjustments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Flood Zone Discount</span>
                          <span className="text-red-600 font-semibold">-$300K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heritage Premium</span>
                          <span className="text-green-600 font-semibold">+$200K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Lease Expiry Risk</span>
                          <span className="text-red-600 font-semibold">-$150K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Market Appreciation</span>
                          <span className="text-green-600 font-semibold">+$420K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risk" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Climate Risk Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Flood Risk</span>
                            <span className="font-semibold text-blue-600">{activeProperty.risk.factors.flood}/100</span>
                          </div>
                          <Progress value={activeProperty.risk.factors.flood} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">800m to Yarra River, 2022 flood history</div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Fire Risk</span>
                            <span className="font-semibold text-orange-600">{activeProperty.risk.factors.fire}/100</span>
                          </div>
                          <Progress value={activeProperty.risk.factors.fire} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">4.2km to bushland, moderate severity</div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Erosion Risk</span>
                            <span className="font-semibold text-green-600">{activeProperty.risk.factors.erosion}/100</span>
                          </div>
                          <Progress value={activeProperty.risk.factors.erosion} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">Stable foundation, minimal concern</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Risk Mitigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 pl-4">
                          <div className="font-semibold text-sm text-red-700">Priority Action</div>
                          <div className="text-sm">Install IoT flood monitoring system</div>
                          <div className="text-xs text-muted-foreground">Cost: $4,200 • ROI: 3.2 years</div>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                          <div className="font-semibold text-sm text-yellow-700">Medium Term</div>
                          <div className="text-sm">Foundation stabilization work</div>
                          <div className="text-xs text-muted-foreground">Cost: $185,000 • Due: 2025</div>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                          <div className="font-semibold text-sm text-blue-700">Strategic</div>
                          <div className="text-sm">Lease renegotiation planning</div>
                          <div className="text-xs text-muted-foreground">Target: 2026 renewal</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Property NFT Certificate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-2">
                              <span className="text-white text-2xl">🏆</span>
                            </div>
                            <div className="font-bold text-lg">Valuation Certificate</div>
                            <div className="text-sm text-muted-foreground">123 Collins Street</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Token ID:</span>
                              <span className="font-mono text-xs">{activeProperty.blockchain.nft_id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Blockchain:</span>
                              <span>Polygon</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge className="bg-green-100 text-green-800">Verified ✓</Badge>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                          View on Blockchain Explorer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Valuation Consensus</div>
                            <div className="text-xs text-muted-foreground">3/3 nodes agreed • 14:15 AEST</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">APRA Compliance Check</div>
                            <div className="text-xs text-muted-foreground">Passed • 14:18 AEST</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">NFT Minted</div>
                            <div className="text-xs text-muted-foreground">Block #42,817,291 • 14:22 AEST</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Certificate Issued</div>
                            <div className="text-xs text-muted-foreground">Bank ledger updated • 14:25 AEST</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">APRA CPS 230</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-green-600">{activeProperty.compliance.apra_cps230}%</div>
                        <div className="text-sm text-muted-foreground">Compliance Score</div>
                      </div>
                      <Progress value={activeProperty.compliance.apra_cps230} className="mb-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Business Continuity</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Security</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Incident Management</span>
                          <span className="text-green-600">✓</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">NCCP Act</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-green-600">{activeProperty.compliance.nccp_act}%</div>
                        <div className="text-sm text-muted-foreground">Compliance Score</div>
                      </div>
                      <Progress value={activeProperty.compliance.nccp_act} className="mb-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Responsible Lending</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Consumer Protection</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Documentation</span>
                          <span className="text-yellow-600">⚠</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basel III</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-green-600">{activeProperty.compliance.basel_iii}%</div>
                        <div className="text-sm text-muted-foreground">Compliance Score</div>
                      </div>
                      <Progress value={activeProperty.compliance.basel_iii} className="mb-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Capital Adequacy</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Management</span>
                          <span className="text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Liquidity Coverage</span>
                          <span className="text-green-600">✓</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">LVR Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">70%</div>
                        <div className="text-sm text-muted-foreground">Current LVR</div>
                        <Badge className="mt-2 bg-green-100 text-green-800">Acceptable</Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">$5.95M</div>
                        <div className="text-sm text-muted-foreground">Loan Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">$8.5M</div>
                        <div className="text-sm text-muted-foreground">Property Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">Medium</div>
                        <div className="text-sm text-muted-foreground">Risk Category</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Generate New Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Report Type</label>
                          <select className="w-full mt-1 p-2 border rounded-lg">
                            <option>Comprehensive Valuation Report</option>
                            <option>Risk Assessment Report</option>
                            <option>APRA Compliance Report</option>
                            <option>Market Analysis Report</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Include Blockchain Certificate</label>
                          <div className="mt-1">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Generate NFT certificate</span>
                          </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Comprehensive Valuation</div>
                            <div className="text-xs text-muted-foreground">PG-VR-2024-123COLLINS</div>
                          </div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Risk Assessment</div>
                            <div className="text-xs text-muted-foreground">PG-RA-2024-123COLLINS</div>
                          </div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium text-sm">APRA Compliance</div>
                            <div className="text-xs text-muted-foreground">PG-AC-2024-123COLLINS</div>
                          </div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EnhancedDashboard;