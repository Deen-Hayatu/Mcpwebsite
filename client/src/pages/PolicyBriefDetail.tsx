import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ShareableContent, SocialShare, OneClickShare } from "@/components/social";
import { ArrowLeft, MessageSquare, FileText, Edit } from "lucide-react";
import { Link } from "wouter";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { AnnotationList } from "@/components/annotations";
import { NoteList } from "@/components/notes";
import ReactMarkdown from 'react-markdown';
import populationPyramidImage from "@assets/image_1748717941958.png";
import { SEO } from "@/components/SEO";

const PolicyBriefDetail = () => {
  // Get the policy brief ID from the URL - check both brief and opinion routes
  const [matchBrief, briefParams] = useRoute<{ id: string }>("/research/brief/:id");
  const [matchOpinion, opinionParams] = useRoute<{ id: string }>("/research/opinion/:id");
  
  const params = briefParams || opinionParams;
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const isOpinion = !!matchOpinion;

  // Fetch the specific policy brief
  const { data: policyBrief, isLoading, error } = useQuery<PolicyBrief>({
    queryKey: ["/api/policy-briefs", id],
    queryFn: async () => {
      const response = await fetch(`/api/policy-briefs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch policy brief");
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;
  const routeType = isOpinion ? 'opinion' : 'brief';
  const shareUrl = `${baseUrl}/research/${routeType}/${id}`;

  // If there's an error fetching the specific brief, try to get all briefs
  // as a fallback and find the one we need
  const { data: allBriefs = [] } = useQuery<PolicyBrief[]>({
    queryKey: ["/api/policy-briefs"],
    enabled: !!error,
  });

  // Find the brief in the list if we couldn't get it directly
  const briefFromList = error ? allBriefs.find(brief => brief.id === id) : null;
  const brief = policyBrief || briefFromList;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          
          <Skeleton className="h-64 w-full mb-8" />
          
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-1/2 mb-2" />
        </div>
      </div>
    );
  }

  if (!brief) {
    const contentType = isOpinion ? 'Opinion Piece' : 'Policy Brief';
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{contentType} Not Found</h1>
          <p className="mb-8">The {contentType.toLowerCase()} you're looking for doesn't exist or has been removed.</p>
          <Link href="/research">
            <Button className="inline-flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <ArrowLeft className="h-4 w-4" />
              Back to Research
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // For demo purposes, we'll use a mock user
  const currentUser = {
    email: "demo@mpcghana.org",
    name: "Demo User"
  };

  const contentType = isOpinion ? 'article' : 'article';
  const keywords = brief?.type === 'opinion' ? 
    ['Ghana opinion', 'policy opinion', 'Ghana analysis', brief.author || ''] :
    ['Ghana policy', 'research brief', 'policy analysis', 'Ghana development'];

  return (
    <div className="container mx-auto px-4 py-12">
      {brief && (
        <SEO 
          title={brief.title}
          description={brief.excerpt}
          keywords={keywords.filter(Boolean)}
          author={brief.author || undefined}
          type={contentType}
          url={shareUrl}
          publishedTime={new Date(brief.date).toISOString()}
        />
      )}
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Link href="/research">
              <Button className="inline-flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <ArrowLeft className="h-4 w-4" />
                Back to Research
              </Button>
            </Link>
            
            {/* Admin Edit Button */}
            <Link href={`/admin/edit-article/${brief.id}`}>
              <Button variant="outline" className="inline-flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <Edit className="h-4 w-4" />
                Edit Article
              </Button>
            </Link>
          </div>
          
          <div className="mb-4">
            <MPCLogo size="md" />
          </div>
          
          <ShareableContent
            title={brief.title}
            description={brief.excerpt}
            url={shareUrl}
            sharePosition="top-right"
          >
            <div className="mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{brief.title}</h1>
                <div className="text-gray-600 space-y-1">
                  {brief.author && <p className="font-medium">By {brief.author}</p>}
                  <p>{brief.date}</p>
                </div>
              </div>
              
              {/* Share banner with one-click buttons - Ghana themed */}
              <div className="mt-4 relative overflow-hidden">
                {/* Ghana flag colors as accents */}
                <div className="absolute top-0 left-0 h-0.5 w-full flex">
                  <div className="bg-red-600 flex-1"></div>
                  <div className="bg-yellow-500 flex-1"></div>
                  <div className="bg-green-600 flex-1"></div>
                </div>
                <div className="p-3 pt-4 bg-gray-50 rounded-md border border-gray-100 flex items-center flex-wrap">
                  <h3 className="text-xs font-medium mr-3 text-gray-700">Share:</h3>
                  <OneClickShare
                    title={brief.title}
                    description={brief.excerpt}
                    url={shareUrl}
                    platforms={["facebook", "twitter", "linkedin", "whatsapp", "email", "copy"]}
                    size="sm"
                    showLabels={false}
                  />
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {brief.content ? (
                <div>
                  <p className="text-lg font-medium mb-6">{brief.excerpt}</p>
                  <div className="mt-6">
                    <article className="prose prose-headings:font-bold prose-a:text-primary">
                      <ReactMarkdown
                        components={{
                          img: ({ node, ...props }) => {
                            if (props.src?.includes('@assets/image_1748717941958.png')) {
                              return (
                                <div className="my-8">
                                  <img 
                                    src={populationPyramidImage} 
                                    alt={props.alt || "Ghana Population Pyramid"}
                                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                                  />
                                  {props.alt && (
                                    <p className="text-sm text-gray-600 italic text-center mt-2">
                                      {props.alt}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            return <img {...props} className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />;
                          }
                        }}
                      >
                        {brief.content}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-6">{brief.excerpt}</p>
                  <p>
                    This policy brief examines the critical issues related to {brief.title.toLowerCase()}.
                    Our research highlights the importance of evidence-based policy making and provides
                    actionable recommendations for stakeholders.
                  </p>
                  <p>
                    The findings suggest that comprehensive approaches involving multiple sectors will be
                    necessary to address these challenges effectively. Movement for Positive Change continues to
                    research this topic and engage with policymakers to promote informed decision-making.
                  </p>
                  <h2>Key Recommendations</h2>
                  <ul>
                    <li>Invest in comprehensive data collection and analysis systems</li>
                    <li>Promote inclusive stakeholder engagement in policy formulation</li>
                    <li>Establish clear metrics and evaluation frameworks</li>
                    <li>Develop adaptive implementation strategies that respond to changing circumstances</li>
                  </ul>
                </div>
              )}
              
              {/* End of article share section */}
              <div className="mt-10 relative">
                {/* Ghana flag colors as border */}
                <div className="absolute top-0 left-0 h-0.5 w-full flex">
                  <div className="bg-red-600 flex-1"></div>
                  <div className="bg-yellow-500 flex-1"></div>
                  <div className="bg-green-600 flex-1"></div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div>
                      <h3 className="text-base font-medium">Was this research useful?</h3>
                      <p className="text-xs text-gray-500 mt-1">Share with others who might be interested</p>
                    </div>
                    <OneClickShare
                      title={brief.title}
                      description={brief.excerpt}
                      url={shareUrl}
                      platforms={["facebook", "twitter", "linkedin", "whatsapp", "email"]}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ShareableContent>
          
          {/* Collaborative Research Tools */}
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              Collaborative Research Tools
              <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                New
              </span>
            </h2>
            
            <Tabs defaultValue="annotations" className="w-full">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="annotations" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Annotations
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Research Notes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="annotations" className="border p-4 rounded-md">
                <AnnotationList 
                  documentType="policy_brief"
                  documentId={brief.id}
                  currentUserEmail={currentUser.email}
                  currentUserName={currentUser.name}
                />
              </TabsContent>
              
              <TabsContent value="notes" className="border p-4 rounded-md">
                <NoteList
                  documentType="policy_brief"
                  documentId={brief.id}
                  currentUserEmail={currentUser.email}
                  currentUserName={currentUser.name}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyBriefDetail;