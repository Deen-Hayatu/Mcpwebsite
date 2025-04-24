import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertStaffMemberSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { XCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { StaffMember } from "@shared/schema";
import { createStaffMember, updateStaffMember } from "@/lib/staffService";

// Extend the schema with client-side validations
const staffFormSchema = insertStaffMemberSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  photoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  educationInput: z.string().optional(),
  expertiseInput: z.string().optional(),
  publicationInput: z.string().optional(),
  education: z.array(z.string()).default([]),
  expertise: z.array(z.string()).default([]),
  publications: z.array(z.string()).default([]),
  socialLinks: z.record(z.string().url("Please enter a valid URL")).default({}),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Please enter a valid Twitter URL").optional().or(z.literal("")),
  facebookUrl: z.string().url("Please enter a valid Facebook URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Please enter a valid Instagram URL").optional().or(z.literal("")),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

type StaffFormProps = {
  staff?: StaffMember;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function StaffForm({ staff, onSuccess, onCancel }: StaffFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Prepare default values
  const defaultValues: Partial<StaffFormValues> = {
    name: staff?.name || "",
    position: staff?.position || "",
    bio: staff?.bio || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    photoUrl: staff?.photoUrl || "",
    education: staff?.education || [],
    expertise: staff?.expertise || [],
    publications: staff?.publications || [],
    isFeatured: staff?.isFeatured || false,
    sortOrder: staff?.sortOrder || 0,
    educationInput: "",
    expertiseInput: "",
    publicationInput: "",
    linkedinUrl: staff?.socialLinks ? (staff.socialLinks as Record<string, string>)["linkedin"] || "" : "",
    twitterUrl: staff?.socialLinks ? (staff.socialLinks as Record<string, string>)["twitter"] || "" : "",
    facebookUrl: staff?.socialLinks ? (staff.socialLinks as Record<string, string>)["facebook"] || "" : "",
    instagramUrl: staff?.socialLinks ? (staff.socialLinks as Record<string, string>)["instagram"] || "" : "",
  };

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues,
  });
  
  // Get form values for arrays
  const watchEducation = form.watch("education") || [];
  const watchExpertise = form.watch("expertise") || [];
  const watchPublications = form.watch("publications") || [];
  
  // Add item to array
  const addItem = (field: "education" | "expertise" | "publications", inputField: "educationInput" | "expertiseInput" | "publicationInput") => {
    const inputValue = form.getValues(inputField);
    if (inputValue.trim()) {
      const currentItems = form.getValues(field) || [];
      form.setValue(field, [...currentItems, inputValue.trim()]);
      form.setValue(inputField, "");
    }
  };
  
  // Remove item from array
  const removeItem = (field: "education" | "expertise" | "publications", index: number) => {
    const currentItems = form.getValues(field) || [];
    form.setValue(field, currentItems.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const onSubmit = async (data: StaffFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare social links
      const socialLinks: Record<string, string> = {};
      if (data.linkedinUrl) socialLinks.linkedin = data.linkedinUrl;
      if (data.twitterUrl) socialLinks.twitter = data.twitterUrl;
      if (data.facebookUrl) socialLinks.facebook = data.facebookUrl;
      if (data.instagramUrl) socialLinks.instagram = data.instagramUrl;
      
      // Prepare staff data
      const staffData = {
        name: data.name,
        position: data.position,
        bio: data.bio,
        email: data.email || undefined,
        phone: data.phone || undefined,
        photoUrl: data.photoUrl || undefined,
        education: data.education,
        expertise: data.expertise,
        publications: data.publications,
        socialLinks,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
      };
      
      if (staff) {
        // Update existing staff member
        await updateStaffMember(staff.id, staffData);
        toast({
          title: "Staff member updated",
          description: `${data.name}'s profile has been updated successfully.`,
          duration: 3000,
        });
      } else {
        // Create new staff member
        await createStaffMember(staffData);
        toast({
          title: "Staff member created",
          description: `${data.name} has been added to the team.`,
          duration: 3000,
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving staff member:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save staff member.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Job title or role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Professional biography" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to profile photo (optional)" {...field} />
              </FormControl>
              <FormDescription>
                Enter a direct URL to the staff member's profile photo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Education</h3>
          <div className="flex gap-2 mb-2">
            <FormField
              control={form.control}
              name="educationInput"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Add education (e.g., PhD in Economics, Harvard University)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => addItem("education", "educationInput")}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {watchEducation.length > 0 && (
            <ul className="space-y-2 mt-2 max-h-[150px] overflow-y-auto bg-secondary/10 p-2 rounded-md">
              {watchEducation.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm p-1 rounded hover:bg-secondary/20">
                  <span>{item}</span>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeItem("education", index)}
                  >
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Areas of Expertise</h3>
          <div className="flex gap-2 mb-2">
            <FormField
              control={form.control}
              name="expertiseInput"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Add area of expertise (e.g., Climate Policy)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => addItem("expertise", "expertiseInput")}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {watchExpertise.length > 0 && (
            <ul className="space-y-2 mt-2 max-h-[150px] overflow-y-auto bg-secondary/10 p-2 rounded-md">
              {watchExpertise.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm p-1 rounded hover:bg-secondary/20">
                  <span>{item}</span>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeItem("expertise", index)}
                  >
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Publications</h3>
          <div className="flex gap-2 mb-2">
            <FormField
              control={form.control}
              name="publicationInput"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Add publication title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => addItem("publications", "publicationInput")}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {watchPublications.length > 0 && (
            <ul className="space-y-2 mt-2 max-h-[150px] overflow-y-auto bg-secondary/10 p-2 rounded-md">
              {watchPublications.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm p-1 rounded hover:bg-secondary/20">
                  <span>{item}</span>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeItem("publications", index)}
                  >
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Social Media (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                <div className="space-y-0.5">
                  <FormLabel>Featured Team Member</FormLabel>
                  <FormDescription>
                    Featured members appear on the homepage
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (staff ? 'Update Staff Member' : 'Add Staff Member')}
          </Button>
        </div>
      </form>
    </Form>
  );
}