import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const [location] = useLocation();

  // Base transition animation
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        <div className="relative">
          {/* Decorative adinkra pattern overlay - with much lower opacity */}
          <div className="absolute -top-16 -right-16 w-32 h-32 md:w-64 md:h-64 opacity-[0.01] pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full fill-current text-primary"
            >
              <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z M50,20 C66.5,20 80,33.5 80,50 C80,66.5 66.5,80 50,80 C33.5,80 20,66.5 20,50 C20,33.5 33.5,20 50,20 Z M50,30 C39.0,30 30,39.0 30,50 C30,61.0 39.0,70 50,70 C61.0,70 70,61.0 70,50 C70,39.0 61.0,30 50,30 Z M50,40 C55.5,40 60,44.5 60,50 C60,55.5 55.5,60 50,60 C44.5,60 40,55.5 40,50 C40,44.5 44.5,40 50,40 Z" />
            </svg>
          </div>
          
          {/* Kente-inspired diagonal pattern - left bottom */}
          <div className="absolute -bottom-16 -left-16 w-32 h-32 md:w-48 md:h-48 opacity-[0.01] pointer-events-none rotate-45 overflow-hidden">
            <div className="absolute w-full h-full">
              {Array.from({ length: 10 }).map((_, index) => (
                <div 
                  key={index}
                  className="absolute h-4 bg-secondary"
                  style={{
                    width: '200%',
                    left: '-50%',
                    top: `${index * 10}px`,
                    transform: 'rotate(-45deg)',
                  }}
                />
              ))}
            </div>
          </div>
          
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;