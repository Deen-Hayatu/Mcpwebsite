import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/shared/SEOHead";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 independence-square-motif">
      <SEOHead
        title="About MPC Ghana"
        description="Learn about the Movement for Positive Change (MPC), a policy research center dedicated to advancing Ghana's development through innovative, culturally-rooted research and youth-led advocacy."
        keywords="MPC Ghana, Ghana policy think tank, Pan-African research, Nkrumahist ideals, Ghana development, policy innovation"
        ogImage="/assets/seo/og-image.jpg"
      />
      <h1 className="text-4xl font-bold mb-8 text-center">About MPC</h1>
      
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8 relative z-10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To ignite an intellectual revolution that empowers Ghanaians to believe in and build a sovereign, 
              industrialized, and culturally confident nation, drawing inspiration from Nkrumahist ideals, 
              Pan-Africanism, and the development models of nations such as China, Singapore, and Malaysia, 
              while rooting progress in Ghanaian identity and values.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8 relative z-10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To drive Ghana's transformation through independent, culturally-rooted, and youth-led policy research, 
              public education, and strategic advocacy focused on industrialization, education reform, science and 
              technology, and cultural sovereignty.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8 relative z-10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Thematic Pillars</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Industrial Policy & Economic Sovereignty</li>
              <li>Education Reform & Curriculum Decolonization</li>
              <li>Science, Technology & Innovation (STI)</li>
              <li>Environment & Sustainable Development</li>
              <li>Cultural Identity & Pan-African Solidarity</li>
              <li>Youth Civic Engagement & Leadership</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-3xl mx-auto nkrumah-mausoleum-motif">
        <Card className="relative z-10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Core Objectives</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Policy Innovation:</strong> Conduct independent research on Ghana-specific policy solutions in education, industrialization, technology, and sustainable development.</li>
              <li><strong>Civic Education:</strong> Develop critical thinking and civic consciousness among Ghanaian youth.</li>
              <li><strong>Thought Leadership:</strong> Shape national and regional discourse on self-reliance, cultural pride, and economic sovereignty.</li>
              <li><strong>Knowledge Sharing:</strong> Host forums, workshops, webinars, and publish accessible content that translates research into action.</li>
              <li><strong>Strategic Engagement:</strong> Collaborate with educational institutions, government bodies, diaspora communities, and civil society.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
