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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { X, Tag } from 'lucide-react';

const noteFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteFormProps {
  onSubmit: (title: string, content: string, isPublic: boolean, tags: string[]) => Promise<void>;
  onCancel: () => void;
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  isEditing = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: initialTitle,
      content: initialContent,
      isPublic: false,
      tags: initialTags,
    },
  });
  
  const handleSubmit = async (data: NoteFormValues) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(data.title, data.content, data.isPublic, data.tags || []);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to save note",
        description: "There was an error saving your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      const currentTags = form.getValues('tags') || [];
      
      // Check if tag already exists
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">
          {isEditing ? "Edit note" : "Add note"}
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter title"
                  />
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
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your note here..."
                    className="min-h-[150px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch('tags')?.map((tag) => (
                    <div 
                      key={tag} 
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary/70 hover:text-primary"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag and press Enter"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    className="ml-2 flex gap-1 items-center"
                  >
                    <Tag className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </FormItem>
            )}
          />
          
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
                  Make this note visible to everyone
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
              {isSubmitting ? "Saving..." : isEditing ? "Update note" : "Save note"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NoteForm;