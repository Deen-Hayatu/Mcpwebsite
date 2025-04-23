import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import GhanaBar from "@/components/home/GhanaBar";

const PolicyBriefCard = ({ brief }: { brief: PolicyBrief }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4">
          <MPCLogo size="sm" />
        </div>
        <h3 className="text-xl font-bold mb-2">{brief.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{brief.date}</p>
        <p className="text-muted-foreground mb-4">{brief.excerpt}</p>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <Button variant="secondary" className="w-full">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

const ResearchSection = () => {
  const { data: policyBriefs = [] } = useQuery({
    queryKey: ["/api/policy-briefs"],
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Research & Publications
        </h2>
        
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
          <h2 className="text-3xl font-bold mb-4">Research & Publications</h2>
          <GhanaBar />
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
