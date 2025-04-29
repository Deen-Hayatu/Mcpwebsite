import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionForm from './SubscriptionForm';
import UnsubscribeForm from './UnsubscribeForm';
import { useLocation } from 'wouter';

interface NewsletterSectionProps {
  variant?: 'default' | 'compact';
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ variant = 'default' }) => {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('subscribe');
  const [emailFromUrl, setEmailFromUrl] = useState<string>('');
  
  // Parse URL parameters to extract tab and email
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab');
    const email = params.get('email') || '';
    
    if (tabFromUrl === 'unsubscribe') {
      setActiveTab('unsubscribe');
    } else {
      setActiveTab('subscribe');
    }
    
    setEmailFromUrl(email);
  }, [location]);

  // Adjust styles based on variant
  const containerClassName = variant === 'compact' 
    ? "py-4 px-4 bg-white rounded-lg shadow-sm border border-muted" 
    : "py-8 px-6 bg-white rounded-lg shadow-md border border-muted";
    
  const headingClassName = variant === 'compact' 
    ? "text-xl font-bold mb-2" 
    : "text-2xl font-bold mb-2";
    
  const tabsListClassName = variant === 'compact' 
    ? "grid w-full grid-cols-2 mb-4" 
    : "grid w-full grid-cols-2 mb-8";
  
  return (
    <div className={containerClassName}>
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className={tabsListClassName}>
          <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
          <TabsTrigger value="unsubscribe">Unsubscribe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscribe" className="space-y-4">
          <div className="text-center mb-4">
            <h2 className={headingClassName}>Join Our Newsletter</h2>
            {variant !== 'compact' && (
              <p className="text-muted-foreground">
                Subscribe to receive updates on our latest research and events
              </p>
            )}
          </div>
          
          <SubscriptionForm />
        </TabsContent>
        
        <TabsContent value="unsubscribe" className="space-y-4">
          <div className="text-center mb-4">
            <h2 className={headingClassName}>Unsubscribe from Newsletter</h2>
            {variant !== 'compact' && (
              <p className="text-muted-foreground">
                We're sorry to see you go. Please enter your email to unsubscribe.
              </p>
            )}
          </div>
          
          <UnsubscribeForm initialEmail={emailFromUrl} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterSection;