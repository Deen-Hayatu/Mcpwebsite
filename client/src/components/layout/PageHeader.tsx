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
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground mb-4">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}