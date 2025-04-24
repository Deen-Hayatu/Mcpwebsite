import React from 'react';

interface GhanaWavesProps {
  side: 'left' | 'right';
  className?: string;
}

export function GhanaWaves({ side, className = "" }: GhanaWavesProps) {
  // Ghana flag colors
  const colors = {
    red: "#CE1126",     // Red
    yellow: "#FCD116",  // Yellow/Gold
    green: "#006B3F"    // Green
  };

  return (
    <svg 
      viewBox="0 0 120 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ 
        transform: side === 'right' ? 'scaleX(-1)' : 'none',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Red Wave - Top */}
      <path 
        d="M0,20 
           C10,13 20,27 30,20 
           C40,13 50,27 60,20 
           C70,13 80,27 90,20 
           C100,13 110,27 120,20 
           L120,0 L0,0 Z" 
        fill={colors.red} 
      />
      
      {/* Yellow Wave - Middle */}
      <path 
        d="M0,50 
           C10,43 20,57 30,50 
           C40,43 50,57 60,50 
           C70,43 80,57 90,50 
           C100,43 110,57 120,50 
           L120,20 
           C110,27 100,13 90,20 
           C80,27 70,13 60,20 
           C50,27 40,13 30,20 
           C20,27 10,13 0,20 Z" 
        fill={colors.yellow} 
      />
      
      {/* Green Wave - Bottom */}
      <path 
        d="M0,80 
           C10,73 20,87 30,80 
           C40,73 50,87 60,80 
           C70,73 80,87 90,80 
           C100,73 110,87 120,80 
           L120,50 
           C110,57 100,43 90,50 
           C80,57 70,43 60,50 
           C50,57 40,43 30,50 
           C20,57 10,43 0,50 Z" 
        fill={colors.green} 
      />
    </svg>
  );
}