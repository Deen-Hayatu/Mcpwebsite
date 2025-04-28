import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverScale } from "@/components/ui/micro-interactions";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("overflow-hidden transition-all duration-300", {
  variants: {
    hoverEffect: {
      subtle: "hover:shadow-md",
      lift: "hover:shadow-lg",
      glow: "hover:shadow-md hover:shadow-primary/20",
      outlineGlow: "border-2 hover:border-primary/50 hover:shadow-primary/10 hover:shadow-md",
      none: "",
    },
    clickEffect: {
      ripple: "",
      shrink: "",
      none: "",
    },
  },
  defaultVariants: {
    hoverEffect: "lift",
    clickEffect: "none",
  },
});

export interface AnimatedCardProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  children: ReactNode;
  scale?: number;
  scaleOnHover?: boolean;
}

export function AnimatedCard({
  children,
  className,
  hoverEffect = "lift",
  clickEffect = "none",
  scale = 1.02,
  scaleOnHover = true,
  ...props
}: AnimatedCardProps) {
  const cardClasses = cn(cardVariants({ hoverEffect, clickEffect }), className);

  const content = (
    <Card className={cardClasses} {...props}>
      {children}
    </Card>
  );

  return scaleOnHover ? (
    <HoverScale scale={scale} duration={0.2}>
      {content}
    </HoverScale>
  ) : content;
}

// Animated versions of Card subcomponents for consistency
export const AnimatedCardHeader = CardHeader;
export const AnimatedCardFooter = CardFooter;
export const AnimatedCardTitle = CardTitle;
export const AnimatedCardDescription = CardDescription;
export const AnimatedCardContent = CardContent;