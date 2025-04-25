import { useEffect, useState } from 'react';
import MPCLogo from '@/components/ui/logo';

interface FloatingLogoProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  showOnMobile?: boolean;
}

const FloatingLogo = ({ 
  position = 'bottom-right', 
  showOnMobile = false 
}: FloatingLogoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4',
  }[position];
  
  // Show logo after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed ${positionClasses} z-50 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${showOnMobile ? 'flex' : 'hidden md:flex'}`}
    >
      <MPCLogo size="sm" showText={false} />
    </div>
  );
};

export default FloatingLogo;