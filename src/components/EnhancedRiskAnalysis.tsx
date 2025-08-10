import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Waves, 
  Flame, 
  Mountain, 
  Wind,
  TrendingUp,
  Shield,
  AlertTriangle,
  Clock,
  DollarSign
} from 'lucide-react';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

export const EnhancedRiskAnalysis = () => {
  const data = COLLINS_STREET_MOCK_DATA;

  const getRiskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood': return <Waves className="h-5 w-5 text-blue-500" />;
      case 'fire': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'coastal': return <Mountain className="h-5 w-5 text-green-500" />;
      case 'cyclone': return <Wind className="h-5 w-5 text-purple-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'default';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Waves className="h-4 w-4 text-blue-500" />
              Flood Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">72</span>
                <Badge variant="destructive">High</Badge>
              </div>
              <Progress value={72} className="h-2" />
              <div className="text-xs text-muted-foreground">
                800m to Yarra River
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Fire Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">45</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <Progress value={45} className="h-2" />
              <div className="text-xs text-muted-foreground">
                4.2km to bushland
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Mountain className="h-4 w-4 text-green-500" />
              Coastal Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">38</span>
                <Badge variant="default">Low</Badge>
              </div>
              <Progress value={38} className="h-2" />
              <div className="text-xs text-muted-foreground">
                No direct exposure
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wind className="h-4 w-4 text-purple-500" />
              Cyclone Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">10</span>
                <Badge variant="default">Very Low</Badge>
              </div>
              <Progress value={10} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Southern latitude
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Climate Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Climate Change Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.climateProjections.map((projection, index) => (
              <div key={index} className="space-y-3">
                <div className="text-center">
                  <div className="text-lg font-bold">{projection.year}</div>
                  <Badge variant="outline">Projection</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Temperature</span>
                    <span className="font-medium text-red-500">{projection.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rainfall</span>
                    <span className="font-medium text-blue-500">{projection.rainfall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sea Level</span>
                    <span className="font-medium text-orange-500">{projection.seaLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Flood Risk</span>
                    <span className="font-medium">{projection.flood_risk}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Risk Mitigation Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.riskMitigation.map((mitigation, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getRiskIcon(mitigation.type.split(' ')[0])}
                    <div>
                      <div className="font-medium">{mitigation.type}</div>
                      <Badge variant={mitigation.priority === 'High' ? 'destructive' : 'secondary'}>
                        {mitigation.priority} Priority
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{mitigation.cost}</div>
                    <div className="text-xs text-muted-foreground">Investment</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      ROI
                    </div>
                    <div className="font-medium">{mitigation.roi}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Timeline
                    </div>
                    <div className="font-medium">{mitigation.timeline}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      Impact
                    </div>
                    <div className="font-medium">{mitigation.impact}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {mitigation.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span>•</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    Get Quote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Timeline Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            10-Year Risk Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="text-lg font-bold">2024</div>
                <div className="text-sm text-muted-foreground">Current</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Flood</span>
                    <span>72</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Fire</span>
                    <span>45</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-lg font-bold">2027</div>
                <div className="text-sm text-muted-foreground">3 Years</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Flood</span>
                    <span className="text-orange-500">78</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Fire</span>
                    <span className="text-orange-500">49</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-lg font-bold">2030</div>
                <div className="text-sm text-muted-foreground">6 Years</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Flood</span>
                    <span className="text-red-500">82</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Fire</span>
                    <span className="text-orange-500">52</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-lg font-bold">2034</div>
                <div className="text-sm text-muted-foreground">10 Years</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Flood</span>
                    <span className="text-red-500">88</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Fire</span>
                    <span className="text-red-500">58</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Risk scores are projected based on climate change models and historical trends
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};