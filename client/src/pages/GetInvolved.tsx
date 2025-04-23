import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, UserPlus, Heart, MessageSquare, 
  BookOpen, Briefcase, GraduationCap 
} from "lucide-react";

const GetInvolved = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Get Involved</h1>
      
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            There are many ways to get involved with MpC and contribute to our mission of building
            a better Ghana through intellectual revolution. Choose how you'd like to participate below.
          </p>
          <Button className="bg-accent hover:bg-green-700 text-white font-medium py-6 px-8 text-lg">
            Join the Movement
          </Button>
        </div>
        
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
                <Button>Join Now</Button>
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
                <Button>Donate</Button>
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
                <Button>Sign Up</Button>
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
                <Button>Connect</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
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
                <Button variant="outline">Apply</Button>
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
                <Button variant="outline">Learn More</Button>
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
                <Button variant="outline">View Jobs</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInvolved;
