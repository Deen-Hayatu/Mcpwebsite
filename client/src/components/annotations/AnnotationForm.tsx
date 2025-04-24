import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ColorPicker } from './ColorPicker';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const annotationFormSchema = z.object({
  text: z.string().min(1, { message: "Annotation text is required" }),
  color: z.string().default("#ffeb3b"),
  isPublic: z.boolean().default(false),
});

type AnnotationFormValues = z.infer<typeof annotationFormSchema>;

interface AnnotationFormProps {
  onSubmit: (text: string, color: string, isPublic: boolean) => Promise<void>;
  onCancel: () => void;
  isReply?: boolean;
  initialText?: string;
  highlight?: string;
}

const AnnotationForm: React.FC<AnnotationFormProps> = ({
  onSubmit,
  onCancel,
  isReply = false,
  initialText = '',
  highlight,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AnnotationFormValues>({
    resolver: zodResolver(annotationFormSchema),
    defaultValues: {
      text: initialText,
      color: "#ffeb3b",
      isPublic: false,
    },
  });
  
  const handleSubmit = async (data: AnnotationFormValues) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(data.text, data.color, data.isPublic);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to save annotation",
        description: "There was an error saving your annotation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">
          {isReply ? "Reply to annotation" : "Add annotation"}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel} 
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {highlight && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Selected text:</p>
          <p className="italic">{highlight}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isReply ? "Your reply" : "Your annotation"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your thoughts here..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!isReply && (
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlight color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      colors={[
                        "#ffeb3b", // Yellow (default)
                        "#4caf50", // Green
                        "#2196f3", // Blue
                        "#f44336", // Red
                        "#9c27b0", // Purple
                        "#ff9800", // Orange
                      ]}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Make this {isReply ? "reply" : "annotation"} visible to everyone
                </FormLabel>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isReply ? "Reply" : "Save annotation"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnnotationForm;