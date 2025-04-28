import React, { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ButtonInteraction } from "@/components/ui/micro-interactions";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonInteractionVariants = cva("", {
  variants: {
    interaction: {
      pulse: "transition-all duration-300 hover:shadow-md active:shadow-sm active:translate-y-[1px]",
      scale: "transition-transform active:scale-95",
      ripple: "relative overflow-hidden transform transition-transform active:scale-95",
      bounce: "transition-transform active:translate-y-[2px]",
      none: "",
    },
  },
  defaultVariants: {
    interaction: "scale",
  },
});

export interface AnimatedButtonProps extends ButtonProps, VariantProps<typeof buttonInteractionVariants> {
  children: ReactNode;
  scaleOnHover?: boolean;
  scaleOnTap?: boolean;
  scaleAmount?: number;
}

export function AnimatedButton({
  children,
  className,
  interaction,
  scaleOnHover = true,
  scaleOnTap = true,
  scaleAmount = 0.95,
  ...props
}: AnimatedButtonProps) {
  const buttonClasses = cn(buttonInteractionVariants({ interaction }), className);

  return (
    <ButtonInteraction
      scale={scaleOnTap ? scaleAmount : 1}
      duration={0.15}
    >
      <Button className={buttonClasses} {...props}>
        {children}
      </Button>
    </ButtonInteraction>
  );
}