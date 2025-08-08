import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertySearch } from './PropertySearch';
import { PropertyAnalytics } from '@/components/PropertyAnalytics';
import MarketSentiment from '@/components/MarketSentiment';
import { RiskVisualization } from './RiskVisualization';
import { SystemHealth } from '@/components/SystemHealth';
import { usePropertyAnalysis } from '@/hooks/usePropertyAnalysis';
import { useSystemHealth } from '@/hooks/useSystemHealth';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    isLoading, 
    analysis, 
    sentiment, 
    marketSentiment, 
    error, 
    analyzeProperty 
  } = usePropertyAnalysis();
  const { health } = useSystemHealth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'risk', label: 'Risk Analysis' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'compliance', label: 'APRA Compliance' },
    { id: 'reports', label: 'Reports' },
    { id: 'pricing', label: '💰 Pricing' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <PropertySearch onAnalyze={analyzeProperty} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <RiskVisualization />
              </div>

              <div className="space-y-6">
                <PropertyAnalytics 
                  analysisResult={{
                    property: analysis ? { analysis_result: analysis } : null,
                    sentiment: sentiment ? { sentiment_analysis: sentiment } : null
                  }}
                />
                <MarketSentiment 
                  sentiment={marketSentiment ? {
                    score: marketSentiment.sentiment_score,
                    magnitude: marketSentiment.confidence,
                    keywords: []
                  } : undefined}
                  isLoading={isLoading}
                />
              </div>
            </div>

            <div className="mt-8">
              <SystemHealth />
            </div>
          </>
        );
      case 'risk':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive risk analysis tools and visualizations coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'blockchain':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">NFT minting and blockchain verification tools coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'compliance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>APRA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">APRA CPS 230 compliance reporting and monitoring coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed valuation and risk reports coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'pricing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pricing plans and billing information coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-foreground">PropGuard AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={health?.propguard?.success ? "default" : "destructive"}>
                APRA CPS 230 Compliant
              </Badge>
              <Badge variant="secondary">AI-Powered</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-3 border-b-2 font-medium text-sm rounded-none transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};