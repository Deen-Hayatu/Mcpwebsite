import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import { ShareableContent, SocialShare } from "@/components/social";
import { ArrowUpRight } from "lucide-react";
import { MetricsDashboard, MetricsGrid } from "@/components/research";

const Research = () => {
  const { data: policyBriefs = [] } = useQuery<PolicyBrief[]>({
    queryKey: ["/api/policy-briefs"],
  });

  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left">Research & Publications</h1>
        
        {/* Share page button */}
        <SocialShare 
          title="Research & Publications - Mfantsefo Policy Center"
          description="Explore the latest policy briefs and research papers from the Mfantsefo Policy Center"
          className="mt-4 md:mt-0"
        />
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Policy Briefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policyBriefs.length > 0 ? (
              policyBriefs.map((brief: PolicyBrief) => (
                <ShareableContent 
                  key={brief.id}
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
                      <Button variant="secondary" className="w-full group">
                        Read More 
                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </ShareableContent>
              ))
            ) : (
              <>
                <ShareableContent 
                  title="Policy Brief One"
                  description="Lorem ipsum dolor sit amet, consectetuer eli"
                  url={`${baseUrl}/research/brief/example-1`}
                  sharePosition="top-right"
                >
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-6 pt-12">
                      <div className="mb-4">
                        <MPCLogo size="sm" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Policy Brief One</h3>
                      <p className="text-sm text-gray-500 mb-3">March 15, 2025</p>
                      <p className="text-muted-foreground mb-4">Lorem ipsum dolor sit amet, consectetuer eli</p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 px-6 py-3">
                      <Button variant="secondary" className="w-full group">
                        Read More
                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </ShareableContent>
                
                <ShareableContent 
                  title="Policy Brief Two"
                  description="Lorem ipsum dolor sit amet, consectetuer e..."
                  url={`${baseUrl}/research/brief/example-2`}
                  sharePosition="top-right"
                >
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-6 pt-12">
                      <div className="mb-4">
                        <MPCLogo size="sm" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Policy Brief Two</h3>
                      <p className="text-sm text-gray-500 mb-3">March 15, 2025</p>
                      <p className="text-muted-foreground mb-4">Lorem ipsum dolor sit amet, consectetuer e...</p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 px-6 py-3">
                      <Button variant="secondary" className="w-full group">
                        Read More
                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </ShareableContent>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Research Papers</h2>
          <div className="grid grid-cols-1 gap-4">
            <ShareableContent 
              title="Ghana's Economic Outlook 2025"
              description="An analysis of Ghana's economic prospects and challenges in the coming years."
              url={`${baseUrl}/research/paper/economic-outlook-2025`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Ghana's Economic Outlook 2025</h3>
                  <p className="text-sm text-gray-500 mb-3">Published: January 2025</p>
                  <p className="text-muted-foreground mb-4">
                    An analysis of Ghana's economic prospects and challenges in the coming years.
                  </p>
                  <Button variant="outline" className="flex gap-2">
                    Download PDF
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </ShareableContent>
            
            <ShareableContent 
              title="Education Policy Reform in Ghana"
              description="A comprehensive review of education policies and recommendations for improvement."
              url={`${baseUrl}/research/paper/education-policy-reform`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Education Policy Reform in Ghana</h3>
                  <p className="text-sm text-gray-500 mb-3">Published: December 2024</p>
                  <p className="text-muted-foreground mb-4">
                    A comprehensive review of education policies and recommendations for improvement.
                  </p>
                  <Button variant="outline" className="flex gap-2">
                    Download PDF
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </ShareableContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
