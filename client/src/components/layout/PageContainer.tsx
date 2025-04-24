import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`container px-4 mx-auto py-8 ${className}`}>
      {children}
    </div>
  );
}