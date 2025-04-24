import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const TransitionLink: React.FC<TransitionLinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = ''
}) => {
  const [location, navigate] = useLocation();
  const [isActive] = useRoute(href);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };
  
  return (
    <a 
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''} relative overflow-hidden`}
    >
      {children}
      
      {/* Animated underline effect */}
      {isActive && (
        <motion.div
          layoutId="navigation-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30
          }}
        />
      )}
      
      {/* Hover animation with kente-inspired colors */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </a>
  );
};

export default TransitionLink;