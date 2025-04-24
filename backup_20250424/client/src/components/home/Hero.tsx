import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          A Better Ghana Through
          <span className="block mt-2">Intellectual Revolution</span>
        </h1>
        <div className="flex justify-center mb-8">
          <Button className="bg-accent hover:bg-green-700 text-white font-medium py-6 px-8 text-lg">
            Join the Movement
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
