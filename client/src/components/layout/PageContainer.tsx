import React from 'react';
import { PageTransition } from '@/components/ui/micro-interactions';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withLandmarkMotifs?: boolean;
  withAnimation?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  withLandmarkMotifs = false,
  withAnimation = true
}) => {
  const containerClasses = cn(
    'container mx-auto px-4 py-8',
    withLandmarkMotifs && 'ghana-landmarks-section',
    className
  );

  if (withAnimation) {
    return (
      <PageTransition>
        <div className={containerClasses}>
          {children}
        </div>
      </PageTransition>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default PageContainer;