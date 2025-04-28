import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import GhanaBar from "@/components/home/GhanaBar";
import { ShareableContent, SocialShare } from "@/components/social";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/micro-interactions";

const PolicyBriefCard = ({ brief }: { brief: PolicyBrief }) => {
  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;
  
  return (
    <ShareableContent
      title={brief.title}
      description={brief.excerpt}
      url={`${baseUrl}/research/brief/${brief.id}`}
      sharePosition="top-right"
    >
      <AnimatedCard 
        className="overflow-hidden h-full" 
        hoverEffect="lift"
        scaleOnHover={true}
        scale={1.02}
      >
        <CardContent className="p-6 pt-12">
          <HoverScale>
            <div className="mb-4">
              <MPCLogo size="sm" />
            </div>
          </HoverScale>
          
          <SlideIn direction="up" delay={0.1} duration={0.4}>
            <h3 className="text-xl font-bold mb-2">{brief.title}</h3>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.2} duration={0.4}>
            <p className="text-sm text-gray-500 mb-3">{brief.date}</p>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.3} duration={0.4}>
            <p className="text-muted-foreground mb-4">{brief.excerpt}</p>
          </SlideIn>
        </CardContent>
        
        <CardFooter className="bg-gray-50 px-6 py-3">
          <Link href={`/research/brief/${brief.id}`}>
            <AnimatedButton 
              variant="secondary" 
              className="w-full group"
              interaction="pulse"
            >
              Read More
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </AnimatedButton>
          </Link>
        </CardFooter>
      </AnimatedCard>
    </ShareableContent>
  );
};

const ResearchSection = () => {
  const { data: policyBriefs = [] } = useQuery<PolicyBrief[]>({
    queryKey: ["/api/policy-briefs"],
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <FadeIn delay={0.1} duration={0.6}>
            <h2 className="text-3xl font-bold text-center md:text-left text-foreground">
              Research & Publications
            </h2>
          </FadeIn>
          
          {/* Share section button */}
          <HoverScale scale={1.1}>
            <SocialShare 
              title="Research & Publications - Movement for Positive Change"
              description="Explore the latest policy briefs and research papers from the Movement for Positive Change"
              className="mt-4 md:mt-0"
              variant="icon-only"
            />
          </HoverScale>
        </div>
        
        <StaggerContainer delay={0.2} staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {policyBriefs.length > 0 ? (
            policyBriefs.map((brief: PolicyBrief) => (
              <StaggerItem key={brief.id} direction="up" distance={30}>
                <PolicyBriefCard brief={brief} />
              </StaggerItem>
            ))
          ) : (
            <>
              <StaggerItem direction="up" distance={30}>
                <PolicyBriefCard
                  brief={{
                    id: 1,
                    title: "Policy Brief One",
                    date: "March 15, 2025",
                    excerpt: "Lorem ipsum dolor sit amet, consectetuer eli",
                    content: "Placeholder content for policy brief one",
                    type: "brief"
                  }}
                />
              </StaggerItem>
              <StaggerItem direction="up" distance={30}>
                <PolicyBriefCard
                  brief={{
                    id: 2,
                    title: "Policy Brief Two",
                    date: "March 15, 2025",
                    excerpt: "Lorem ipsum dolor sit amet, consectetuer e...",
                    content: "Placeholder content for policy brief two",
                    type: "brief"
                  }}
                />
              </StaggerItem>
            </>
          )}
        </StaggerContainer>
        
        <FadeIn delay={0.4} duration={0.8} className="text-center">
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-3xl font-bold">Research & Publications</h2>
            <Link href="/research">
              <AnimatedButton 
                variant="ghost" 
                size="sm" 
                className="ml-4 flex items-center gap-1"
                interaction="pulse"
              >
                View All
                <ArrowUpRight className="h-4 w-4" />
              </AnimatedButton>
            </Link>
          </div>
          <GhanaBar />
        </FadeIn>
      </div>
    </section>
  );
};

export default ResearchSection;
