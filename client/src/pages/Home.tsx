import Hero from "@/components/home/Hero";
import InfoCards from "@/components/home/InfoCards";
import ResearchSection from "@/components/home/ResearchSection";

const Home = () => {
  return (
    <div className="ghana-landmarks-section">
      <Hero />
      <InfoCards />
      <ResearchSection />
    </div>
  );
};

export default Home;
