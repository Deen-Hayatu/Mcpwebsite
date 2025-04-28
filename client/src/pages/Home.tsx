import Hero from "@/components/home/Hero";
import InfoCards from "@/components/home/InfoCards";
import ResearchSection from "@/components/home/ResearchSection";
import ResearchMetrics from "@/components/home/ResearchMetrics";

const Home = () => {
  return (
    <div className="ghana-landmarks-section">
      <Hero />
      <InfoCards />
      <ResearchMetrics />
      <ResearchSection />
    </div>
  );
};

export default Home;
