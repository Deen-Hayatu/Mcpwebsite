import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withLandmarkMotifs?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  withLandmarkMotifs = false
}) => {
  return (
    <div className={`container mx-auto px-4 py-8 ${withLandmarkMotifs ? 'ghana-landmarks-section' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;