import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ValuationReport from '../ValuationReport';

export const ReportsPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState('123 Collins Street');

  const reports = [
    {
      id: 'VR-2024-001',
      property: '123 Collins Street, Melbourne VIC',
      type: 'Full Valuation',
      date: '2024-01-08',
      status: 'Complete',
      valuation: 850000
    },
    {
      id: 'VR-2024-002', 
      property: '456 George Street, Sydney NSW',
      type: 'Risk Assessment',
      date: '2024-01-07',
      status: 'Complete',
      valuation: 1200000
    },
    {
      id: 'VR-2024-003',
      property: '789 Queen Street, Brisbane QLD',
      type: 'APRA Compliance',
      date: '2024-01-06',
      status: 'In Review',
      valuation: 650000
    }
  ];

  const reportTemplates = [
    { name: 'Full Property Valuation', description: 'Comprehensive valuation with risk analysis' },
    { name: 'Risk Assessment Only', description: 'Climate and market risk evaluation' },
    { name: 'APRA Compliance Report', description: 'Regulatory compliance documentation' },
    { name: 'Market Analysis', description: 'Local market trends and comparisons' }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library">Report Library</TabsTrigger>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <div className="flex space-x-2">
                <Input placeholder="Search reports..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{report.id}</h4>
                        <Badge variant={report.status === 'Complete' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.property}</p>
                      <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                        <span>Type: {report.type}</span>
                        <span>Date: {new Date(report.date).toLocaleDateString()}</span>
                        <span>Value: ${report.valuation.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Property Address</label>
                  <Input 
                    placeholder="Enter property address" 
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Report Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Full Valuation Report</option>
                    <option>Risk Assessment Only</option>
                    <option>APRA Compliance Report</option>
                    <option>Market Analysis</option>
                  </select>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Report Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Property: {selectedProperty}</div>
                  <div>Type: Full Valuation Report</div>
                  <div>Estimated Time: 2-3 minutes</div>
                  <div>Includes: Valuation, Risk, Compliance</div>
                </div>
              </div>

              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>

          {/* Sample Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Sample valuation report would appear here with full property analysis, risk assessment, and compliance information.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.name}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">247</div>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">98.7%</div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-xs text-green-600">Above target</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">2.3s</div>
                <p className="text-sm text-muted-foreground">Avg Generation Time</p>
                <p className="text-xs text-green-600">-15% faster</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Full Valuation Reports</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-sm">147</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Risk Assessments</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm">62</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>APRA Compliance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-sm">38</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};