import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage, FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, X, Trash } from 'lucide-react';
import { createStaffMember, updateStaffMember } from '@/lib/staffService';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  email: z.string().email("Invalid email format").or(z.literal('')).optional(),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember?: StaffMember | null;
}

const StaffForm: React.FC<StaffFormProps> = ({ isOpen, onClose, staffMember }) => {
  const isEditing = !!staffMember;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track arrays that aren't directly part of the form values
  const [education, setEducation] = useState<string[]>(staffMember?.education || []);
  const [expertise, setExpertise] = useState<string[]>(staffMember?.expertise || []);
  const [publications, setPublications] = useState<string[]>(staffMember?.publications || []);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
    staffMember?.socialLinks || {}
  );

  // For new array items
  const [newEducation, setNewEducation] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newPublication, setNewPublication] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staffMember?.name || '',
      position: staffMember?.position || '',
      bio: staffMember?.bio || '',
      email: staffMember?.email || '',
      phone: staffMember?.phone || '',
      photoUrl: staffMember?.photoUrl || '',
      isFeatured: staffMember?.isFeatured || false,
      sortOrder: staffMember?.sortOrder || 0
    }
  });

  // Array management functions
  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation([...education, newEducation.trim()]);
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const addPublication = () => {
    if (newPublication.trim()) {
      setPublications([...publications, newPublication.trim()]);
      setNewPublication('');
    }
  };

  const removePublication = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    if (newSocialPlatform.trim() && newSocialUrl.trim()) {
      setSocialLinks({
        ...socialLinks,
        [newSocialPlatform.trim()]: newSocialUrl.trim()
      });
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
  };

  const removeSocialLink = (platform: string) => {
    const updatedLinks = { ...socialLinks };
    delete updatedLinks[platform];
    setSocialLinks(updatedLinks);
  };

  // Form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const staffData = {
        ...values,
        education,
        expertise,
        publications,
        socialLinks
      };
      
      let result;
      
      if (isEditing && staffMember) {
        result = await updateStaffMember(staffMember.id, staffData);
        toast({
          title: "Staff member updated",
          description: `${values.name}'s profile has been updated successfully.`
        });
      } else {
        result = await createStaffMember(staffData);
        toast({
          title: "Staff member created",
          description: `${values.name} has been added to the team.`
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} staff member.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the staff member details below.' 
              : 'Fill in the details to add a new staff member to the team.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
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
                      <FormLabel>Position*</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title or position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Professional biography" 
                          className="min-h-32"
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
                          <Input placeholder="email@example.com" {...field} />
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
                          <Input placeholder="+1 234 567 8900" {...field} />
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
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL to an image of the staff member
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Additional Info Tab */}
              <TabsContent value="additional" className="space-y-6">
                {/* Education Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Education</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Input 
                      placeholder="Education qualification" 
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addEducation}
                      size="sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {education.map((edu, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded-md"
                      >
                        <span className="text-sm">{edu}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeEducation(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Expertise Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Expertise</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Input 
                      placeholder="Area of expertise" 
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addExpertise}
                      size="sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {expertise.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded-md"
                      >
                        <span className="text-sm">{item}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeExpertise(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Publications Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Publications</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Input 
                      placeholder="Publication title or reference" 
                      value={newPublication}
                      onChange={(e) => setNewPublication(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPublication())}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addPublication}
                      size="sm"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {publications.map((pub, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded-md"
                      >
                        <span className="text-sm">{pub}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removePublication(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Social Links Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Input 
                      placeholder="Platform (e.g., Twitter, LinkedIn)" 
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                    />
                    <div className="flex">
                      <Input 
                        placeholder="URL" 
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addSocialLink}
                        size="sm"
                        className="ml-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(socialLinks).map(([platform, url]) => (
                      <div 
                        key={platform} 
                        className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded-md"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium">{platform}:</span>
                          <span className="text-sm ml-2 text-muted-foreground">{url}</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSocialLink(platform)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Staff</FormLabel>
                        <FormDescription>
                          Feature this staff member on the homepage
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
                          onChange={(e) => field.onChange(
                            e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                          )}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first (0 is highest priority)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffForm;