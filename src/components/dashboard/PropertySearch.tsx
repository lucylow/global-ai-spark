import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PropertySearchProps {
  onAnalyze: (query: string) => void;
  isLoading: boolean;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ onAnalyze, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) {
      onAnalyze(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🤖</span>
          <span>Property Intelligence Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Input
            placeholder="Ask about any property: 'Value 123 Collins Street Melbourne' or 'Risk assessment for CBD properties'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? 'Analyzing...' : 'Assess Property'}
          </Button>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setQuery('123 Collins Street, Melbourne VIC 3000');
              onAnalyze('123 Collins Street, Melbourne VIC 3000');
            }}
            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            <span className="mr-2">🏢</span> Try Demo: 123 Collins Street
          </Button>
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <strong>Demo Property:</strong> 123 Collins Street - Prime CBD heritage commercial property with comprehensive risk assessment and $8.5M valuation
        </div>

        <div className="mt-3 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            <span className="mr-2">🌊</span> Flood Analysis ✓
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            <span className="mr-2">🔥</span> Fire Risk ✓
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <span className="mr-2">🏗️</span> Structural Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};