import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ShareableContent, SocialShare, OneClickShare } from "@/components/social";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const PolicyBriefDetail = () => {
  // Get the policy brief ID from the URL
  const [, params] = useRoute<{ id: string }>("/research/brief/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;

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
  const shareUrl = `${baseUrl}/research/brief/${id}`;

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
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Policy Brief Not Found</h1>
          <p className="mb-8">The policy brief you're looking for doesn't exist or has been removed.</p>
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
            title={brief.title}
            description={brief.excerpt}
            url={shareUrl}
            sharePosition="top-right"
          >
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{brief.title}</h1>
                  <p className="text-gray-600">{brief.date}</p>
                </div>
                <SocialShare 
                  title={brief.title}
                  description={brief.excerpt}
                  url={shareUrl}
                  variant="icon-only"
                />
              </div>
              
              {/* Share banner with one-click buttons - Ghana themed */}
              <div className="mt-6 relative overflow-hidden">
                {/* Ghana flag colors as accents */}
                <div className="absolute top-0 left-0 h-1 w-full flex">
                  <div className="bg-red-600 flex-1"></div>
                  <div className="bg-yellow-500 flex-1"></div>
                  <div className="bg-green-600 flex-1"></div>
                </div>
                <div className="p-5 pt-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Share this Mfantsefo Policy Center brief:</h3>
                  <OneClickShare
                    title={brief.title}
                    description={brief.excerpt}
                    url={shareUrl}
                    platforms={["facebook", "twitter", "linkedin", "whatsapp", "email", "copy"]}
                    size="md"
                    showLabels={true}
                  />
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {brief.content ? (
                <div>
                  <p className="text-lg font-medium mb-6">{brief.excerpt}</p>
                  <div className="mt-6">{brief.content}</div>
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
                    necessary to address these challenges effectively. Mfantsefo Policy Center continues to
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
              <div className="mt-12 relative">
                {/* Ghana flag colors as border */}
                <div className="absolute top-0 left-0 h-1 w-full flex">
                  <div className="bg-red-600 flex-1"></div>
                  <div className="bg-yellow-500 flex-1"></div>
                  <div className="bg-green-600 flex-1"></div>
                </div>
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-medium">Did you find this policy brief useful?</h3>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-600 mb-2">Share with your colleagues</p>
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
            </div>
          </ShareableContent>
        </div>
      </div>
    </div>
  );
};

export default PolicyBriefDetail;