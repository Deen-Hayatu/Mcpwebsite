import React from 'react';

interface PatternProps {
  className?: string;
}

// Adinkra symbol: "Gye Nyame" (Except for God)
export const GyeNyame: React.FC<PatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M82.5,65c-2.5,0-4.5-2-4.5-4.5c0-1.7,1-3.2,2.4-4c-3.1-5.5-8.4-9.5-14.9-10.4c2.1-1.2,3.5-3.5,3.5-6.1
        c0-3.9-3.1-7-7-7c-1.1,0-2.2,0.3-3.1,0.7C57.3,25.5,50,19.3,41.3,19.3c-3.9,0-7,3.1-7,7c0,1.5,0.5,3,1.4,4.1
        c-8.1,2.4-14.1,9.8-14.6,18.6c-2.7,0.1-4.9,2.3-4.9,5c0,2.8,2.2,5,5,5c0.9,0,1.7-0.2,2.4-0.6c3.1,5.4,8.8,9,15.4,9
        c3.1,0,6-0.8,8.5-2.2c1.7,6.2,7.4,10.8,14.1,10.8c2.7,0,5.3-0.8,7.5-2.1c1.5,0.7,3.2,1.1,5,1.1c6.4,0,11.6-5.2,11.6-11.6
        C85.7,65.3,82.5,65,82.5,65z"
        fill="currentColor"
      />
    </svg>
  );
};

// Adinkra symbol: "Dwennimmen" (Ram's horns)
export const Dwennimmen: React.FC<PatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M50,10c-22.1,0-40,17.9-40,40s17.9,40,40,40s40-17.9,40-40S72.1,10,50,10z M80,50c0,16.6-13.4,30-30,30
        c-16.6,0-30-13.4-30-30c0-16.6,13.4-30,30-30C66.6,20,80,33.4,80,50z M70,50c0,11-9,20-20,20c-11,0-20-9-20-20
        c0-11,9-20,20-20C61,30,70,39,70,50z M60,50c0,5.5-4.5,10-10,10c-5.5,0-10-4.5-10-10c0-5.5,4.5-10,10-10
        C55.5,40,60,44.5,60,50z"
        fill="currentColor"
      />
    </svg>
  );
};

// Adinkra symbol: "Sankofa" (Return and get it)
export const Sankofa: React.FC<PatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M85,50c0,19.3-15.7,35-35,35c-19.3,0-35-15.7-35-35c0-19.3,15.7-35,35-35c8.9,0,17,3.3,23.2,8.8
        c-2.8-4.9-4.4-10.6-4.4-16.6h5c0,8.2,3.3,15.6,8.7,21c1.6,1.6,3.4,3,5.3,4.1C84.6,41.7,85,45.8,85,50z M65,50
        c0,8.3-6.7,15-15,15c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15C58.3,35,65,41.7,65,50z"
        fill="currentColor"
      />
    </svg>
  );
};

// Adinkra symbol: "Nkyinkyim" (Twistings)
export const Nkyinkyim: React.FC<PatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M90,60c0,5.5-4.5,10-10,10H65c-2.8,0-5-2.2-5-5c0-2.8,2.2-5,5-5h15c0,0,0-10-10-10H45c-5.5,0-10-4.5-10-10
        c0-5.5,4.5-10,10-10h25c2.8,0,5-2.2,5-5c0-2.8-2.2-5-5-5H30c0,0,0,10,10,10h10c5.5,0,10,4.5,10,10c0,5.5-4.5,10-10,10
        H25c-2.8,0-5,2.2-5,5c0,2.8,2.2,5,5,5h15c10,0,10,10,10,10H20c-5.5,0-10-4.5-10-10c0-5.5,4.5-10,10-10h5c0-10-10-10-10-10
        c-5.5,0-10-4.5-10-10c0-5.5,4.5-10,10-10h5c0-10,10-10,10-10h30c5.5,0,10,4.5,10,10c0,5.5-4.5,10-10,10h-5c0,10,10,10,10,10
        c5.5,0,10,4.5,10,10c0,5.5-4.5,10-10,10"
        fill="currentColor"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
};

// Kente-inspired pattern
export const KentePattern: React.FC<PatternProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {Array.from({ length: 10 }).map((_, index) => (
        <React.Fragment key={index}>
          <div 
            className="absolute h-3 bg-primary opacity-70"
            style={{
              width: '120%',
              left: '-10%',
              top: `${index * 15}px`,
            }}
          />
          <div 
            className="absolute h-1 bg-secondary opacity-70"
            style={{
              width: '120%',
              left: '-10%',
              top: `${index * 15 + 5}px`,
            }}
          />
          <div 
            className="absolute h-2 bg-accent opacity-70"
            style={{
              width: '120%',
              left: '-10%',
              top: `${index * 15 + 8}px`,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

// Independence Arch-inspired wave pattern
export const WavePattern: React.FC<PatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 30"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0,20 C20,5 35,30 55,20 C75,10 85,25 100,15 L100,30 L0,30 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M0,25 C15,15 35,35 50,20 C65,5 85,25 100,15 L100,30 L0,30 Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
};

export default {
  GyeNyame,
  Dwennimmen,
  Sankofa,
  Nkyinkyim,
  KentePattern,
  WavePattern
};