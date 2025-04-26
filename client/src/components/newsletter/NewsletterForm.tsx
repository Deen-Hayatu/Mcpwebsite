import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { Newsletter } from '@/lib/types';

const newsletterSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  htmlContent: z.string().min(10, { message: "HTML content must be at least 10 characters." }),
  authorName: z.string().min(2, { message: "Author name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  newsletter,
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      title: newsletter?.title || '',
      subject: newsletter?.subject || '',
      content: newsletter?.content || '',
      htmlContent: newsletter?.htmlContent || '',
      authorName: newsletter?.authorName || '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  // Generate HTML from plain text for simple newsletters
  const generateHtml = () => {
    const content = form.getValues('content');
    if (!content) return;
    
    const htmlContent = content
      .split('\n\n')
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join('');
    
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${form.getValues('subject')}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #044e7c;
            margin-bottom: 20px;
          }
          p {
            margin-bottom: 16px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>${form.getValues('title')}</h1>
        ${htmlContent}
        <div class="footer">
          <p>This email was sent by the Movement for Positive Change.</p>
          <p>To unsubscribe, <a href="https://mpcghana.org/newsletter?tab=unsubscribe">click here</a>.</p>
        </div>
      </body>
      </html>
    `;
    
    form.setValue('htmlContent', fullHtml);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter newsletter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter email subject line" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Plain Text)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter newsletter content in plain text" 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateHtml}
                className="mt-2"
              >
                Generate HTML Version
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="htmlContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HTML Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter or generate HTML version of the newsletter" 
                  className="min-h-[200px] font-mono text-xs"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Newsletter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsletterForm;