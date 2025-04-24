import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Event } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schemas
const membershipFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  membershipType: z.enum(["regular", "student", "professional", "institutional"]),
  address: z.string().min(5, { message: "Please provide your address" }),
  heardAbout: z.string().optional(),
});

const donationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  donationType: z.enum(["one-time", "monthly", "quarterly", "annual"]),
  donationAmount: z.string().min(1, { message: "Please enter donation amount" }),
  paymentMethod: z.enum(["card", "mobile-money", "bank-transfer"]),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

const volunteerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please provide a valid phone number" }),
  skills: z.string().min(5, { message: "Please describe your skills" }),
  availability: z.string().min(1, { message: "Please select your availability" }),
  areasOfInterest: z.string().array().min(1, { message: "Please select at least one area of interest" }),
  motivation: z.string().min(10, { message: "Please tell us why you want to volunteer" }),
});

const discussionFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  interests: z.string().array().min(1, { message: "Please select at least one topic of interest" }),
  policyIdeas: z.string().min(10, { message: "Please share your policy ideas" }),
  preferredPlatform: z.enum(["zoom", "in-person", "social-media"]),
});

const fellowshipFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please provide a valid phone number" }),
  institution: z.string().min(2, { message: "Please provide your current institution" }),
  researchInterests: z.string().min(10, { message: "Please describe your research interests" }),
  cv: z.string().min(5, { message: "Please provide a link to your CV" }),
});

const studentChapterFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  university: z.string().min(2, { message: "Please provide your university name" }),
  studentId: z.string().min(2, { message: "Please provide your student ID" }),
  program: z.string().min(2, { message: "Please provide your program of study" }),
  graduationYear: z.string().min(4, { message: "Please provide your expected graduation year" }),
  statement: z.string().min(10, { message: "Please provide a brief statement of interest" }),
});

const careerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please provide a valid phone number" }),
  position: z.string().min(2, { message: "Please select a position" }),
  education: z.string().min(2, { message: "Please provide your highest education level" }),
  experience: z.string().min(2, { message: "Please describe your relevant experience" }),
  resumeLink: z.string().min(5, { message: "Please provide a link to your resume" }),
  coverLetter: z.string().min(10, { message: "Please provide a cover letter" }),
});

