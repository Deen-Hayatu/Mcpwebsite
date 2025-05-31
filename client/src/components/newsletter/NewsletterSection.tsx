import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionForm from './SubscriptionForm';
import UnsubscribeForm from './UnsubscribeForm';
import { useLocation } from 'wouter';
import { Mail } from 'lucide-react';

interface NewsletterSectionProps {
  className?: string;
  variant?: "default" | "compact";
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ 
  className = "", 
  variant = "default" 
}) => {
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

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Newsletter</h3>
        </div>
        <SubscriptionForm />
      </div>
    );
  }

  return (
    <div className="py-8 px-6 bg-white rounded-lg shadow-md border border-muted">
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
          <TabsTrigger value="unsubscribe">Unsubscribe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscribe" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
            <p className="text-muted-foreground">
              Subscribe to receive updates on our latest research and events
            </p>
          </div>
          
          <SubscriptionForm />
        </TabsContent>
        
        <TabsContent value="unsubscribe" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Unsubscribe from Newsletter</h2>
            <p className="text-muted-foreground">
              We're sorry to see you go. Please enter your email to unsubscribe.
            </p>
          </div>
          
          <UnsubscribeForm initialEmail={emailFromUrl} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterSection;