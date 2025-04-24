import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function PageHeader({
  title,
  description,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`bg-primary/5 py-12 ${className}`}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          {description && (
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}