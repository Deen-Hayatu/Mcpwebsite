import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { StaffGrid } from "@/components/staff";
import PageHeader from "@/components/layout/PageHeader";
import PageContainer from "@/components/layout/PageContainer";

export default function StaffPage() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  
  return (
    <>
      <Helmet>
        <title>Our Team | Movement for Positive Change</title>
        <meta name="description" content="Meet the talented team of researchers, policy experts, and change-makers behind the Movement for Positive Change." />
      </Helmet>
      
      <PageHeader
        title="Our Team"
        description="Meet the talented individuals working to advance Ghana's development through innovative research and collaborative insights."
      />
      
      <PageContainer>
        <div className="prose max-w-none mb-8">
          <p>
            Our team combines academic expertise with practical experience in policy implementation. 
            With diverse backgrounds spanning economics, social development, environmental sustainability, and political science, 
            we bring a multidisciplinary approach to addressing Ghana's most pressing challenges.
          </p>
        </div>
        
        <StaffGrid isAdmin={isAdmin} />
      </PageContainer>
    </>
  );
}