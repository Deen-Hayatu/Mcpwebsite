import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import GhanaBar from "@/components/home/GhanaBar";
import { ShareableContent, SocialShare } from "@/components/social";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

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
      <Card className="overflow-hidden h-full">
        <CardContent className="p-6 pt-12">
          <div className="mb-4">
            <MPCLogo size="sm" />
          </div>
          <h3 className="text-xl font-bold mb-2">{brief.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{brief.date}</p>
          <p className="text-muted-foreground mb-4">{brief.excerpt}</p>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3">
          <Link href={`/research/brief/${brief.id}`}>
            <Button variant="secondary" className="w-full group">
              Read More
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
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
          <h2 className="text-3xl font-bold text-center md:text-left text-foreground">
            Research & Publications
          </h2>
          
          {/* Share section button */}
          <SocialShare 
            title="Research & Publications - Mfantsefo Policy Center"
            description="Explore the latest policy briefs and research papers from the Mfantsefo Policy Center"
            className="mt-4 md:mt-0"
            variant="icon-only"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {policyBriefs.length > 0 ? (
            policyBriefs.map((brief: PolicyBrief) => (
              <PolicyBriefCard key={brief.id} brief={brief} />
            ))
          ) : (
            <>
              <PolicyBriefCard
                brief={{
                  id: 1,
                  title: "Policy Brief One",
                  date: "March 15, 2025",
                  excerpt: "Lorem ipsum dolor sit amet, consectetuer eli",
                }}
              />
              <PolicyBriefCard
                brief={{
                  id: 2,
                  title: "Policy Brief Two",
                  date: "March 15, 2025",
                  excerpt: "Lorem ipsum dolor sit amet, consectetuer e...",
                }}
              />
            </>
          )}
        </div>
        
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-3xl font-bold">Research & Publications</h2>
            <Link href="/research">
              <Button variant="ghost" size="sm" className="ml-4 flex items-center gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <GhanaBar />
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
