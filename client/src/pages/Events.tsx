import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { ShareableContent, SocialShare } from "@/components/social";

const Events = () => {
  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left">Events & Programs</h1>
        
        {/* Share page button */}
        <SocialShare 
          title="Events & Programs - Mfantsefo Policy Center"
          description="Discover upcoming events and programs organized by the Mfantsefo Policy Center"
          className="mt-4 md:mt-0"
        />
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 gap-6">
            <ShareableContent 
              title="Ghana Policy Forum 2025"
              description="Join us for a three-day conference bringing together policy experts, researchers, and government officials to discuss key issues facing Ghana today. June 15-17, 2025 at Accra International Conference Center."
              url={`${baseUrl}/events/ghana-policy-forum-2025`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Ghana Policy Forum 2025</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>June 15-17, 2025</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Accra International Conference Center</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Join us for a three-day conference bringing together policy experts, researchers,
                    and government officials to discuss key issues facing Ghana today.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="flex gap-2">
                      Register Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      Add to Calendar
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ShareableContent>
            
            <ShareableContent 
              title="Youth Leadership Workshop"
              description="A workshop designed to equip young Ghanaians with leadership skills and policy knowledge to become future leaders. July 5, 2025 at MPC Campus, East Legon."
              url={`${baseUrl}/events/youth-leadership-workshop`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Youth Leadership Workshop</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>July 5, 2025</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>MPC Campus, East Legon</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>10:00 AM - 3:00 PM</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A workshop designed to equip young Ghanaians with leadership skills and
                    policy knowledge to become future leaders.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="flex gap-2">
                      Register Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      Add to Calendar
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ShareableContent>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ShareableContent 
              title="Policy Fellowship Program - Mfantsefo Policy Center"
              description="A six-month fellowship program for mid-career professionals interested in policy development and research."
              url={`${baseUrl}/programs/policy-fellowship`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Policy Fellowship</h3>
                  <p className="text-muted-foreground mb-4">
                    A six-month fellowship program for mid-career professionals interested in
                    policy development and research.
                  </p>
                  <Button variant="outline" className="flex gap-2">
                    Learn More
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </ShareableContent>
            
            <ShareableContent 
              title="Campus Ambassador Program - Mfantsefo Policy Center"
              description="A program for university students to promote policy awareness and intellectual discourse on their campuses."
              url={`${baseUrl}/programs/campus-ambassador`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Campus Ambassador Program</h3>
                  <p className="text-muted-foreground mb-4">
                    A program for university students to promote policy awareness and
                    intellectual discourse on their campuses.
                  </p>
                  <Button variant="outline" className="flex gap-2">
                    Learn More
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </ShareableContent>
            
            <ShareableContent 
              title="Public Lecture Series - Mfantsefo Policy Center"
              description="Monthly lectures by leading thinkers and policy experts on critical issues facing Ghana."
              url={`${baseUrl}/programs/public-lecture-series`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Public Lecture Series</h3>
                  <p className="text-muted-foreground mb-4">
                    Monthly lectures by leading thinkers and policy experts on critical
                    issues facing Ghana.
                  </p>
                  <Button variant="outline" className="flex gap-2">
                    View Schedule
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </ShareableContent>
            
            <ShareableContent 
              title="Research Grants - Mfantsefo Policy Center"
              description="Funding opportunities for researchers working on policy-relevant projects in various fields."
              url={`${baseUrl}/programs/research-grants`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">Research Grants</h3>
                  <p className="text-muted-foreground mb-4">
                    Funding opportunities for researchers working on policy-relevant
                    projects in various fields.
                  </p>
                  <Button variant="outline" className="flex gap-2">
                    Apply Now
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </ShareableContent>
          </div>
        </div>
        
        {/* Section for sharing the page */}
        <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Share these opportunities</h3>
              <p className="text-muted-foreground mb-4 md:mb-0">
                Help us spread the word about our events and programs
              </p>
            </div>
            <SocialShare 
              title="Events & Programs - Mfantsefo Policy Center"
              description="Discover upcoming events and programs organized by the Mfantsefo Policy Center"
              variant="inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
