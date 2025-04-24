import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { createGalleryImage, type CreateGalleryImageData } from "@/lib/galleryService";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getPrograms } from "@/lib/programService";
import { getEvents } from "@/lib/eventService";
import { useToast } from "@/hooks/use-toast";

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image URL"),
  category: z.string().min(2, "Please select a category"),
  programId: z.number().int().optional(),
  eventId: z.number().int().optional(),
  uploadedBy: z.string().min(2, "Name must be at least 2 characters long"),
  uploadedByEmail: z.string().email("Please enter a valid email address"),
  tags: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface GalleryUploadFormProps {
  onSuccess: () => void;
  currentCategory?: string;
}

export function GalleryUploadForm({ onSuccess, currentCategory }: GalleryUploadFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: currentCategory || "program",
      uploadedBy: "",
      uploadedByEmail: "",
      tags: "",
      isPublic: true,
    },
  });

  // Fetch programs for the dropdown if category is program
  const { data: programs, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ["/api/programs"],
    queryFn: getPrograms,
    enabled: form.watch("category") === "program",
  });

  // Fetch events for the dropdown if category is event
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
    enabled: form.watch("category") === "event",
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Convert tags string to array
      const tags = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
        : [];

      // Create image data
      const imageData: CreateGalleryImageData = {
        ...values,
        tags,
      };

      // Remove the tags string from the data
      delete (imageData as any).tags;

      // Submit to API
      await createGalleryImage(imageData);
      
      // Notify parent component
      onSuccess();
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = form.watch("category");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter image title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter image description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Provide a direct link to the image. You can upload images to services like Imgur or Cloudinary.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset programId and eventId when category changes
                    form.setValue("programId", undefined);
                    form.setValue("eventId", undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="campus_tour">Campus Tour</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields based on category */}
        {selectedCategory === "program" && (
          <FormField
            control={form.control}
            name="programId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value ? String(field.value) : ""} 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={isLoadingPrograms}
                  >
                    <SelectTrigger>
                      {isLoadingPrograms ? (
                        <div className="flex items-center">
                          <Spinner className="mr-2" size="sm" />
                          Loading programs...
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a program" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {programs?.map((program) => (
                        <SelectItem key={program.id} value={String(program.id)}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCategory === "event" && (
          <FormField
            control={form.control}
            name="eventId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value ? String(field.value) : ""} 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={isLoadingEvents}
                  >
                    <SelectTrigger>
                      {isLoadingEvents ? (
                        <div className="flex items-center">
                          <Spinner className="mr-2" size="sm" />
                          Loading events...
                        </div>
                      ) : (
                        <SelectValue placeholder="Select an event" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {events?.map((event) => (
                        <SelectItem key={event.id} value={String(event.id)}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="uploadedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uploadedByEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags separated by commas" {...field} />
              </FormControl>
              <FormDescription>
                Optional: Enter tags separated by commas (e.g., "accra, education, policy")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}