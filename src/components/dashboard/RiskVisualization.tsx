import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

export const RiskVisualization: React.FC = () => {
  const { riskData, propertyAnalysis } = COLLINS_STREET_MOCK_DATA;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search and Map Visualization */}
      <div className="lg:col-span-2 space-y-4">
        <Input 
          placeholder="123 Collins Street, Melbourne VIC"
          value="123 Collins Street, Melbourne VIC"
          readOnly
          className="text-sm"
        />
        
        <Card>
          <CardContent className="p-6">
            <div className="relative h-80 flex items-center justify-center">
              {/* Concentric circles representing risk zones */}
              <div className="relative">
                <div className="w-60 h-60 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-orange-400/60 flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full relative">
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs">📍</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button className="w-8 h-8 bg-white border rounded flex items-center justify-center">+</button>
                <button className="w-8 h-8 bg-white border rounded flex items-center justify-center">-</button>
              </div>
              
              {/* Property info card */}
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">🏢</div>
                  <div>
                    <div className="font-semibold text-sm">123 Collins Street</div>
                    <div className="text-xs text-muted-foreground">Melbourne VIC 3000</div>
                    <div className="text-xs text-green-600">4.5★ Property rating</div>
                  </div>
                </div>
              </div>
              
              {/* Scale indicator */}
              <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                100 m
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Layers */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Layers</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox checked disabled />
                <span className="text-sm">Flood Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked disabled />
                <span className="text-sm">Fire Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked disabled />
                <span className="text-sm">Erosion Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Property Analytics */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Property Analytics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Valuation</span>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs">$</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">${(propertyAnalysis.current_valuation / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Current market value estimate</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">AI Confidence: {propertyAnalysis.confidence}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">Climate Risk Assessment</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Flood Risk</span>
                  <span>{riskData.floodRisk.score}%</span>
                </div>
                <Progress value={riskData.floodRisk.score} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bushfire Risk</span>
                  <span>{riskData.fireRisk.score}%</span>
                </div>
                <Progress value={riskData.fireRisk.score} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Market Volatility</span>
                  <span>51%</span>
                </div>
                <Progress value={51} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Subsidence Risk</span>
                  <span>12%</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};