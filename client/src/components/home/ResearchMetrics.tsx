import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BouncingDot, 
  StaggeredList, 
  AnimatedCounter, 
  ButtonTap,
  RevealOnScroll,
  TextHighlight 
} from "@/components/ui/micro-interactions";
import { 
  FileText, 
  Users, 
  GraduationCap, 
  Award, 
  BarChart2, 
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Metric data type
interface ResearchMetric {
  id: number;
  category: string;
  title: string;
  value: number;
  icon: string;
  description: string;
  trend?: number;
}

// Metric card component
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend
}: Omit<ResearchMetric, 'id' | 'category'>) => {
  // Function to get the appropriate icon
  const getIcon = () => {
    switch (icon) {
      case "file":
        return <FileText className="h-6 w-6 text-primary" />;
      case "users":
        return <Users className="h-6 w-6 text-secondary" />;
      case "education":
        return <GraduationCap className="h-6 w-6 text-accent" />;
      case "award":
        return <Award className="h-6 w-6 text-primary" />;
      case "chart":
        return <BarChart2 className="h-6 w-6 text-secondary" />;
      default:
        return <FileText className="h-6 w-6 text-primary" />;
    }
  };

  // Format the value with commas for thousands
  const formatValue = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <ButtonTap className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-50 rounded-full">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">
              <AnimatedCounter 
                value={value} 
                duration={2} 
                formatter={formatValue} 
              />
            </span>
            {trend !== undefined && (
              <span className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-4 w-4 ${trend >= 0 ? '' : 'transform rotate-180'}`} />
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </ButtonTap>
  );
};

const ResearchMetrics = () => {
  // Fetch research metrics data
  const { data: metrics = [], isLoading } = useQuery<ResearchMetric[]>({
    queryKey: ["/api/research-metrics"],
  });

  // Convert dynamic metrics to display format
  const metricsData = metrics.map(metric => ({
    id: metric.id,
    category: metric.category,
    title: metric.name,
    value: metric.value,
    icon: metric.icon,
    description: metric.description,
    trend: metric.trend || 0
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <RevealOnScroll
          direction="up"
          threshold={0.1}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            <TextHighlight 
              highlightColor="rgba(206, 16, 16, 0.15)"
              duration={1.5}
            >
              Research Impact Metrics
            </TextHighlight>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quantifiable measures of our contributions to policy research
            and advocacy in Ghana
          </p>
        </RevealOnScroll>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <BouncingDot 
              size={10} 
              count={4} 
              color="#ce1010" 
              className="mt-8" 
            />
          </div>
        ) : (
          <StaggeredList 
            delay={0.15} 
            direction="up" 
            distance={30} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {metricsData.map((metric) => (
              <MetricCard
                key={metric.id}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                description={metric.description}
                trend={metric.trend}
              />
            ))}
          </StaggeredList>
        )}

        <RevealOnScroll
          direction="up"
          delay={0.5}
          className="text-center mt-12"
        >
          <Link href="/research">
            <Button 
              className="bg-primary hover:bg-red-700 text-white"
            >
              Explore Our Research
            </Button>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default ResearchMetrics;