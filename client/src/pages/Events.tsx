import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Clock } from "lucide-react";

const Events = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Events & Programs</h1>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6">
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
                <Button>Register Now</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
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
                <Button>Register Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Policy Fellowship</h3>
                <p className="text-muted-foreground mb-4">
                  A six-month fellowship program for mid-career professionals interested in
                  policy development and research.
                </p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Campus Ambassador Program</h3>
                <p className="text-muted-foreground mb-4">
                  A program for university students to promote policy awareness and
                  intellectual discourse on their campuses.
                </p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Public Lecture Series</h3>
                <p className="text-muted-foreground mb-4">
                  Monthly lectures by leading thinkers and policy experts on critical
                  issues facing Ghana.
                </p>
                <Button variant="outline">View Schedule</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Research Grants</h3>
                <p className="text-muted-foreground mb-4">
                  Funding opportunities for researchers working on policy-relevant
                  projects in various fields.
                </p>
                <Button variant="outline">Apply Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
