import React, { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Fade In animation component
export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 0.5,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide and fade animation component
export const SlideIn = ({ 
  children, 
  direction = "up", 
  delay = 0,
  duration = 0.5,
  distance = 20,
  className = ""
}: { 
  children: ReactNode; 
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    return { 
      y: direction === "up" || direction === "down" ? 0 : undefined,
      x: direction === "left" || direction === "right" ? 0 : undefined,
      opacity: 1
    };
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={getFinalPosition()}
      exit={getInitialPosition()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation component
export const StaggerContainer = ({ 
  children, 
  delay = 0,
  staggerDelay = 0.1,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  staggerDelay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            when: "beforeChildren",
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered child animation component
export const StaggerItem = ({ 
  children, 
  direction = "up",
  distance = 20,
  duration = 0.5,
  className = ""
}: { 
  children: ReactNode; 
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  className?: string;
}) => {
  const getVariants = () => {
    switch (direction) {
      case "up":
        return {
          hidden: { y: distance, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration } }
        };
      case "down":
        return {
          hidden: { y: -distance, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration } }
        };
      case "left":
        return {
          hidden: { x: distance, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration } }
        };
      case "right":
        return {
          hidden: { x: -distance, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration } }
        };
      default:
        return {
          hidden: { y: distance, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration } }
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hover scale animation for buttons, cards, etc.
export const HoverScale = ({ 
  children, 
  scale = 1.05,
  duration = 0.2,
  className = ""
}: { 
  children: ReactNode; 
  scale?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Subtle pulse animation for alerts or highlights
export const Pulse = ({ 
  children, 
  scale = 1.03,
  duration = 1.5,
  className = ""
}: { 
  children: ReactNode; 
  scale?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      animate={{ 
        scale: [1, scale, 1],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        repeatType: "loop"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Page transition component
export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Button click animation component
export const ButtonInteraction = ({ 
  children, 
  scale = 0.95,
  duration = 0.1,
  className = ""
}: { 
  children: ReactNode; 
  scale?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale }}
      transition={{ duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated counter for statistics
export const AnimatedCounter = ({ 
  value, 
  duration = 1.5,
  className = "",
  formatter = (val: number) => val.toString()
}: { 
  value: number; 
  duration?: number;
  className?: string;
  formatter?: (val: number) => string;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      >
        {formatter(value)}
      </motion.span>
    </motion.span>
  );
};