import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import { ShareableContent, SocialShare } from "@/components/social";
import { ArrowUpRight } from "lucide-react";
import { MetricsDashboard, MetricsGrid } from "@/components/research";
import { SEOHead } from "@/components/shared/SEOHead";

const Research = () => {
  const { data: allPublications = [] } = useQuery<PolicyBrief[]>({
    queryKey: ["/api/policy-briefs"],
  });

  // Sort by date (most recent first) and filter by type
  const sortedPublications = [...allPublications].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime(); // Descending (newest first)
  });
  
  const policyBriefs = sortedPublications.filter(pub => pub.type === 'brief' || !pub.type);
  const researchPapers = sortedPublications.filter(pub => pub.type === 'paper');
  const opinionPieces = sortedPublications.filter(pub => pub.type === 'opinion');

  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;

  return (
    <div className="container mx-auto px-4 py-12 ghana-landmarks-section">
      <SEOHead
        title="Research & Publications"
        description="Explore policy briefs and research papers from the Movement for Positive Change (MPC) focused on Ghana's development, economic policies, and social transformation."
        keywords="policy research, Ghana economic policy, research papers, policy briefs, MPC Ghana research"
        ogImage="/assets/seo/og-image.jpg"
      />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-center md:text-left">Research & Publications</h1>
        
        {/* Share page button */}
        <SocialShare 
          title="Research & Publications - Movement for Positive Change"
          description="Explore the latest policy briefs and research papers from the Movement for Positive Change"
          className="mt-4 md:mt-0"
        />
      </div>
      
      {/* Research Metrics Dashboard */}
      <div className="mb-16 relative z-10">
        <h2 className="text-2xl font-bold mb-6">Research Impact Metrics</h2>
        <MetricsDashboard className="w-full" />
      </div>
      
      {/* Key Metrics Grid */}
      <div className="mb-16 relative z-10">
        <h2 className="text-2xl font-bold mb-6">Key Research Metrics</h2>
        <MetricsGrid limit={3} className="w-full" />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
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
                      <Button 
                        variant="secondary" 
                        className="w-full group"
                        onClick={() => window.location.href = `${baseUrl}/research/brief/${brief.id}`}
                      >
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
                      <Button 
                        variant="secondary" 
                        className="w-full group"
                        onClick={() => window.location.href = `${baseUrl}/research/brief/example-1`}
                      >
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
                      <Button 
                        variant="secondary" 
                        className="w-full group"
                        onClick={() => window.location.href = `${baseUrl}/research/brief/example-2`}
                      >
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
            {researchPapers.length > 0 ? (
              researchPapers.map((paper: PolicyBrief) => (
                <ShareableContent 
                  key={paper.id}
                  title={paper.title}
                  description={paper.excerpt}
                  url={`${baseUrl}/research/paper/${paper.id}`}
                  sharePosition="top-right"
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 pt-12">
                      <h3 className="text-xl font-bold mb-2">{paper.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{paper.date}</p>
                      <p className="text-muted-foreground mb-4">{paper.excerpt}</p>
                      <Button 
                        variant="secondary" 
                        className="w-full group"
                        onClick={() => window.location.href = `${baseUrl}/research/paper/${paper.id}`}
                      >
                        Read Paper
                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </ShareableContent>
              ))
            ) : (
              <>
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
                        Read Paper
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
                        Read Paper
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </ShareableContent>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Opinion Pieces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opinionPieces.length > 0 ? (
              opinionPieces.map((opinion: PolicyBrief) => (
                <ShareableContent 
                  key={opinion.id}
                  title={opinion.title}
                  description={opinion.excerpt}
                  url={`${baseUrl}/research/opinion/${opinion.id}`}
                  sharePosition="top-right"
                >
                  <Card className="overflow-hidden h-full border-l-4 border-l-ghana-gold">
                    <CardContent className="p-6 pt-12">
                      <div className="mb-4">
                        <MPCLogo size="sm" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{opinion.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>{opinion.date}</span>
                        {opinion.author && (
                          <>
                            <span>•</span>
                            <span className="font-medium">By {opinion.author}</span>
                          </>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{opinion.excerpt}</p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 px-6 py-3">
                      <Button 
                        variant="secondary" 
                        className="w-full group"
                        onClick={() => window.location.href = `${baseUrl}/research/opinion/${opinion.id}`}
                      >
                        Read Opinion
                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </ShareableContent>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p>No opinion pieces published yet. Check back soon for insights and commentary from our team.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
