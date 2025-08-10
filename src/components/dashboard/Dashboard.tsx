import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertySearch } from './PropertySearch';
import { PropertyAnalytics } from '@/components/PropertyAnalytics';
import MarketSentiment from '@/components/MarketSentiment';
import { RiskVisualization } from './RiskVisualization';
import { SystemHealth } from '@/components/SystemHealth';
import { DataModeToggle } from '@/components/DataModeToggle';
import { RiskAnalysisPage } from '../risk/RiskAnalysisPage';
import { BlockchainPage } from '../blockchain/BlockchainPage';
import { CompliancePage } from '../compliance/CompliancePage';
import { ReportsPage } from '../reports/ReportsPage';
import { PricingPage } from '../pricing/PricingPage';
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
    dataMode,
    dataSource,
    apiHealth,
    analyzeProperty,
    checkAPIHealth,
    setDataMode
  } = usePropertyAnalysis();
  
  React.useEffect(() => {
    checkAPIHealth();
  }, [checkAPIHealth]);
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
            
            <DataModeToggle 
              dataMode={dataMode} 
              onModeChange={setDataMode} 
              apiHealth={apiHealth}
            />

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
        return <RiskAnalysisPage />;
      case 'blockchain':
        return <BlockchainPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'reports':
        return <ReportsPage />;
      case 'pricing':
        return <PricingPage />;
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