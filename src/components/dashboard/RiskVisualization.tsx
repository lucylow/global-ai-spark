import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

export const RiskVisualization: React.FC = () => {
  const { riskData } = COLLINS_STREET_MOCK_DATA;
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-destructive-foreground text-2xl">📍</span>
            </div>
            <p className="text-foreground font-semibold">123 Collins Street, Melbourne VIC</p>
            <p className="text-sm text-muted-foreground">Premium CBD Location</p>
            <p className="text-xs text-muted-foreground mt-1">800m to Yarra River</p>
          </div>
          
          <div className="absolute bottom-4 left-4">
            <div className="bg-card rounded-lg p-3 shadow-lg border">
              <h4 className="font-medium mb-2">Risk Visualization Layers</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Flood</span>
                  <Badge variant="destructive" className="text-xs">{riskData.floodRisk.score}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Fire</span>
                  <Badge variant="secondary" className="text-xs">{riskData.fireRisk.score}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Erosion</span>
                  <Badge variant="secondary" className="text-xs">{riskData.erosionRisk.score}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Additional risk indicators */}
          <div className="absolute top-4 right-4">
            <div className="bg-card rounded-lg p-2 shadow-lg border">
              <div className="text-xs text-muted-foreground">Overall Risk</div>
              <div className="text-lg font-bold text-destructive">High</div>
              <div className="text-xs text-muted-foreground">Score: 66/100</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};