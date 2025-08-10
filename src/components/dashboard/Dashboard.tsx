import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertySearch } from './PropertySearch';
import { PropertyDetails } from '@/components/PropertyDetails';
import PropertyMap from '@/components/PropertyMap';
import { SystemHealth } from '@/components/SystemHealth';
import { DataModeToggle } from '@/components/DataModeToggle';
import { EnhancedPropertyAnalytics } from '@/components/EnhancedPropertyAnalytics';
import { EnhancedRiskAnalysis } from '@/components/EnhancedRiskAnalysis';
import { APRAComplianceDashboard } from '@/components/APRAComplianceDashboard';
import { BlockchainDashboard } from '@/components/BlockchainDashboard';
import { ReportsPage } from '../reports/ReportsPage';
import { PricingPage } from '../pricing/PricingPage';
import { usePropertyAnalysis } from '@/hooks/usePropertyAnalysis';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { COLLINS_STREET_MOCK_DATA } from '@/data/mockData';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [propertyValuation, setPropertyValuation] = useState<any>(null);
  
  const { 
    isLoading, 
    dataMode,
    apiHealth,
    analyzeProperty,
    checkAPIHealth,
    setDataMode
  } = usePropertyAnalysis();

  const handlePropertyAnalysis = (address: string, propertyData?: any) => {
    console.log('Analyzing property:', address, propertyData);
    setSelectedProperty(propertyData || { address });
    
    // Set mock valuation data for demo
    if (address.toLowerCase().includes('collins street')) {
      setPropertyValuation({
        current_valuation: COLLINS_STREET_MOCK_DATA.propertyAnalysis.current_valuation,
        confidence: COLLINS_STREET_MOCK_DATA.propertyAnalysis.confidence,
        risk_score: COLLINS_STREET_MOCK_DATA.propertyAnalysis.risk_score,
        analysis_result: COLLINS_STREET_MOCK_DATA.propertyAnalysis.analysis_result
      });
      
      // Add risk data to property
      setSelectedProperty({
        ...propertyData,
        address,
        coordinates: { lat: -37.8136, lng: 144.9631 },
        riskData: {
          flood: COLLINS_STREET_MOCK_DATA.propertyAnalysis.analysis_result.risk.flood,
          fire: COLLINS_STREET_MOCK_DATA.propertyAnalysis.analysis_result.risk.fire,
          coastal: COLLINS_STREET_MOCK_DATA.propertyAnalysis.analysis_result.risk.coastalErosion
        }
      });
    }
    
    analyzeProperty(address);
  };
  
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
            <PropertySearch onAnalyze={handlePropertyAnalysis} isLoading={isLoading} />
            <DataModeToggle 
              dataMode={dataMode} 
              onModeChange={setDataMode} 
              apiHealth={apiHealth}
            />
            <div className="mt-8">
              <EnhancedPropertyAnalytics />
            </div>
          </>
        );
      case 'risk':
        return (
          <div className="space-y-8">
            <PropertySearch onAnalyze={handlePropertyAnalysis} isLoading={isLoading} />
            {selectedProperty ? (
              <div className="space-y-8">
                <PropertyDetails 
                  property={selectedProperty} 
                  valuation={propertyValuation}
                />
                <PropertyMap 
                  property={selectedProperty}
                />
                <EnhancedRiskAnalysis />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Enter a property address above to view comprehensive risk analysis</p>
              </div>
            )}
          </div>
        );
      case 'blockchain':
        return <BlockchainDashboard />;
      case 'compliance':
        return <APRAComplianceDashboard />;
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};