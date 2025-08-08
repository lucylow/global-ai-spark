import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
            placeholder="Ask about any property: 'Value 123 Main St, Sydney' or 'Risk for Katoomba properties'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className="bg-background text-foreground border hover:bg-accent"
          >
            {isLoading ? 'Analyzing...' : 'Assess'}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Examples: "Compare values in Bondi", "Flood risk for Brisbane properties", "Market sentiment in Perth"
        </div>

        <div className="mt-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary"
            onClick={() => setQuery('Flood risk assessment')}
          >
            flood ✓
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary"
            onClick={() => setQuery('Fire risk assessment')}
          >
            fire ✓
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setQuery('Erosion risk assessment')}
          >
            erosion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};