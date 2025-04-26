import React from 'react';
import { Newsletter } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

interface NewsletterPreviewProps {
  newsletter: Newsletter;
}

const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({ newsletter }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{newsletter.title}</h3>
          <p className="text-muted-foreground">{newsletter.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{newsletter.status}</Badge>
          {newsletter.createdAt && (
            <span className="text-xs text-muted-foreground">
              Created {formatDistanceToNow(new Date(newsletter.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="html" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="html">HTML Preview</TabsTrigger>
          <TabsTrigger value="text">Plain Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html" className="mt-4">
          <Card className="overflow-hidden border rounded-md">
            <CardContent className="p-0">
              <iframe
                srcDoc={newsletter.htmlContent}
                title="Newsletter HTML Preview"
                className="w-full h-[600px] border-0"
                sandbox="allow-same-origin"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
                {newsletter.content}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium mb-2">Newsletter Details</h4>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Author</dt>
          <dd>{newsletter.authorName}</dd>
          
          {newsletter.sentAt && (
            <>
              <dt className="text-muted-foreground">Sent Date</dt>
              <dd>{new Date(newsletter.sentAt).toLocaleString()}</dd>
            </>
          )}
          
          {newsletter.scheduledFor && (
            <>
              <dt className="text-muted-foreground">Scheduled For</dt>
              <dd>{new Date(newsletter.scheduledFor).toLocaleString()}</dd>
            </>
          )}
          
          {newsletter.status === 'sent' && (
            <>
              <dt className="text-muted-foreground">Recipients</dt>
              <dd>{newsletter.recipientCount || 0}</dd>
              
              <dt className="text-muted-foreground">Opens</dt>
              <dd>{newsletter.openCount || 0}</dd>
              
              <dt className="text-muted-foreground">Clicks</dt>
              <dd>{newsletter.clickCount || 0}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default NewsletterPreview;