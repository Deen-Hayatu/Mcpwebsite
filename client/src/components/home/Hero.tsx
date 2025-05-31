import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FadeIn, 
  TextHighlight, 
  MagneticInteraction, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/micro-interactions";

const Hero = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <FadeIn delay={0.2} duration={0.8}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            <TextHighlight
              highlightColor="rgba(206, 16, 16, 0.15)"
              duration={1.5}
            >
              A Better Ghana Through
            </TextHighlight>
            <span className="block mt-2">
              <TextHighlight 
                highlightColor="rgba(252, 211, 77, 0.25)" 
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
    </section>
  );
};

export default Hero;
