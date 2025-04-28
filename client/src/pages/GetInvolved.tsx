import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, UserPlus, Heart, MessageSquare, 
  BookOpen, Briefcase, GraduationCap, Mail
} from "lucide-react";
import NewsletterSection from "@/components/newsletter/NewsletterSection";
import { InvolvementForm } from "@/components/involvement/InvolvementForms";
import { Event } from "@/lib/types";
import { useLocation } from "wouter";

const GetInvolved = () => {
  const [, setLocation] = useLocation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 ghana-landmarks-section">
      <h1 className="text-4xl font-bold mb-8 text-center">Get Involved</h1>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-md mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            There are many ways to get involved with MpC and contribute to our mission of building
            a better Ghana through intellectual revolution. Choose how you'd like to participate below.
          </p>
          <Button 
            className="bg-accent hover:bg-green-700 text-white font-medium py-6 px-8 text-lg"
            onClick={() => setLocation("/events")}
          >
            Join the Movement
          </Button>
        </div>
        
        {/* Registration Form Dialog */}
        <InvolvementForm 
          event={selectedEvent}
          isOpen={showRegistrationForm}
          onClose={() => setShowRegistrationForm(false)}
        />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Ways to Get Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <UserPlus className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Become a Member</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Join our community of thinkers, researchers, and policy enthusiasts. Members receive
                  newsletters, event invitations, and opportunities to participate in our programs.
                </p>
                <Button onClick={() => handleEventSelect({
                  id: 20,
                  title: "Membership Registration",
                  date: "2025-05-01",
                  location: "MPC Headquarters, Accra",
                  time: "10:00 AM - 4:00 PM (Rolling Basis)",
                  description: "Register to become a member of the Mfantsefo Policy Center. Membership includes access to exclusive events, publications, and networking opportunities."
                })}>Join Now</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Donate</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Support our work through a one-time or recurring donation. Your contribution helps
                  fund our research, events, and educational initiatives.
                </p>
                <Button onClick={() => handleEventSelect({
                  id: 21,
                  title: "Donation Information Session",
                  date: "2025-05-05",
                  location: "MPC Headquarters, Accra",
                  time: "2:00 PM - 3:30 PM",
                  description: "Learn about how your donations support our work and the various ways to contribute financially to the Mfantsefo Policy Center."
                })}>Donate</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Volunteer</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Share your skills and time with us. We have volunteer opportunities in research,
                  event organization, content creation, and more.
                </p>
                <Button onClick={() => handleEventSelect({
                  id: 22,
                  title: "Volunteer Orientation",
                  date: "2025-05-12",
                  location: "MPC Headquarters, Accra",
                  time: "10:00 AM - 12:00 PM",
                  description: "Learn about volunteer opportunities at the Mfantsefo Policy Center and how you can contribute your skills and time to our mission."
                })}>Sign Up</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Join the Conversation</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Participate in our online forums, social media discussions, and public events
                  to contribute your ideas and perspectives.
                </p>
                <Button onClick={() => handleEventSelect({
                  id: 23,
                  title: "Policy Discussion Forum",
                  date: "2025-05-20",
                  location: "Online (Zoom)",
                  time: "6:00 PM - 8:00 PM",
                  description: "Join our monthly online discussion forum to debate current policy issues in Ghana. This month's topic: 'Education Reform and Economic Development'."
                })}>Connect</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Programs to Join</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-secondary mr-3" />
                  <h3 className="text-lg font-bold">Fellowship Program</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  A six-month program for professionals and researchers working on policy issues.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => handleEventSelect({
                    id: 8,
                    title: "Policy Fellowship Information Session",
                    date: "2025-05-10",
                    location: "MPC Headquarters, Accra",
                    time: "11:00 AM - 12:30 PM",
                    description: "Learn more about our six-month fellowship program for mid-career professionals interested in policy development and research. Meet alumni and program coordinators."
                  })}
                >
                  Apply
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="w-6 h-6 text-secondary mr-3" />
                  <h3 className="text-lg font-bold">Student Chapter</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Start or join a student chapter at your university to promote policy discourse.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => handleEventSelect({
                    id: 9,
                    title: "Campus Ambassador Recruitment",
                    date: "2025-05-15",
                    location: "Online (Zoom)",
                    time: "2:00 PM - 3:30 PM",
                    description: "Join our Campus Ambassador program to promote policy awareness on your campus. This information session will explain program benefits, expectations, and application process."
                  })}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-6 h-6 text-secondary mr-3" />
                  <h3 className="text-lg font-bold">Career Opportunities</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  View current job openings and internship opportunities at MpC.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => handleEventSelect({
                    id: 24,
                    title: "Career Fair & Networking",
                    date: "2025-06-01",
                    location: "MPC Headquarters, Accra",
                    time: "9:00 AM - 3:00 PM",
                    description: "Explore job opportunities and internships at the Mfantsefo Policy Center and meet with our team. Bring your resume and be prepared for on-the-spot interviews."
                  })}
                >
                  View Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-bold">Stay Informed</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter to receive updates on our research, policy briefs, events, and more.
                It's a great way to stay connected without a major commitment.
              </p>
              <NewsletterSection variant="compact" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
