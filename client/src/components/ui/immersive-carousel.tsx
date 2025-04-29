import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImmersiveCarouselProps {
  images: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  showCaption?: boolean;
  height?: string;
  width?: string;
  aspectRatio?: string;
  renderCustomOverlay?: (currentIndex: number) => React.ReactNode;
}

export const ImmersiveCarousel = ({
  images,
  autoPlay = true,
  interval = 5000,
  className = '',
  showArrows = true,
  showDots = true,
  showCaption = true,
  height = 'h-[500px]',
  width = 'w-full',
  aspectRatio,
  renderCustomOverlay
}: ImmersiveCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoPlay && !isHovered) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPlay, interval, images.length, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  return (
    <div 
      className={`relative overflow-hidden ${width} ${height} ${aspectRatio ? `aspect-[${aspectRatio}]` : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay to improve text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          
          {/* Caption */}
          {showCaption && (images[currentIndex].title || images[currentIndex].description) && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-0 left-0 p-6 w-full text-white"
            >
              {images[currentIndex].title && (
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{images[currentIndex].title}</h2>
              )}
              {images[currentIndex].description && (
                <p className="text-base md:text-lg max-w-xl">{images[currentIndex].description}</p>
              )}
            </motion.div>
          )}

          {/* Custom Overlay */}
          {renderCustomOverlay && renderCustomOverlay(currentIndex)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
