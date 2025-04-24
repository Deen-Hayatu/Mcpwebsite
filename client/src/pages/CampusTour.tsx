import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { SocialShare } from "@/components/social";
import CampusTourDetails from "@/components/programs/CampusTourDetails";

const CampusTour = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/events">
          <Button variant="ghost" className="flex items-center gap-2 mb-4">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center md:text-left">MPC Campus Tour 2025</h1>
          
          {/* Share page button */}
          <SocialShare 
            title="MPC Campus Tour 2025 - Movement for Positive Change"
            description="Join our nationwide campus tour engaging students about intellectual revolution and policy innovation across Ghana"
            className="mt-4 md:mt-0"
          />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">A Better Ghana Through Intellectual Revolution</h2>
          <p className="text-lg mb-6">
            Join us on a nationwide journey to ignite an intellectual awakening among Ghana's youth.
            May 17 - June 10, 2025
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => window.location.href = "/events"}
          >
            Register for Updates
          </Button>
        </div>
      </div>
      
      <CampusTourDetails />
      
      <div className="mt-16 flex justify-center">
        <Link href="/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CampusTour;