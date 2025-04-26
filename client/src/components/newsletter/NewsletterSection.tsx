import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import SubscriptionForm from './SubscriptionForm';
import UnsubscribeForm from './UnsubscribeForm';

const NewsletterSection: React.FC = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
            <p className="text-muted-foreground">
              Join our newsletter to receive the latest policy research, event announcements, and insights from Movement for Positive Change.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-sm p-6 border">
            <Tabs defaultValue="subscribe">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
                <TabsTrigger value="unsubscribe">Unsubscribe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscribe">
                <SubscriptionForm />
              </TabsContent>
              
              <TabsContent value="unsubscribe">
                <UnsubscribeForm />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By subscribing, you agree to receive email communications from Movement for Positive Change. 
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;