import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const RiskVisualization: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-destructive-foreground text-2xl">📍</span>
            </div>
            <p className="text-foreground">123 Collins Street, Melbourne VIC</p>
            <p className="text-sm text-muted-foreground">Collins Street</p>
          </div>
          
          <div className="absolute bottom-4 left-4">
            <div className="bg-card rounded-lg p-3 shadow-lg border">
              <h4 className="font-medium mb-2">Risk Visualization Layers</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Flood</span>
                  <Badge variant="secondary" className="text-xs">20</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Fire</span>
                  <Badge variant="secondary" className="text-xs">24</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Erosion</span>
                  <Badge variant="secondary" className="text-xs">22</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};