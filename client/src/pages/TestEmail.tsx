import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  recipient: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const TestEmail = () => {
  const { toast } = useToast();
  const [emailStatus, setEmailStatus] = useState<null | 'success' | 'error'>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest('POST', '/api/test-email', values);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send test email');
      }
      return response.json();
    },
    onSuccess: () => {
      setEmailStatus('success');
      toast({
        title: 'Success',
        description: 'Test email sent successfully!',
      });
    },
    onError: (error: Error) => {
      setEmailStatus('error');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    setEmailStatus(null);
    mutation.mutate(values);
  };

  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <SEOHead
        title="Test Email Configuration"
        description="Send a test email to verify your AWS SES configuration"
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Test Email Configuration</CardTitle>
          <CardDescription>
            Send a test email to verify your AWS SES configuration is working correctly.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {emailStatus === 'success' && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Email Sent Successfully!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your email configuration is working correctly. Check the recipient's inbox for the test email.
              </AlertDescription>
            </Alert>
          )}
          
          {emailStatus === 'error' && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTitle className="text-red-800">Failed to Send Email</AlertTitle>
              <AlertDescription className="text-red-700">
                There was a problem sending the test email. Check your AWS SES configuration and try again.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={mutation.isPending} 
                className="w-full md:w-auto"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start border-t pt-6">
          <h3 className="text-sm font-medium mb-2">About AWS SES Configuration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This test will attempt to send an email using your AWS SES credentials. Make sure the following environment variables are set:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>AWS_ACCESS_KEY_ID</li>
            <li>AWS_SECRET_ACCESS_KEY</li>
            <li>AWS_REGION</li>
            <li>AWS_VERIFIED_EMAIL</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestEmail;