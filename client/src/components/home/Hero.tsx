import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FadeIn, 
  TextHighlight, 
  MagneticInteraction, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/micro-interactions";
import { ImmersiveCarousel } from "@/components/ui/immersive-carousel";
import carouselData from "@/data/carousel-data";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToContent = () => {
    const contentElement = document.getElementById('about-section');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      {/* Immersive Carousel Background */}
      <div className="h-screen w-full relative overflow-hidden">
        <ImmersiveCarousel 
          images={carouselData}
          height="h-screen"
          autoPlay={true}
          interval={6000}
          showDots={true}
          showCaption={true}
          renderCustomOverlay={(currentIndex) => (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-4xl px-4 z-10">
                <FadeIn delay={0.2} duration={0.8} className="mt-8">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                    <TextHighlight
                      highlightColor="rgba(206, 16, 16, 0.4)"
                      duration={1.5}
                    >
                      A Better Ghana Through
                    </TextHighlight>
                    <span className="block mt-3">
                      <TextHighlight 
                        highlightColor="rgba(252, 211, 77, 0.4)" 
                        duration={1.5}
                        delay={0.3}
                      >
                        Intellectual Revolution
                      </TextHighlight>
                    </span>
                  </h1>
                </FadeIn>
                
                <StaggerContainer delay={0.8}>
                  <StaggerItem>
                    <div className="flex justify-center mb-8">
                      <Link href="/get-involved">
                        <MagneticInteraction strength={50}>
                          <Button className="bg-accent hover:bg-green-700 text-white font-medium py-6 px-8 text-lg">
                            Join the Movement
                          </Button>
                        </MagneticInteraction>
                      </Link>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </div>
          )}
        />
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-20 animate-bounce">
          <button 
            onClick={scrollToContent}
            className="flex flex-col items-center cursor-pointer"
            aria-label="Scroll down for more content"
          >
            <span className="text-sm font-medium mb-2">Learn More</span>
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
