import React, { useState } from "react";
import NewsletterSection from "@/components/newsletter/NewsletterSection";
import UnsubscribeForm from "@/components/newsletter/UnsubscribeForm";
import { Newspaper, Bell, Calendar, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Newsletter = () => {
  const [activeTab, setActiveTab] = useState("subscribe");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Newsletter</h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Stay updated with the latest from MpC Ghana
        </p>
        
        <div className="mb-12">
          <Tabs defaultValue="subscribe" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
              <TabsTrigger value="unsubscribe">Unsubscribe</TabsTrigger>
            </TabsList>
            <TabsContent value="subscribe">
              <NewsletterSection />
            </TabsContent>
            <TabsContent value="unsubscribe">
              <UnsubscribeForm />
            </TabsContent>
          </Tabs>
        </div>
        
        {activeTab === "subscribe" && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">What You'll Receive</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Newspaper className="w-6 h-6 text-primary mr-3" />
                      <h3 className="text-xl font-bold">Research Updates</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Be the first to know about our new policy briefs, research findings, and 
                      publications focused on Ghana's development.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-6 h-6 text-primary mr-3" />
                      <h3 className="text-xl font-bold">Event Invitations</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Receive invitations to our events, conferences, workshops, and policy 
                      dialogues both virtual and in-person.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Bell className="w-6 h-6 text-primary mr-3" />
                      <h3 className="text-xl font-bold">Program Announcements</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Get notified about new fellowship programs, funding opportunities, 
                      and other initiatives you can participate in.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <MessageCircle className="w-6 h-6 text-primary mr-3" />
                      <h3 className="text-xl font-bold">Community Updates</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Learn about the impact of our work and how our community is helping 
                      to shape Ghana's future through intellectual discourse.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Your Privacy Matters</h3>
              <p className="text-muted-foreground mb-4">
                We respect your inbox and your privacy. You can unsubscribe at any time with a single click.
                We send newsletters approximately once a month and never share your information with third parties.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Newsletter;