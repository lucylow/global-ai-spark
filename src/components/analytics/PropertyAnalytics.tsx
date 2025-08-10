import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedPropertyAnalysis } from '@/services/propguard-integration';

interface PropertyAnalyticsProps {
  analysis: EnhancedPropertyAnalysis | null;
}

export const PropertyAnalytics: React.FC<PropertyAnalyticsProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">📊</div>
            <div>No property analysis available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { property, ai_insights, propguard_score } = analysis;

  return (
    <div className="space-y-6">
      {/* Property Valuation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">💰</span>
            <span>Property Valuation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Current Value</span>
                <Badge className="bg-green-100 text-green-800">
                  {property.propguard_valuation?.confidence_score || 90}% Confidence
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                ${property.price ? property.price.toLocaleString() : 'N/A'}
              </div>
              {property.propguard_valuation && (
                <div className="text-sm text-gray-500">
                  Range: ${property.propguard_valuation.valuation_range.min.toLocaleString()} - 
                  ${property.propguard_valuation.valuation_range.max.toLocaleString()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">PropGuard Score</span>
                <Badge className={`${propguard_score > 70 ? 'bg-green-100 text-green-800' : 
                  propguard_score > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {propguard_score > 70 ? 'Excellent' : propguard_score > 50 ? 'Good' : 'Caution'}
                </Badge>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <Progress value={propguard_score} className="flex-1 h-3" />
                <span className="text-lg font-semibold text-blue-600">{propguard_score}/100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <span>Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {property.propguard_risk ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Risk</span>
                    <Badge className={`${property.propguard_risk.risk_grade === 'Low' ? 'bg-green-100 text-green-800' : 
                      property.propguard_risk.risk_grade === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {property.propguard_risk.risk_grade}
                    </Badge>
                  </div>
                  <Progress value={property.propguard_risk.overall_score} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Flood Risk</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={property.propguard_risk.climate_risks.flood} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{property.propguard_risk.climate_risks.flood}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Fire Risk</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={property.propguard_risk.climate_risks.fire} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{property.propguard_risk.climate_risks.fire}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Market Risk</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={property.propguard_risk.market_risks.volatility} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{property.propguard_risk.market_risks.volatility}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Coastal Risk</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={property.propguard_risk.climate_risks.coastal} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{property.propguard_risk.climate_risks.coastal}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Risk assessment data not available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📈</span>
            <span>Market Sentiment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {property.propguard_market_sentiment ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Market Trend</span>
                    <Badge className={`${property.propguard_market_sentiment.trend === 'bullish' ? 'bg-green-100 text-green-800' : 
                      property.propguard_market_sentiment.trend === 'neutral' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {property.propguard_market_sentiment.trend}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {property.propguard_market_sentiment.sentiment_score}/10
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.propguard_market_sentiment.summary}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Price Growth:</span>
                    <span className="font-medium">{property.propguard_market_sentiment.indicators.price_growth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auction Clearance:</span>
                    <span className="font-medium">{property.propguard_market_sentiment.indicators.auction_clearance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days on Market:</span>
                    <span className="font-medium">{property.propguard_market_sentiment.indicators.days_on_market}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume Change:</span>
                    <span className="font-medium">{property.propguard_market_sentiment.indicators.volume_change}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                Market sentiment data not available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* APRA Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">✅</span>
            <span>APRA Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {property.propguard_compliance ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {property.propguard_compliance.compliance_score}%
                </div>
                <div className="text-sm text-gray-600">Overall Compliance</div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {property.propguard_compliance.apra_cps230_compliant ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-gray-600">APRA CPS 230</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {property.propguard_compliance.nccp_act_compliant ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-gray-600">NCCP Act</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {property.propguard_compliance.basel_iii_compliant ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-gray-600">Basel III</div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <strong>Risk Category:</strong> {property.propguard_compliance.risk_category}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              Compliance data not available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};