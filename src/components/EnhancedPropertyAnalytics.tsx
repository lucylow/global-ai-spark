import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target, Calendar } from 'lucide-react';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

interface EnhancedPropertyAnalyticsProps {
  property?: any;
  valuation?: any;
  analysis?: any;
}

export const EnhancedPropertyAnalytics: React.FC<EnhancedPropertyAnalyticsProps> = ({
  property,
  valuation,
  analysis
}) => {
  // Use dynamic data if available, otherwise fall back to mock data
  const data = analysis || COLLINS_STREET_MOCK_DATA;
  
  // Safely extract values with fallbacks
  const currentValuation = valuation?.current_valuation || data?.propertyAnalysis?.current_valuation || 1500000;
  const confidence = valuation?.confidence || data?.propertyAnalysis?.confidence || 85;
  const riskScore = valuation?.risk_score || data?.propertyAnalysis?.risk_score || 25;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Valuation Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Valuation Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(currentValuation)}
              </div>
              <div className="text-sm text-muted-foreground">
                Current Valuation {valuation ? '(Live Analysis)' : '(Demo Data)'}
              </div>
              <div className="mt-2 text-sm">
                Range: {formatCurrency(currentValuation * 0.9)} - {formatCurrency(currentValuation * 1.1)}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Confidence Level</span>
                  <span>{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Risk Score</span>
                  <span>{riskScore}/100</span>
                </div>
                <Progress value={riskScore} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sentiment Score</span>
              <Badge variant="default">{data?.marketSentiment?.sentiment_score || 7}/10</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Trend</span>
              <Badge variant="secondary" className="capitalize">
                {data?.marketSentiment?.trend || 'stable'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {data?.marketSentiment?.summary || 'Market data analysis in progress...'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Land Value</span>
              <span className="font-medium">{formatCurrency(data?.propertyAnalysis?.analysis_result?.detailed_breakdown?.land_value || currentValuation * 0.6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Building Value</span>
              <span className="font-medium">{formatCurrency(data?.propertyAnalysis?.analysis_result?.detailed_breakdown?.building_value || currentValuation * 0.3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Intangible Assets</span>
              <span className="font-medium">{formatCurrency(data?.propertyAnalysis?.analysis_result?.detailed_breakdown?.intangible_assets || currentValuation * 0.1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Comparables */}
      <Card>
        <CardHeader>
          <CardTitle>Market Comparables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(data?.propertyAnalysis?.analysis_result?.market_comparables || []).map((comp, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{comp?.address || `Similar Property ${index + 1}`}</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(comp?.value || currentValuation * (0.9 + Math.random() * 0.2))}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  +{Math.round((comp?.premium || 0.1) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Investment Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{data?.marketSentiment?.detailed_metrics?.cap_rate || 5.2}%</div>
              <div className="text-xs text-muted-foreground">Cap Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{data?.marketSentiment?.detailed_metrics?.cash_on_cash || 7.8}%</div>
              <div className="text-xs text-muted-foreground">Cash-on-Cash</div>
            </div>
            <div>
              <div className="text-sm font-bold">{formatCurrency(data?.marketSentiment?.detailed_metrics?.noi || currentValuation * 0.06)}</div>
              <div className="text-xs text-muted-foreground">NOI/Year</div>
            </div>
            <div>
              <div className="text-sm font-bold">{data?.marketSentiment?.detailed_metrics?.debt_coverage || 1.25}x</div>
              <div className="text-xs text-muted-foreground">DSCR</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Risk Assessment Detail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flood Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Flood Risk</span>
                <Badge variant="destructive">{data?.propertyAnalysis?.analysis_result?.risk?.detailed?.flood?.score || 25}/100</Badge>
              </div>
              <Progress value={data?.propertyAnalysis?.analysis_result?.risk?.detailed?.flood?.score || 25} className="h-2" />
              <div className="text-xs text-muted-foreground space-y-1">
                {(data?.propertyAnalysis?.analysis_result?.risk?.detailed?.flood?.factors || ['Low elevation area', 'Proximity to waterways']).map((factor, index) => (
                  <div key={index}>• {factor}</div>
                ))}
              </div>
            </div>

            {/* Fire Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fire Risk</span>
                <Badge variant="secondary">{data?.propertyAnalysis?.analysis_result?.risk?.detailed?.fire?.score || 30}/100</Badge>
              </div>
              <Progress value={data?.propertyAnalysis?.analysis_result?.risk?.detailed?.fire?.score || 30} className="h-2" />
              <div className="text-xs text-muted-foreground space-y-1">
                {(data?.propertyAnalysis?.analysis_result?.risk?.detailed?.fire?.factors || ['Urban area', 'Fire-resistant materials']).map((factor, index) => (
                  <div key={index}>• {factor}</div>
                ))}
              </div>
            </div>

            {/* Coastal Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Coastal Risk</span>
                <Badge variant="secondary">{data?.propertyAnalysis?.analysis_result?.risk?.detailed?.coastal?.score || 10}/100</Badge>
              </div>
              <Progress value={data?.propertyAnalysis?.analysis_result?.risk?.detailed?.coastal?.score || 10} className="h-2" />
              <div className="text-xs text-muted-foreground space-y-1">
                {(data?.propertyAnalysis?.analysis_result?.risk?.detailed?.coastal?.factors || ['Inland location', 'Stable coastline']).map((factor, index) => (
                  <div key={index}>• {factor}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Timeline */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Valuation & Confidence Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {(data?.confidenceGrowth || [
              { date: "Jan 2024", valuation: currentValuation * 0.95, confidence: 75 },
              { date: "Feb 2024", valuation: currentValuation * 0.98, confidence: 80 },
              { date: "Mar 2024", valuation: currentValuation, confidence: confidence },
              { date: "Apr 2024", valuation: currentValuation * 1.02, confidence: confidence + 5 }
            ]).map((point, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">{point?.date || `Period ${index + 1}`}</div>
                <div className="font-bold">{formatCurrency(point?.valuation || currentValuation)}</div>
                <div className="text-sm">
                  <Badge variant="outline">{point?.confidence || confidence}% confidence</Badge>
                </div>
                {index < (data?.confidenceGrowth?.length || 4) - 1 && (
                  <div className="flex justify-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};