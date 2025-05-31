import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { 
  FadeIn, 
  TextHighlight, 
  MagneticInteraction, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/ui/micro-interactions";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <FadeIn delay={0.2} duration={0.8}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            <TextHighlight
              highlightColor="rgba(206, 16, 16, 0.15)"
              duration={1.5}
            >
              {t('hero.title')}
            </TextHighlight>
          </h1>
        </FadeIn>
        
        <StaggerContainer delay={0.8}>
          <StaggerItem>
            <div className="flex justify-center mb-8">
              <Link href="/get-involved">
                <MagneticInteraction strength={50}>
                  <Button className="bg-accent hover:bg-green-700 text-white font-medium py-6 px-8 text-lg">
                    {t('hero.joinMovement')}
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
