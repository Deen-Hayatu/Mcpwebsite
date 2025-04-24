import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  GyeNyame, 
  Dwennimmen, 
  Sankofa, 
  WavePattern 
} from './GhanaianPatterns';

interface MotionLayoutProps {
  children: ReactNode;
}

const MotionLayout: React.FC<MotionLayoutProps> = ({ children }) => {
  const [location] = useLocation();

  // Each route gets a unique transition based on path
  const getPatternByRoute = (path: string) => {
    const patternMap: Record<string, React.ReactNode> = {
      '/': <GyeNyame className="w-full h-full fill-current text-primary" />,
      '/about': <Sankofa className="w-full h-full fill-current text-primary" />,
      '/research': <Dwennimmen className="w-full h-full fill-current text-secondary" />,
    };
    
    // Default to wave pattern if no specific pattern is defined
    return patternMap[path] || <WavePattern className="w-full h-full fill-current text-accent" />;
  };

  // Motion variants for the main content
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
        delay: 0.3, // Delay content entrance until after the pattern animation
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  // Motion variants for the pattern overlay
  const patternVariants = {
    initial: {
      opacity: 0,
      scale: 1.2,
    },
    animate: {
      opacity: 0.03,  // Reduced opacity to make patterns less intrusive
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background patterns - significantly reduced opacity */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 opacity-[0.01] pointer-events-none z-0">
        <Dwennimmen className="w-full h-full fill-current text-primary" />
      </div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 opacity-[0.01] pointer-events-none z-0">
        <GyeNyame className="w-full h-full fill-current text-secondary" />
      </div>
      
      {/* Main content with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10"
        >
          {/* Page-specific pattern transition */}
          <motion.div 
            variants={patternVariants}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <div className="w-3/4 h-3/4 max-w-4xl max-h-4xl">
              {getPatternByRoute(location)}
            </div>
          </motion.div>
          
          {/* Page content */}
          <motion.div variants={contentVariants}>
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MotionLayout;