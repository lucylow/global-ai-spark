import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RiskHeatmap from '../RiskHeatmap';

export const RiskAnalysisPage: React.FC = () => {
  const riskData = {
    floodRisk: { score: 66, level: 'High', color: 'destructive' },
    fireRisk: { score: 24, level: 'Low', color: 'secondary' },
    erosionRisk: { score: 22, level: 'Low', color: 'secondary' },
    cyclonesRisk: { score: 10, level: 'Very Low', color: 'secondary' }
  };

  const climateProjections = [
    { year: '2030', temp: '+1.2°C', rainfall: '-5%', seaLevel: '+8cm' },
    { year: '2050', temp: '+2.1°C', rainfall: '-12%', seaLevel: '+18cm' },
    { year: '2070', temp: '+3.0°C', rainfall: '-18%', seaLevel: '+32cm' }
  ];

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(riskData).map(([key, risk]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {key.replace('Risk', '').replace(/([A-Z])/g, ' $1').trim()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{risk.score}%</div>
                <Badge variant={risk.color as any}>{risk.level}</Badge>
              </div>
              <Progress value={risk.score} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Heatmap & Geographic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskHeatmap />
        </CardContent>
      </Card>

      {/* Climate Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Climate Change Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {climateProjections.map((projection) => (
              <div key={projection.year} className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">{projection.year}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium text-destructive">{projection.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rainfall:</span>
                    <span className="font-medium text-destructive">{projection.rainfall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sea Level:</span>
                    <span className="font-medium text-destructive">{projection.seaLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Mitigation Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-destructive pl-4">
              <h4 className="font-semibold text-destructive">High Priority: Flood Risk</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Install flood barriers and drainage systems</li>
                <li>• Consider flood insurance coverage increase</li>
                <li>• Elevate critical infrastructure above flood levels</li>
              </ul>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-600">Medium Priority: Fire Risk</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Maintain defensible space around property</li>
                <li>• Install fire-resistant building materials</li>
                <li>• Implement early warning systems</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};