import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  useToast
} from '@/components/ui';
import { Newsletter } from '@/lib/types';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import SubscribersList from '@/components/newsletter/SubscribersList';
import NewsletterPreview from '@/components/newsletter/NewsletterPreview';
import { Plus, Loader2, ArrowLeft, Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const NewsletterAdmin: React.FC = () => {
  const { toast } = useToast();
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('newsletters');

  // Fetch the newsletters
  const { 
    data: newsletters = [], 
    isLoading: isLoadingNewsletters,
    refetch: refetchNewsletters
  } = useQuery({ 
    queryKey: ['/api/newsletters'],
    queryFn: async () => {
      const response = await fetch('/api/newsletters');
      if (!response.ok) throw new Error('Failed to fetch newsletters');
      return response.json() as Promise<Newsletter[]>;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Newsletter>) => {
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create newsletter');
      }
      
      return response.json() as Promise<Newsletter>;
    },
    onSuccess: () => {
      toast({
        title: 'Newsletter created',
        description: 'The newsletter has been created successfully',
      });
      refetchNewsletters();
      setActiveTab('newsletters');
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create newsletter',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Newsletter> }) => {
      const response = await fetch(`/api/newsletters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update newsletter');
      }
      
      return response.json() as Promise<Newsletter>;
    },
    onSuccess: () => {
      toast({
        title: 'Newsletter updated',
        description: 'The newsletter has been updated successfully',
      });
      refetchNewsletters();
      setActiveTab('newsletters');
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update newsletter',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/newsletters/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to send newsletter');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Newsletter sent',
        description: 'The newsletter has been sent to all subscribers',
      });
      refetchNewsletters();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send newsletter',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const selectedNewsletter = selectedNewsletterId 
    ? newsletters.find(n => n.id === selectedNewsletterId) 
    : null;

  const handleCreateNewsletter = (data: any) => {
    createMutation.mutate({
      ...data,
      status: 'draft',
    });
  };

  const handleUpdateNewsletter = (data: any) => {
    if (selectedNewsletterId) {
      updateMutation.mutate({
        id: selectedNewsletterId,
        data: {
          ...data,
        },
      });
    }
  };

  const handleSendNewsletter = (id: number) => {
    sendMutation.mutate(id);
  };

  const renderNewslettersList = () => {
    if (isLoadingNewsletters) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (newsletters.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="text-xl font-medium text-muted-foreground mb-2">No newsletters yet</h3>
          <p className="text-muted-foreground mb-4">Create your first newsletter to get started</p>
          <Button onClick={() => setActiveTab('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Newsletter
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Newsletters</h2>
          <Button onClick={() => setActiveTab('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Newsletter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsletters.map((newsletter) => (
            <Card key={newsletter.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                <CardDescription>
                  {newsletter.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      newsletter.status === 'sent' ? 'bg-green-500' : 
                      newsletter.status === 'scheduled' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {newsletter.status}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    By {newsletter.authorName}
                  </span>
                </div>
                
                {newsletter.sentAt && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Sent: {format(new Date(newsletter.sentAt), 'PPP')}
                  </p>
                )}
                
                {newsletter.scheduledFor && (
                  <p className="text-xs text-muted-foreground mb-2 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Scheduled: {format(new Date(newsletter.scheduledFor), 'PPP p')}
                  </p>
                )}
                
                <div className="mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedNewsletterId(newsletter.id);
                      setActiveTab('edit');
                    }}
                  >
                    Edit
                  </Button>
                  
                  {newsletter.status === 'draft' && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleSendNewsletter(newsletter.id)}
                      disabled={sendMutation.isPending}
                    >
                      {sendMutation.isPending && newsletter.id === selectedNewsletterId ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3 mr-1" />
                      )}
                      Send
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderNewsletterForm = (isCreating: boolean) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('newsletters')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Newsletters
          </Button>
          <h2 className="text-2xl font-bold">
            {isCreating ? 'Create Newsletter' : 'Edit Newsletter'}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <NewsletterForm 
              newsletter={isCreating ? undefined : selectedNewsletter || undefined}
              onSubmit={isCreating ? handleCreateNewsletter : handleUpdateNewsletter}
              isSubmitting={isCreating ? createMutation.isPending : updateMutation.isPending}
            />
          </div>
          
          {!isCreating && selectedNewsletter && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <NewsletterPreview newsletter={selectedNewsletter} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Newsletter Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="newsletters" className="mt-6">
          {selectedNewsletterId && activeTab === 'edit' ? (
            renderNewsletterForm(false)
          ) : activeTab === 'create' ? (
            renderNewsletterForm(true)
          ) : (
            renderNewslettersList()
          )}
        </TabsContent>
        
        <TabsContent value="subscribers" className="mt-6">
          <h2 className="text-2xl font-bold mb-6">Subscribers Management</h2>
          <SubscribersList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterAdmin;