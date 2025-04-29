import Hero from "@/components/home/Hero";
import InfoCards from "@/components/home/InfoCards";
import ResearchSection from "@/components/home/ResearchSection";
import ResearchMetrics from "@/components/home/ResearchMetrics";
import { SEOHead } from "@/components/shared/SEOHead";

const Home = () => {
  return (
    <div className="ghana-landmarks-section">
      <SEOHead
        title="Home"
        description="Movement for Positive Change (MPC) is dedicated to advancing Ghana's development through innovative research, collaborative insights, and interactive policy exploration."
        keywords="MPC Ghana, policy research, Ghana development, social policy, economic research"
      />
      <Hero />
      <InfoCards />
      <ResearchMetrics />
      <ResearchSection />
    </div>
  );
};

export default Home;
