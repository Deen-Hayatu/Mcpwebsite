import React from 'react';
import NewsletterSection from '@/components/newsletter/NewsletterSection';

const Newsletter: React.FC = () => {
  return (
    <div className="container py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">MPC Newsletter</h1>
          <p className="text-xl text-muted-foreground">
            Stay informed about our latest research, policy briefs, and events
          </p>
        </div>
        
        <NewsletterSection />
        
        <div className="mt-20 bg-muted/20 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Why Subscribe?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Research Insights</h3>
              <p className="text-muted-foreground">Get exclusive access to our latest research findings and policy analysis focused on Ghana's development.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                  <path d="M2 20h20"></path>
                  <path d="M14 12v.01"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Event Invitations</h3>
              <p className="text-muted-foreground">Be the first to know about upcoming events, workshops, and speaking engagements across Ghana.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Policy Updates</h3>
              <p className="text-muted-foreground">Receive timely briefings on policy developments and how they impact Ghana's economic, social, and political landscape.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center border-t pt-8">
          <p className="text-muted-foreground mb-2">
            Our newsletter is sent monthly, with occasional special editions.
          </p>
          <p className="text-sm text-muted-foreground">
            You can unsubscribe at any time. Movement for Positive Change respects your privacy and does not share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;