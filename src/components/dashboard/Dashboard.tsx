import React, { useState } from 'react';
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
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'risk', label: 'Risk Analysis', icon: '⚠️' },
    { id: 'blockchain', label: 'Blockchain', icon: '⛓️' },
    { id: 'compliance', label: 'APRA Compliance', icon: '📋' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'pricing', label: '💰 Pricing', icon: '' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
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
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  );
};