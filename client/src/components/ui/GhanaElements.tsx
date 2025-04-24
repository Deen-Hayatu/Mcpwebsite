import React from 'react';

interface GhanaWavesProps {
  side: 'left' | 'right';
  className?: string;
}

// Wavy lines in Ghana colors connecting to the arch
export function GhanaWaves({ side, className = "" }: GhanaWavesProps) {
  return (
    <svg 
      viewBox="0 0 200 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ 
        transform: side === 'right' ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* Red wave line - more pronounced curve */}
      <path 
        d="M5,20 C20,5 40,35 80,15 C120,-5 160,25 195,20" 
        stroke="#CE1126" 
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Yellow wave line - middle curve */}
      <path 
        d="M5,40 C25,25 50,55 90,35 C130,15 160,45 195,40" 
        stroke="#FCD116" 
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Green wave line - bottom curve */}
      <path 
        d="M5,60 C30,45 60,75 100,55 C140,35 170,65 195,60" 
        stroke="#006B3F" 
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}