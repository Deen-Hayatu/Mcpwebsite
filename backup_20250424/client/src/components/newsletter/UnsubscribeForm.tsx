import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const unsubscribeFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type UnsubscribeFormValues = z.infer<typeof unsubscribeFormSchema>;

const UnsubscribeForm = () => {
  const { toast } = useToast();
  
  const form = useForm<UnsubscribeFormValues>({
    resolver: zodResolver(unsubscribeFormSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const unsubscribeMutation = useMutation({
    mutationFn: async (values: UnsubscribeFormValues) => {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unsubscribe");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully unsubscribed from our newsletter.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unsubscribe. Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: UnsubscribeFormValues) => {
    unsubscribeMutation.mutate(values);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Unsubscribe from Our Newsletter
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We're sorry to see you go. Please enter your email address to unsubscribe.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              variant="outline"
              className="w-full"
              disabled={unsubscribeMutation.isPending}
            >
              {unsubscribeMutation.isPending ? "Processing..." : "Unsubscribe"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UnsubscribeForm;