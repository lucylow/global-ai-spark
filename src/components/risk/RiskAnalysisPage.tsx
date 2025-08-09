import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RiskHeatmap from '../RiskHeatmap';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

export const RiskAnalysisPage: React.FC = () => {
  // Use Collins Street mock data
  const riskData = COLLINS_STREET_MOCK_DATA.riskData;
  const climateProjections = COLLINS_STREET_MOCK_DATA.climateProjections;
  const riskMitigation = COLLINS_STREET_MOCK_DATA.riskMitigation;

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
            {riskMitigation.map((mitigation, index) => (
              <div 
                key={index}
                className={`border-l-4 pl-4 ${
                  mitigation.priority === 'High' 
                    ? 'border-destructive' 
                    : 'border-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    mitigation.priority === 'High' 
                      ? 'text-destructive' 
                      : 'text-yellow-600'
                  }`}>
                    {mitigation.priority} Priority: {mitigation.type}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Cost: {mitigation.cost}</span>
                    <span className="ml-2">ROI: {mitigation.roi}</span>
                  </div>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {mitigation.actions.map((action, actionIndex) => (
                    <li key={actionIndex}>• {action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};