interface InvolvementFormProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvolvementForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();

  if (!event) return null;

  // Determine which form to display based on the event title
  if (event.title.includes("Membership")) {
    return <MembershipForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else if (event.title.includes("Donation")) {
    return <DonationForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else if (event.title.includes("Volunteer")) {
    return <VolunteerForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else if (event.title.includes("Discussion") || event.title.includes("Conversation")) {
    return <DiscussionForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else if (event.title.includes("Fellowship")) {
    return <FellowshipForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else if (event.title.includes("Campus") || event.title.includes("Student")) {
    return <StudentChapterForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else if (event.title.includes("Career") || event.title.includes("Job")) {
    return <CareerForm event={event} isOpen={isOpen} onClose={onClose} />;
  } else {
    // Default to the regular event registration form
    return <DefaultEventForm event={event} isOpen={isOpen} onClose={onClose} />;
  }
}

function MembershipForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof membershipFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      membershipType: "regular",
      address: "",
      heardAbout: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Membership Application Submitted",
        description: "Thank you for your interest in joining MPC. We'll review your application and contact you soon.",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Become a Member</DialogTitle>
          <DialogDescription>
            Join our community of thinkers and policy enthusiasts
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
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
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="membershipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular">Regular</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional">Professional</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="institutional" id="institutional" />
                        <Label htmlFor="institutional">Institutional</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heardAbout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did you hear about us?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How did you hear about MPC?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DonationForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof donationFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      donationType: "one-time",
      donationAmount: "",
      paymentMethod: "card",
      message: "",
      isAnonymous: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Thank You For Your Support",
        description: "Your donation information has been received. We'll contact you with next steps.",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error processing your donation information. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Support Our Work</DialogTitle>
          <DialogDescription>
            Your donation helps fund our research and educational initiatives
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time">One-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quarterly" id="quarterly" />
                        <Label htmlFor="quarterly">Quarterly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="annual" id="annual" />
                        <Label htmlFor="annual">Annual</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donationAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Amount (GHS)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="mobile-money">Mobile Money</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make my donation anonymous</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Processing..." : "Continue to Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function VolunteerForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof volunteerFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: "",
      availability: "",
      areasOfInterest: [],
      motivation: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Volunteer Application Received",
        description: "Thank you for your interest in volunteering. We'll be in touch soon!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your volunteer application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const areasOfInterest = [
    { id: "research", label: "Research Assistance" },
    { id: "events", label: "Event Organization" },
    { id: "content", label: "Content Creation" },
    { id: "social-media", label: "Social Media" },
    { id: "outreach", label: "Community Outreach" },
    { id: "admin", label: "Administrative Support" },
  ];

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Volunteer With Us</DialogTitle>
          <DialogDescription>
            Share your skills and time to support our mission
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
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
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills & Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your relevant skills and experience" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="weekdays">Weekdays only</SelectItem>
                      <SelectItem value="evenings">Evenings only</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="remote">Remote only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="areasOfInterest"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Areas of Interest</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Select all that apply
                    </div>
                  </div>
                  {areasOfInterest.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="areasOfInterest"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why do you want to volunteer with us?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your motivation for volunteering" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DiscussionForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof discussionFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(discussionFormSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
      policyIdeas: "",
      preferredPlatform: "zoom",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Successfully Registered",
        description: "You've been registered for our discussion forum. We'll send you the details soon.",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering for the discussion forum. Please try again.",
        variant: "destructive",
      });
    }
  });

  const topicInterests = [
    { id: "education", label: "Education Policy" },
    { id: "healthcare", label: "Healthcare" },
    { id: "economy", label: "Economic Development" },
    { id: "governance", label: "Governance & Democracy" },
    { id: "environment", label: "Environment & Sustainability" },
    { id: "social", label: "Social Policy" },
    { id: "tech", label: "Technology & Innovation" },
  ];

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Join the Conversation</DialogTitle>
          <DialogDescription>
            Participate in our policy discussions and share your ideas
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Topics of Interest</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Select all that interest you
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {topicInterests.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="policyIdeas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Share Your Policy Ideas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What policy ideas or questions would you like to discuss?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Discussion Platform</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="zoom" id="zoom" />
                        <Label htmlFor="zoom">Zoom Webinars</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person">In-Person Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="social-media" id="social-media" />
                        <Label htmlFor="social-media">Social Media Discussions</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Registering..." : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function FellowshipForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof fellowshipFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(fellowshipFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      institution: "",
      researchInterests: "",
      cv: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Fellowship Application Received",
        description: "Thank you for your interest in our fellowship program. We'll review your application and get back to you.",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your fellowship application. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Apply for Fellowship Program</DialogTitle>
          <DialogDescription>
            Join our six-month program for policy research and development
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
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
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Your current workplace or institution" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="researchInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Interests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your research interests and policy focus areas" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CV/Resume Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Link to your CV (Google Drive, Dropbox, etc.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function StudentChapterForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof studentChapterFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(studentChapterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      university: "",
      studentId: "",
      program: "",
      graduationYear: "",
      statement: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Student Chapter Application Received",
        description: "Thank you for your interest in our campus ambassador program. We'll be in touch soon!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Join Student Chapter</DialogTitle>
          <DialogDescription>
            Become an ambassador for policy awareness on your campus
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University/College</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of your university" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your student ID number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="Your degree program" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="graduationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Graduation Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Year of graduation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement of Interest</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why do you want to join the student chapter? What ideas do you have for promoting policy discourse on campus?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CareerForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof careerFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      education: "",
      experience: "",
      resumeLink: "",
      coverLetter: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!event) throw new Error("No event selected");
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Application Received",
        description: "Thank you for your interest in working with us. Our team will review your application and contact you.",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your job application. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Career Opportunities</DialogTitle>
          <DialogDescription>
            Apply for job openings and internships at MPC
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
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
                    <Input placeholder="Your phone number" {...field} />
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
                  <FormLabel>Position of Interest</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="research-analyst">Research Analyst</SelectItem>
                      <SelectItem value="policy-specialist">Policy Specialist</SelectItem>
                      <SelectItem value="communications-officer">Communications Officer</SelectItem>
                      <SelectItem value="program-coordinator">Program Coordinator</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Input placeholder="Highest degree earned and institution" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your relevant work experience" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume/CV Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Link to your resume (Google Drive, Dropbox, etc.)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Your cover letter" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DefaultEventForm({ event, isOpen, onClose }: InvolvementFormProps) {
  const { toast } = useToast();
  
  if (!event) return null;
  
  // Basic form schema for regular events
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().optional(),
    notes: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest('POST', `/api/events/${event.id}/register`, values);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: `You have successfully registered for ${event.title}`,
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering for the event. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
          <DialogDescription>
            {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time} | {event.location}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
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
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any dietary requirements, accessibility needs, or other notes" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Registering..." : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}