import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResearchMetric } from '@/lib/types';
import MetricsChart from './MetricsChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShareableContent } from '@/components/social';

interface MetricsDashboardProps {
  className?: string;
}

const MetricsDashboard = ({ className = '' }: MetricsDashboardProps) => {
  const [chartType, setChartType] = React.useState<'bar' | 'pie' | 'line'>('bar');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  
  const { data: metrics, isLoading, error } = useQuery<ResearchMetric[]>({
    queryKey: ['/api/research-metrics'],
    enabled: true
  });
  
  const { data: categoryMetrics } = useQuery<ResearchMetric[]>({
    queryKey: ['/api/research-metrics/category', selectedCategory],
    enabled: selectedCategory !== 'all'
  });

  // Get all unique categories from the metrics
  const categories = React.useMemo(() => {
    if (!metrics) return [];
    
    const categoriesSet = new Set(metrics.map(metric => metric.category));
    return ['all', ...Array.from(categoriesSet)];
  }, [metrics]);
  
  // Get the metrics to display based on selected category
  const displayMetrics = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return metrics || [];
    }
    return categoryMetrics || [];
  }, [metrics, categoryMetrics, selectedCategory]);
  
  // Group metrics by category for the category breakdown chart
  const metricsByCategory = React.useMemo(() => {
    if (!metrics) return [];
    
    const categoryCounts = metrics.reduce((acc, metric) => {
      acc[metric.category] = (acc[metric.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
      id: 0,
      category: '',
      date: '',
    }));
  }, [metrics]);
  
  if (isLoading) {
    return (
      <div className={`${className} flex justify-center items-center h-64`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`${className} text-center p-8`}>
        <h3 className="text-xl font-bold text-red-600">Error loading metrics data</h3>
        <p className="mt-2">Please try again later</p>
      </div>
    );
  }
  
  if (!metrics || metrics.length === 0) {
    return (
      <div className={`${className} text-center p-8 border rounded-lg shadow-sm`}>
        <h3 className="text-xl font-bold">No research metrics available</h3>
        <p className="mt-2 text-gray-600">Check back later for updates on our research impact</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <ShareableContent
        title="MPC Research Metrics Dashboard"
        description="Explore interactive data visualizations of our research metrics and impact."
        sharePosition="top-right"
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Research Metrics Dashboard</h2>
          <p className="text-gray-600">
            Interactive data visualizations showing the impact and reach of MPC's research initiatives
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Chart Type:</span>
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={chartType === 'bar' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setChartType('bar')}
                className="rounded-none"
              >
                Bar
              </Button>
              <Button 
                variant={chartType === 'line' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setChartType('line')}
                className="rounded-none"
              >
                Line
              </Button>
              <Button 
                variant={chartType === 'pie' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setChartType('pie')}
                className="rounded-none"
              >
                Pie
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics Overview</TabsTrigger>
            <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            <MetricsChart
              metrics={displayMetrics}
              type={chartType}
              title="Research Metrics Overview"
              description="Key performance indicators across our research initiatives"
            />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <MetricsChart
              metrics={metricsByCategory}
              type="pie"
              title="Research Categories"
              description="Distribution of research metrics by category"
            />
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <MetricsChart
              metrics={displayMetrics}
              type="line"
              title="Research Trends"
              description="Trend analysis of research metrics over time"
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            This dashboard provides a visual representation of MPC's research impact metrics. 
            The data is updated regularly to reflect our ongoing work in policy research.
          </p>
        </div>
      </ShareableContent>
    </div>
  );
};

export default MetricsDashboard;