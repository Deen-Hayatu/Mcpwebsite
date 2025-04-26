import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  Input,
  Button,
  useToast
} from '@/components/ui';
import { Loader2, Ban } from 'lucide-react';

const unsubscribeSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address.' })
    .min(1, { message: 'Email is required.' }),
});

type UnsubscribeFormValues = z.infer<typeof unsubscribeSchema>;

const UnsubscribeForm: React.FC = () => {
  const { toast } = useToast();

  const form = useForm<UnsubscribeFormValues>({
    resolver: zodResolver(unsubscribeSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UnsubscribeFormValues) => {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unsubscribe');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Unsubscribed successfully',
        description: 'You have been unsubscribed from our newsletter.',
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Unsubscribe failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: UnsubscribeFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          variant="destructive"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Unsubscribing...
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Unsubscribe from Newsletter
            </>
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground text-center mt-4">
          We're sorry to see you go. You can resubscribe at any time.
        </p>
      </form>
    </Form>
  );
};

export default UnsubscribeForm;