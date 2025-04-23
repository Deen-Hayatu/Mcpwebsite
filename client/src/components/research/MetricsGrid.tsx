import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResearchMetric } from '@/lib/types';
import MetricCard from './MetricCard';

interface MetricsGridProps {
  category?: string;
  limit?: number;
  className?: string;
}

const MetricsGrid = ({ 
  category, 
  limit = 6, 
  className = '' 
}: MetricsGridProps) => {
  // Query for all metrics or metrics by category
  const queryKey = category 
    ? ['/api/research-metrics/category', category]
    : ['/api/research-metrics'];
  
  const { data: metrics, isLoading, error } = useQuery<ResearchMetric[]>({
    queryKey,
    enabled: true
  });
  
  // Limit the number of metrics to display
  const displayMetrics = React.useMemo(() => {
    if (!metrics) return [];
    return metrics.slice(0, limit);
  }, [metrics, limit]);
  
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
        <h3 className="text-xl font-bold text-red-600">Error loading metrics</h3>
        <p className="mt-2">Please try again later</p>
      </div>
    );
  }
  
  if (!metrics || metrics.length === 0) {
    return (
      <div className={`${className} text-center p-8 border rounded-lg`}>
        <h3 className="text-xl font-bold">No metrics available</h3>
        <p className="mt-2 text-gray-600">
          {category 
            ? `No metrics found for category: ${category}` 
            : 'Check back later for updates on our research metrics'}
        </p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      
      {metrics.length > limit && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing {limit} of {metrics.length} metrics
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricsGrid;