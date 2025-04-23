import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ResearchMetric } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#e63946', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#d35400'];

interface MetricsChartProps {
  metrics: ResearchMetric[];
  type?: 'bar' | 'pie' | 'line';
  title?: string;
  description?: string;
  className?: string;
  dataKey?: string;
  showLegend?: boolean;
}

const MetricsChart = ({
  metrics,
  type = 'bar',
  title = 'Research Metrics',
  description,
  className = '',
  dataKey = 'value',
  showLegend = true
}: MetricsChartProps) => {
  
  if (!metrics || metrics.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' && (
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar 
                dataKey={dataKey} 
                fill="#CE1126" 
                name="Value"
              />
            </BarChart>
          )}
          
          {type === 'pie' && (
            <PieChart>
              <Pie
                data={metrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey={dataKey}
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {metrics.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          )}
          
          {type === 'line' && (
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="#006B3F" 
                activeDot={{ r: 8 }} 
                name="Value"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MetricsChart;