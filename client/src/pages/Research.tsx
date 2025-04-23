import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import MPCLogo from "@/components/ui/logo";
import { PolicyBrief } from "@/lib/types";

const Research = () => {
  const { data: policyBriefs = [] } = useQuery({
    queryKey: ["/api/policy-briefs"],
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Research & Publications</h1>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Policy Briefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policyBriefs.length > 0 ? (
              policyBriefs.map((brief: PolicyBrief) => (
                <Card key={brief.id} className="overflow-hidden">
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
              ))
            ) : (
              <>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <MPCLogo size="sm" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Policy Brief One</h3>
                    <p className="text-sm text-gray-500 mb-3">March 15, 2025</p>
                    <p className="text-muted-foreground mb-4">Lorem ipsum dolor sit amet, consectetuer eli</p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-6 py-3">
                    <Button variant="secondary" className="w-full">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <MPCLogo size="sm" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Policy Brief Two</h3>
                    <p className="text-sm text-gray-500 mb-3">March 15, 2025</p>
                    <p className="text-muted-foreground mb-4">Lorem ipsum dolor sit amet, consectetuer e...</p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-6 py-3">
                    <Button variant="secondary" className="w-full">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Research Papers</h2>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Ghana's Economic Outlook 2025</h3>
                <p className="text-sm text-gray-500 mb-3">Published: January 2025</p>
                <p className="text-muted-foreground mb-4">
                  An analysis of Ghana's economic prospects and challenges in the coming years.
                </p>
                <Button variant="outline">Download PDF</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Education Policy Reform in Ghana</h3>
                <p className="text-sm text-gray-500 mb-3">Published: December 2024</p>
                <p className="text-muted-foreground mb-4">
                  A comprehensive review of education policies and recommendations for improvement.
                </p>
                <Button variant="outline">Download PDF</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
