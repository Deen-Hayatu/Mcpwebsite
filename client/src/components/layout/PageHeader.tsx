import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8 border-b border-border pb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;