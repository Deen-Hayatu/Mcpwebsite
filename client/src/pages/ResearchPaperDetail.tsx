import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ShareableContent, SocialShare, OneClickShare } from "@/components/social";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
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

const ResearchPaperDetail = () => {
  // Get the research paper ID from the URL
  const [, params] = useRoute<{ id: string }>("/research/paper/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;

  // Fetch the specific research paper
  const { data: researchPaper, isLoading, error } = useQuery<PolicyBrief>({
    queryKey: ["/api/policy-briefs", id],
    queryFn: async () => {
      const response = await fetch(`/api/policy-briefs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch research paper");
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/research/paper/${id}`;

  // If there's an error fetching the specific paper, try to get all papers
  // as a fallback and find the one we need
  const { data: allPublications = [] } = useQuery<PolicyBrief[]>({
    queryKey: ["/api/policy-briefs"],
    enabled: !!error,
  });

  // Find the paper in the list if we couldn't get it directly
  const paperFromList = error ? allPublications.find(p => p.id === id && p.type === 'paper') : null;
  const paper = researchPaper || paperFromList;

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

  if (!paper) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Research Paper Not Found</h1>
          <p className="mb-8">The research paper you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/research">
            <Button className="inline-flex items-center gap-2 mb-6" style={{ cursor: 'pointer' }}>
              <ArrowLeft className="h-4 w-4" />
              Back to Research
            </Button>
          </Link>
          
          <div className="mb-4">
            <MPCLogo size="md" />
          </div>
          
          <ShareableContent
            title={paper.title}
            description={paper.excerpt}
            url={shareUrl}
            sharePosition="top-right"
          >
            <div className="mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{paper.title}</h1>
                <p className="text-gray-600 mb-2">{paper.date}</p>
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Research Paper
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
                    title={paper.title}
                    description={paper.excerpt}
                    url={shareUrl}
                    platforms={["facebook", "twitter", "linkedin", "whatsapp", "email", "copy"]}
                    size="sm"
                    showLabels={false}
                  />
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {paper.content ? (
                <div>
                  <p className="text-lg font-medium mb-6">{paper.excerpt}</p>
                  <div className="mt-6">
                    <article className="prose prose-headings:font-bold prose-a:text-primary">
                      <ReactMarkdown>{paper.content}</ReactMarkdown>
                    </article>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-6">{paper.excerpt}</p>
                  <p>
                    This research paper examines the critical issues related to {paper.title.toLowerCase()}.
                    Our comprehensive analysis highlights the importance of evidence-based policy making and provides
                    actionable recommendations for stakeholders.
                  </p>
                  <p>
                    The findings suggest that comprehensive approaches involving multiple sectors will be
                    necessary to address these challenges effectively. Movement for Positive Change continues to
                    research this topic and engage with policymakers to promote informed decision-making.
                  </p>
                  <h2>Key Findings</h2>
                  <ul>
                    <li>Comprehensive analysis of historical and current trends</li>
                    <li>Evidence-based evaluation of existing policies</li>
                    <li>Comparative study of international best practices</li>
                    <li>Multi-stakeholder perspectives on implementation strategies</li>
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
                      <h3 className="text-base font-medium">Was this research paper useful?</h3>
                      <p className="text-xs text-gray-500 mt-1">Share with others who might be interested</p>
                    </div>
                    <OneClickShare
                      title={paper.title}
                      description={paper.excerpt}
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
                  documentType="research_paper"
                  documentId={paper.id}
                  currentUserEmail={currentUser.email}
                  currentUserName={currentUser.name}
                />
              </TabsContent>
              
              <TabsContent value="notes" className="border p-4 rounded-md">
                <NoteList
                  documentType="research_paper"
                  documentId={paper.id}
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

export default ResearchPaperDetail;