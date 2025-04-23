import React from 'react';
import { ResearchMetric } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, ArrowUp, ArrowDown, Users, FileText, Globe, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface MetricCardProps {
  metric: ResearchMetric;
  className?: string;
}

const MetricCard = ({ metric, className = '' }: MetricCardProps) => {
  // Determine the icon based on the metric category
  const getIcon = () => {
    switch (metric.category.toLowerCase()) {
      case 'downloads':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'citations':
        return <TrendingUp className="h-8 w-8 text-green-600" />;
      case 'funding':
        return <CircleDollarSign className="h-8 w-8 text-amber-500" />;
      case 'outreach':
        return <Users className="h-8 w-8 text-indigo-500" />;
      case 'international':
        return <Globe className="h-8 w-8 text-cyan-500" />;
      default:
        return <TrendingUp className="h-8 w-8 text-primary" />;
    }
  };
  
  // Determine if the metric value represents a good trend (for styling)
  const isPositiveTrend = metric.value > 0;

  // Format the date
  const formattedDate = metric.date ? format(new Date(metric.date), 'MMM dd, yyyy') : 'N/A';
  
  return (
    <Card className={`${className} hover:shadow-md transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{metric.name}</CardTitle>
            <CardDescription className="capitalize">{metric.category}</CardDescription>
          </div>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold">{metric.value.toLocaleString()}</span>
          <span className={`flex items-center ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          </span>
        </div>
        {metric.description && (
          <p className="mt-2 text-sm text-gray-500">{metric.description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        Last updated: {formattedDate}
      </CardFooter>
    </Card>
  );
};

export default MetricCard;