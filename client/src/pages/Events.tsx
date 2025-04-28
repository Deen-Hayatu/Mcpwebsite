import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { ShareableContent, SocialShare } from "@/components/social";
import { EventCalendar, EventRegistrationForm, AddToCalendar } from '@/components/events';
import { Event } from '@/lib/types';

const Events = () => {
  // Generate the website base URL for sharing
  const baseUrl = window.location.origin;
  
  // State for managing event registration
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 ghana-landmarks-section">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left">Events & Programs</h1>
        
        {/* Share page button */}
        <SocialShare 
          title="Events & Programs - Mfantsefo Policy Center"
          description="Discover upcoming events and programs organized by the Mfantsefo Policy Center"
          className="mt-4 md:mt-0"
        />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Event Calendar with Registration */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Event Calendar</h2>
          <EventCalendar 
            onEventSelect={handleEventSelect}
            className="mb-8"
          />
          
          {/* Registration Form Dialog */}
          <EventRegistrationForm 
            event={selectedEvent}
            isOpen={showRegistrationForm}
            onClose={() => setShowRegistrationForm(false)}
          />
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">MPC Campus Tour 2025</h2>
          <div className="grid grid-cols-1 gap-6 mb-10">
            <ShareableContent 
              title="MPC Campus Tour 2025: A Better Ghana Through Intellectual Revolution"
              description="Join our nationwide campus tour (May 17 – June 10, 2025) engaging with students at schools and universities across Ghana about intellectual revolution and policy innovation."
              url={`${baseUrl}/events/campus-tour-2025`}
              sharePosition="top-right"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">MPC Campus Tour 2025: A Better Ghana Through Intellectual Revolution</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>May 17 - June 10, 2025</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Multiple venues across Ghana</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A nationwide campus tour engaging with students at schools and universities across Ghana. 
                    The tour aims to ignite an intellectual revolution among Ghana's youth, focusing on self-reliance, 
                    industrialization, and cultural confidence.
                  </p>
                  <div className="mb-4 border-l-4 border-primary pl-4 py-2 bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-semibold">Tour Schedule Highlights:</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li><strong>May 17:</strong> University of Ghana, Legon - Launch & Keynote</li>
                      <li><strong>May 25:</strong> KNUST, Kumasi - Africa Day Forum</li>
                      <li><strong>May 31:</strong> University of Energy & Natural Resources, Sunyani</li>
                      <li><strong>June 2:</strong> University for Development Studies, Tamale</li>
                      <li><strong>June 10:</strong> Independence Square, Accra - Finale Rally</li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="flex gap-2"
                      onClick={() => window.location.href = "/events/campus-tour"}
                    >
                      View Full Tour Details
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <AddToCalendar 
                      event={{
                        id: 12,
                        title: "MPC Campus Tour 2025 Begins",
                        date: "2025-05-17",
                        location: "University of Ghana, Legon",
                        time: "10:00 AM - 1:00 PM",
                        description: "Launch of the nationwide MPC Campus Tour focused on intellectual revolution and policy innovation. Keynote on 'A Ghana Beyond Aid – Our Generation's Call'"
                      }}
                      variant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            </ShareableContent>
          </div>
          
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
                    <Button 
                      className="flex gap-2"
                      onClick={() => handleEventSelect({
                        id: 4,
                        title: "Ghana Policy Forum 2025",
                        date: "2025-06-15",
                        location: "Accra International Conference Center",
                        time: "9:00 AM - 5:00 PM",
                        description: "Join us for a three-day conference bringing together policy experts, researchers, and government officials to discuss key issues facing Ghana today."
                      })}
                    >
                      Register Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <AddToCalendar 
                      event={{
                        id: 4,
                        title: "Ghana Policy Forum 2025",
                        date: "2025-06-15",
                        location: "Accra International Conference Center",
                        time: "9:00 AM - 5:00 PM",
                        description: "Join us for a three-day conference bringing together policy experts, researchers, and government officials to discuss key issues facing Ghana today."
                      }}
                      variant="outline"
                    />
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
                    <Button 
                      className="flex gap-2"
                      onClick={() => handleEventSelect({
                        id: 2,
                        title: "Youth Leadership Workshop",
                        date: "2025-07-05",
                        location: "MPC Campus, East Legon",
                        time: "10:00 AM - 3:00 PM",
                        description: "A workshop designed to equip young Ghanaians with leadership skills and policy knowledge to become future leaders."
                      })}
                    >
                      Register Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <AddToCalendar 
                      event={{
                        id: 2,
                        title: "Youth Leadership Workshop",
                        date: "2025-07-05",
                        location: "MPC Campus, East Legon",
                        time: "10:00 AM - 3:00 PM",
                        description: "A workshop designed to equip young Ghanaians with leadership skills and policy knowledge to become future leaders."
                      }}
                      variant="outline"
                    />
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
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => {
                      handleEventSelect({
                        id: 8,
                        title: "Policy Fellowship Information Session",
                        date: "2025-05-10",
                        location: "MPC Headquarters, Accra",
                        time: "11:00 AM - 12:30 PM",
                        description: "Learn more about our six-month fellowship program for mid-career professionals interested in policy development and research. Meet alumni and program coordinators."
                      });
                    }}
                  >
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
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => {
                      handleEventSelect({
                        id: 9,
                        title: "Campus Ambassador Recruitment",
                        date: "2025-05-15",
                        location: "Online (Zoom)",
                        time: "2:00 PM - 3:30 PM",
                        description: "Join our Campus Ambassador program to promote policy awareness on your campus. This information session will explain program benefits, expectations, and application process."
                      });
                    }}
                  >
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
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => {
                      handleEventSelect({
                        id: 10,
                        title: "Public Lecture: The Future of Democracy in Ghana",
                        date: "2025-06-05",
                        location: "University of Ghana, Main Auditorium",
                        time: "5:00 PM - 7:00 PM",
                        description: "Join us for our monthly public lecture featuring Prof. Akosua Darkwah discussing the evolving nature of democratic institutions in Ghana and prospects for the future."
                      });
                    }}
                  >
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
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={() => {
                      handleEventSelect({
                        id: 11,
                        title: "Research Grant Information Session",
                        date: "2025-07-10",
                        location: "MPC Headquarters, Accra",
                        time: "10:00 AM - 12:00 PM",
                        description: "Learn about our research grant opportunities, eligibility criteria, and application process. Current grant recipients will share their experiences."
                      });
                    }}
                  >
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