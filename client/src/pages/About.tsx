import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About MpC</h1>
      
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              MpC is dedicated to fostering intellectual discourse and policy development to create a better Ghana. 
              Through research, education, and advocacy, we work to address the pressing challenges facing our nation.
            </p>
            <p className="text-muted-foreground">
              Our goal is to build a network of thinkers, researchers, and policy experts who can collaborate to 
              develop innovative solutions for Ghana's development.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              We envision a Ghana where policy decisions are guided by rigorous research, where intellectual 
              discourse flourishes, and where innovative ideas are translated into practical solutions for 
              national development.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Excellence in research and intellectual rigor</li>
              <li>Independence and objectivity in our analysis</li>
              <li>Inclusivity and diversity of perspectives</li>
              <li>Commitment to practical, evidence-based solutions</li>
              <li>Integrity, transparency, and accountability</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
