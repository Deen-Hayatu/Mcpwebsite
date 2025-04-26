import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Badge
} from "@/components/ui";
import { Loader2, Edit, Send, Plus, Trash, RefreshCw, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Newsletter } from "@/lib/types";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import SubscribersList from "@/components/newsletter/SubscribersList";
import NewsletterPreview from "@/components/newsletter/NewsletterPreview";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const NewsletterAdmin: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("newsletters");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  
  // Fetch newsletters
  const { 
    data: newsletters = [], 
    isLoading: isLoadingNewsletters,
    refetch: refetchNewsletters,
  } = useQuery({ 
    queryKey: ['/api/newsletters'], 
    queryFn: async () => {
      const response = await fetch('/api/newsletters');
      if (!response.ok) throw new Error('Failed to fetch newsletters');
      return response.json() as Promise<Newsletter[]>;
    }
  });
  
  // Fetch subscribers count
  const { 
    data: subscribers = [], 
    isLoading: isLoadingSubscribers 
  } = useQuery({ 
    queryKey: ['/api/subscribers'], 
    queryFn: async () => {
      const response = await fetch('/api/subscribers');
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      return response.json();
    }
  });
  
  // Create newsletter mutation
  const createNewsletterMutation = useMutation({
    mutationFn: async (newsletter: Omit<Newsletter, 'id'>) => {
      const response = await apiRequest('POST', '/api/newsletters', newsletter);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Newsletter created",
        description: "Your newsletter has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create newsletter",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update newsletter mutation
  const updateNewsletterMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number, [key: string]: any }) => {
      const response = await apiRequest('PATCH', `/api/newsletters/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Newsletter updated",
        description: "Your newsletter has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update newsletter",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Send newsletter mutation
  const sendNewsletterMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/newsletters/${id}/send`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      setIsSendDialogOpen(false);
      toast({
        title: "Newsletter sent",
        description: `Successfully sent to ${data.newsletter.recipientCount} subscribers.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send newsletter",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const handleCreateNewsletter = (data: any) => {
    createNewsletterMutation.mutate({
      ...data,
      status: "draft",
      authorName: data.authorName || "Admin", // Fallback author name
    });
  };
  
  const handleUpdateNewsletter = (data: any) => {
    if (!currentNewsletter) return;
    updateNewsletterMutation.mutate({
      id: currentNewsletter.id,
      ...data
    });
  };
  
  const handleSendNewsletter = () => {
    if (!currentNewsletter) return;
    sendNewsletterMutation.mutate(currentNewsletter.id);
  };
  
  const openEditDialog = (newsletter: Newsletter) => {
    setCurrentNewsletter(newsletter);
    setIsEditDialogOpen(true);
  };
  
  const openPreviewDialog = (newsletter: Newsletter) => {
    setCurrentNewsletter(newsletter);
    setIsPreviewDialogOpen(true);
  };
  
  const openSendDialog = (newsletter: Newsletter) => {
    setCurrentNewsletter(newsletter);
    setIsSendDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'sent':
        return <Badge variant="success">Sent</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Newsletter Management</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchNewsletters()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Newsletter
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" />
            Subscribers
            {!isLoadingSubscribers && (
              <Badge variant="secondary" className="ml-2">
                {subscribers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="newsletters" className="mt-6">
          {isLoadingNewsletters ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : newsletters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No newsletters yet</h3>
              <p className="text-muted-foreground mb-4">Create your first newsletter to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Newsletter
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsletters.map((newsletter) => (
                <Card key={newsletter.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl line-clamp-1" title={newsletter.title}>
                        {newsletter.title}
                      </CardTitle>
                      {getStatusBadge(newsletter.status)}
                    </div>
                    <CardDescription className="line-clamp-1" title={newsletter.subject}>
                      {newsletter.subject}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground mb-2">
                      {newsletter.authorName && (
                        <span>By {newsletter.authorName} • </span>
                      )}
                      <span>
                        {newsletter.createdAt && formatDistanceToNow(new Date(newsletter.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {newsletter.status === 'sent' && (
                      <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <div>
                          <span className="font-medium text-foreground">{newsletter.recipientCount || 0}</span> recipients
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{newsletter.openCount || 0}</span> opens
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{newsletter.clickCount || 0}</span> clicks
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex gap-2 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openPreviewDialog(newsletter)}
                    >
                      Preview
                    </Button>
                    
                    {newsletter.status === 'draft' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(newsletter)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => openSendDialog(newsletter)}
                        >
                          <Send className="h-4 w-4 mr-1" /> Send
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="subscribers" className="mt-6">
          <SubscribersList />
        </TabsContent>
      </Tabs>
      
      {/* Create Newsletter Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Newsletter</DialogTitle>
          </DialogHeader>
          <NewsletterForm onSubmit={handleCreateNewsletter} isSubmitting={createNewsletterMutation.isPending} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Newsletter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Newsletter</DialogTitle>
          </DialogHeader>
          {currentNewsletter && (
            <NewsletterForm 
              newsletter={currentNewsletter} 
              onSubmit={handleUpdateNewsletter} 
              isSubmitting={updateNewsletterMutation.isPending} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Preview Newsletter Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Newsletter Preview</DialogTitle>
          </DialogHeader>
          {currentNewsletter && (
            <NewsletterPreview newsletter={currentNewsletter} />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Send Newsletter Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to send <strong>{currentNewsletter?.title}</strong> to {subscribers.length} subscribers?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleSendNewsletter}
              disabled={sendNewsletterMutation.isPending}
            >
              {sendNewsletterMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Newsletter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterAdmin;