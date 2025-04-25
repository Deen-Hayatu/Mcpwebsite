import type { Express, Request, Response } from "express";
// Add global declarations for Express auth
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      user?: { 
        id: number;
        username: string;
        email: string;
        isAdmin?: boolean;
        [key: string]: any;
      }
    }
  }
}
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { z } from "zod";
import { getChatCompletion } from "./perplexity";
import { createInsertSchema } from "drizzle-zod";
import { 
  policyBriefs,
  subscribers, 
  contactMessages, 
  researchMetrics, 
  eventRegistrations,
  newsletters
} from "@shared/schema";

// Initialize Stripe if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });
}
import { 
  insertPolicyBriefSchema,
  insertSubscriberSchema, 
  insertContactMessageSchema,
  insertStaffMemberSchema, 
  insertResearchMetricSchema, 
  insertEventRegistrationSchema,
  insertMembershipApplicationSchema,
  insertDonationSchema,
  insertVolunteerApplicationSchema,
  insertDiscussionForumRegistrationSchema,
  insertFellowshipApplicationSchema,
  insertStudentChapterApplicationSchema,
  insertCareerApplicationSchema,
  insertAnnotationSchema,
  insertNoteSchema,
  insertAnnotationSharingSchema,
  insertNoteSharingSchema,
  insertGalleryImageSchema,
  insertNewsletterSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Policy Briefs API
  app.get("/api/policy-briefs", async (req, res) => {
    try {
      const policyBriefs = await storage.getPolicyBriefs();
      res.json(policyBriefs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policy briefs" });
    }
  });

  app.get("/api/policy-briefs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const policyBrief = await storage.getPolicyBrief(id);
      
      if (!policyBrief) {
        return res.status(404).json({ message: "Policy brief not found" });
      }
      
      res.json(policyBrief);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policy brief" });
    }
  });

  // Create new policy brief (admin only)
  app.post("/api/policy-briefs", async (req: Request, res: Response) => {
    try {
      // Skip authentication for development purposes
      // In production, we would check if user is authenticated and is an admin
      // if (!req.isAuthenticated() || !req.user?.isAdmin) {
      //   return res.status(401).json({ message: "Unauthorized: Admin access required" });
      // }
      console.log("Creating policy brief:", req.body);
      
      // Validate the request body using zod schema
      const policyBriefData = insertPolicyBriefSchema.parse(req.body);
      
      // Create the policy brief
      const newPolicyBrief = await storage.createPolicyBrief(policyBriefData);
      
      res.status(201).json({ 
        success: true, 
        message: "Policy brief created successfully",
        policyBrief: newPolicyBrief
      });
    } catch (error) {
      console.error("Policy brief creation error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ 
          success: false,
          message: "Invalid policy brief data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to create policy brief" 
      });
    }
  });
  
  // Update policy brief (admin only)
  app.patch("/api/policy-briefs/:id", async (req: Request, res: Response) => {
    try {
      // Skip authentication for development purposes
      // In production, we would check if user is authenticated and is an admin
      // if (!req.isAuthenticated() || !req.user?.isAdmin) {
      //   return res.status(401).json({ message: "Unauthorized: Admin access required" });
      // }
      
      const id = parseInt(req.params.id);
      console.log(`Updating policy brief ${id}:`, req.body);
      
      // Validate the request body (partial schema)
      const updateSchema = insertPolicyBriefSchema.partial();
      const updateData = updateSchema.parse(req.body);
      
      // Update the policy brief
      const updatedPolicyBrief = await storage.updatePolicyBrief(id, updateData);
      
      if (!updatedPolicyBrief) {
        return res.status(404).json({ 
          success: false, 
          message: "Policy brief not found" 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Policy brief updated successfully",
        policyBrief: updatedPolicyBrief
      });
    } catch (error) {
      console.error("Policy brief update error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ 
          success: false,
          message: "Invalid policy brief data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to update policy brief" 
      });
    }
  });

  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Programs API
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  
  // Newsletter Subscription API
  const subscriberValidator = insertSubscriberSchema.extend({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().optional(),
  });

  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const subscriberData = subscriberValidator.parse(req.body);
      
      // Create the subscriber in the database
      const subscriber = await storage.createSubscriber(subscriberData);
      
      res.status(201).json({ 
        success: true, 
        message: "Successfully subscribed to the newsletter",
        subscriber
      });
    } catch (error) {
      console.error("Subscription error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ 
          success: false,
          message: "Invalid subscription data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to subscribe to the newsletter" 
      });
    }
  });
  
  app.post("/api/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ 
          success: false,
          message: "Email is required" 
        });
      }
      
      const success = await storage.unsubscribe(email);
      
      if (success) {
        return res.json({ 
          success: true,
          message: "Successfully unsubscribed from the newsletter" 
        });
      } else {
        return res.status(404).json({ 
          success: false,
          message: "Email not found or already unsubscribed" 
        });
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to unsubscribe from the newsletter" 
      });
    }
  });
  
  // Newsletter Management API (admin only)
  const newsletterValidator = insertNewsletterSchema.extend({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    subject: z.string().min(3, "Subject must be at least 3 characters long"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    htmlContent: z.string().min(10, "HTML content must be at least 10 characters long"),
    authorName: z.string().min(2, "Author name must be at least 2 characters long"),
  });
  
  // Get all newsletters
  app.get("/api/newsletters", async (req: Request, res: Response) => {
    try {
      // In production, check auth: if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(401)...
      const allNewsletters = await storage.getNewsletters();
      res.json(allNewsletters);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch newsletters" 
      });
    }
  });
  
  // Get a single newsletter
  app.get("/api/newsletters/:id", async (req: Request, res: Response) => {
    try {
      // In production, check auth: if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(401)...
      const id = parseInt(req.params.id);
      const newsletter = await storage.getNewsletter(id);
      
      if (!newsletter) {
        return res.status(404).json({ 
          success: false, 
          message: "Newsletter not found" 
        });
      }
      
      res.json(newsletter);
    } catch (error) {
      console.error("Error fetching newsletter:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch newsletter" 
      });
    }
  });
  
  // Create newsletter
  app.post("/api/newsletters", async (req: Request, res: Response) => {
    try {
      // In production, check auth: if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(401)...
      
      // If authenticated, automatically set the author info
      const userData = req.user || { id: 1, username: "Admin" }; // Fallback for development
      
      const newsletterData = newsletterValidator.parse({
        ...req.body,
        authorId: userData.id,
        authorName: req.body.authorName || userData.username,
      });
      
      const newsletter = await storage.createNewsletter(newsletterData);
      
      res.status(201).json({
        success: true,
        message: "Newsletter created successfully",
        newsletter
      });
    } catch (error) {
      console.error("Newsletter creation error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid newsletter data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to create newsletter" 
      });
    }
  });
  
  // Update newsletter
  app.patch("/api/newsletters/:id", async (req: Request, res: Response) => {
    try {
      // In production, check auth: if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(401)...
      const id = parseInt(req.params.id);
      
      // Validate with partial schema (only sent fields will be validated)
      const updateSchema = newsletterValidator.partial();
      const updateData = updateSchema.parse(req.body);
      
      const updatedNewsletter = await storage.updateNewsletter(id, updateData);
      
      if (!updatedNewsletter) {
        return res.status(404).json({ 
          success: false, 
          message: "Newsletter not found" 
        });
      }
      
      res.json({
        success: true,
        message: "Newsletter updated successfully",
        newsletter: updatedNewsletter
      });
    } catch (error) {
      console.error("Newsletter update error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid newsletter data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to update newsletter" 
      });
    }
  });
  
  // Send newsletter
  app.post("/api/newsletters/:id/send", async (req: Request, res: Response) => {
    try {
      // In production, check auth: if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(401)...
      
      const id = parseInt(req.params.id);
      const newsletter = await storage.getNewsletter(id);
      
      if (!newsletter) {
        return res.status(404).json({ 
          success: false, 
          message: "Newsletter not found" 
        });
      }
      
      // Fetch active subscribers
      const activeSubscribers = await storage.getActiveSubscribers();
      
      if (activeSubscribers.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "No active subscribers to send newsletter to" 
        });
      }
      
      const emailAddresses = activeSubscribers.map(subscriber => subscriber.email);
      
      // Import from services
      const { sendNewsletterBatch } = await import('./services/email');
      
      // Send the newsletter
      const sent = await sendNewsletterBatch(
        emailAddresses,
        newsletter.subject,
        newsletter.htmlContent,
        newsletter.content // Plain text version
      );
      
      if (!sent) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send newsletter. Check email service configuration." 
        });
      }
      
      // Update newsletter status to 'sent'
      const updatedNewsletter = await storage.updateNewsletter(id, { 
        status: 'sent',
        sentAt: new Date(),
        recipientCount: emailAddresses.length
      });
      
      res.json({
        success: true,
        message: `Newsletter sent to ${emailAddresses.length} subscribers`,
        newsletter: updatedNewsletter
      });
    } catch (error) {
      console.error("Newsletter sending error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to send newsletter" 
      });
    }
  });
  
  // Get all subscribers (admin only)
  app.get("/api/subscribers", async (req: Request, res: Response) => {
    try {
      // In production, check auth: if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(401)...
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch subscribers" 
      });
    }
  });

  // Contact Form API
  const contactMessageValidator = insertContactMessageSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters long"),
    message: z.string().min(10, "Message must be at least 10 characters long")
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      console.log("Contact form submission received:", req.body);
      
      // Validate the request body
      const contactData = contactMessageValidator.parse(req.body);
      console.log("Contact data validated successfully:", contactData);
      
      // Create the contact message in the database
      const contactMessage = await storage.createContactMessage(contactData);
      console.log("Contact message stored in database:", contactMessage);
      
      res.status(201).json({ 
        success: true, 
        message: "Your message has been successfully sent. Thank you for contacting us.",
        contactMessage
      });
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ 
          success: false,
          message: "Invalid contact form data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to send your message. Please try again later." 
      });
    }
  });

  // Get contact messages (admin only, would need authentication in production)
  app.get("/api/contact-messages", async (req: Request, res: Response) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch contact messages" 
      });
    }
  });
  
  // Research Metrics API
  const researchMetricValidator = insertResearchMetricSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    category: z.string().min(2, "Category must be at least 2 characters long"),
    value: z.number().int().positive("Value must be a positive integer"),
    description: z.string().optional()
  });
  
  app.get("/api/research-metrics", async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getResearchMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching research metrics:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch research metrics" 
      });
    }
  });
  
  app.get("/api/research-metrics/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const metrics = await storage.getResearchMetricsByCategory(category);
      res.json(metrics);
    } catch (error) {
      console.error(`Error fetching research metrics for category ${req.params.category}:`, error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch research metrics for the specified category" 
      });
    }
  });
  
  app.post("/api/research-metrics", async (req: Request, res: Response) => {
    try {
      const metricData = researchMetricValidator.parse(req.body);
      const newMetric = await storage.createResearchMetric(metricData);
      res.status(201).json({ 
        success: true,
        message: "Research metric created successfully",
        metric: newMetric
      });
    } catch (error) {
      console.error("Error creating research metric:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid research metric data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to create research metric" 
      });
    }
  });
  
  // Event Registration API
  const eventRegistrationValidator = insertEventRegistrationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    notes: z.string().optional(),
  });
  
  // Get all registrations for a specific event
  app.get("/api/events/:eventId/registrations", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // First check if the event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found"
        });
      }
      
      const registrations = await storage.getEventRegistrationsByEvent(eventId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch event registrations" 
      });
    }
  });
  
  // Register for an event
  app.post("/api/events/:eventId/register", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // First check if the event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found"
        });
      }
      
      // Combine the event ID from the URL with the registration data
      const registrationData = eventRegistrationValidator.parse({
        ...req.body,
        eventId
      });
      
      const registration = await storage.registerForEvent(registrationData);
      
      res.status(201).json({ 
        success: true,
        message: "Successfully registered for the event",
        registration
      });
    } catch (error) {
      console.error("Event registration error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid registration data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to register for the event" 
      });
    }
  });
  
  // Update registration status (for admin use)
  app.patch("/api/event-registrations/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateRegistrationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Registration status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Registration not found"
        });
      }
    } catch (error) {
      console.error("Error updating registration status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update registration status"
      });
    }
  });

  // Membership Application API
  const membershipApplicationValidator = insertMembershipApplicationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    membershipType: z.string().min(1, "Membership type is required"),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    heardAbout: z.string().optional(),
  });

  app.post("/api/membership-applications", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const applicationData = membershipApplicationValidator.parse(req.body);
      
      // Create the application in the database
      const application = await storage.createMembershipApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your membership application has been successfully submitted.",
        application
      });
    } catch (error) {
      console.error("Membership application error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid application data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to submit membership application. Please try again later." 
      });
    }
  });

  app.get("/api/membership-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getMembershipApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching membership applications:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch membership applications" 
      });
    }
  });

  app.patch("/api/membership-applications/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateMembershipApplicationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Membership application status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Membership application not found"
        });
      }
    } catch (error) {
      console.error("Error updating membership application status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update membership application status"
      });
    }
  });

  // Donation API
  const donationValidator = insertDonationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    donationType: z.string().min(1, "Donation type is required"),
    donationAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Donation amount must be a positive number",
    }),
    paymentMethod: z.string().min(1, "Payment method is required"),
    message: z.string().optional(),
    isAnonymous: z.boolean().optional(),
  });

  app.post("/api/donations", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const donationData = donationValidator.parse(req.body);
      
      // Create the donation in the database
      const donation = await storage.createDonation(donationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your donation has been successfully recorded.",
        donation
      });
    } catch (error) {
      console.error("Donation error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid donation data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to process donation. Please try again later." 
      });
    }
  });

  app.get("/api/donations", async (req: Request, res: Response) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch donations" 
      });
    }
  });

  app.patch("/api/donations/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateDonationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Donation status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Donation not found"
        });
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update donation status"
      });
    }
  });

  // Volunteer Application API
  const volunteerApplicationValidator = insertVolunteerApplicationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(5, "Phone number is required"),
    skills: z.string().min(5, "Skills information is required"),
    availability: z.string().min(2, "Availability information is required"),
    areasOfInterest: z.array(z.string()).min(1, "At least one area of interest is required"),
    motivation: z.string().min(10, "Motivation statement is required"),
  });

  app.post("/api/volunteer-applications", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const applicationData = volunteerApplicationValidator.parse(req.body);
      
      // Create the application in the database
      const application = await storage.createVolunteerApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your volunteer application has been successfully submitted.",
        application
      });
    } catch (error) {
      console.error("Volunteer application error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid application data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to submit volunteer application. Please try again later." 
      });
    }
  });

  app.get("/api/volunteer-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getVolunteerApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching volunteer applications:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch volunteer applications" 
      });
    }
  });

  app.patch("/api/volunteer-applications/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateVolunteerApplicationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Volunteer application status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Volunteer application not found"
        });
      }
    } catch (error) {
      console.error("Error updating volunteer application status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update volunteer application status"
      });
    }
  });

  // Discussion Forum Registration API
  const discussionForumRegistrationValidator = insertDiscussionForumRegistrationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    interests: z.array(z.string()).min(1, "At least one interest is required"),
    policyIdeas: z.string().min(10, "Policy ideas description is required"),
    preferredPlatform: z.string().min(2, "Preferred platform is required"),
  });

  app.post("/api/discussion-forum-registrations", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const registrationData = discussionForumRegistrationValidator.parse(req.body);
      
      // Create the registration in the database
      const registration = await storage.createDiscussionForumRegistration(registrationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your discussion forum registration has been successfully submitted.",
        registration
      });
    } catch (error) {
      console.error("Discussion forum registration error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid registration data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to register for discussion forum. Please try again later." 
      });
    }
  });

  app.get("/api/discussion-forum-registrations", async (req: Request, res: Response) => {
    try {
      const registrations = await storage.getDiscussionForumRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching discussion forum registrations:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch discussion forum registrations" 
      });
    }
  });

  app.patch("/api/discussion-forum-registrations/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateDiscussionForumRegistrationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Discussion forum registration status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Discussion forum registration not found"
        });
      }
    } catch (error) {
      console.error("Error updating discussion forum registration status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update discussion forum registration status"
      });
    }
  });

  // Fellowship Application API
  const fellowshipApplicationValidator = insertFellowshipApplicationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(5, "Phone number is required"),
    institution: z.string().min(2, "Institution name is required"),
    researchInterests: z.string().min(10, "Research interests description is required"),
    cv: z.string().min(5, "CV link or content is required"),
  });

  app.post("/api/fellowship-applications", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const applicationData = fellowshipApplicationValidator.parse(req.body);
      
      // Create the application in the database
      const application = await storage.createFellowshipApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your fellowship application has been successfully submitted.",
        application
      });
    } catch (error) {
      console.error("Fellowship application error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid application data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to submit fellowship application. Please try again later." 
      });
    }
  });

  app.get("/api/fellowship-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getFellowshipApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching fellowship applications:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch fellowship applications" 
      });
    }
  });

  app.patch("/api/fellowship-applications/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateFellowshipApplicationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Fellowship application status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Fellowship application not found"
        });
      }
    } catch (error) {
      console.error("Error updating fellowship application status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update fellowship application status"
      });
    }
  });

  // Student Chapter Application API
  const studentChapterApplicationValidator = insertStudentChapterApplicationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    university: z.string().min(2, "University name is required"),
    studentId: z.string().min(2, "Student ID is required"),
    program: z.string().min(2, "Program of study is required"),
    graduationYear: z.string().min(4, "Graduation year is required"),
    statement: z.string().min(10, "Statement of interest is required"),
  });

  app.post("/api/student-chapter-applications", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const applicationData = studentChapterApplicationValidator.parse(req.body);
      
      // Create the application in the database
      const application = await storage.createStudentChapterApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your student chapter application has been successfully submitted.",
        application
      });
    } catch (error) {
      console.error("Student chapter application error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid application data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to submit student chapter application. Please try again later." 
      });
    }
  });

  app.get("/api/student-chapter-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getStudentChapterApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching student chapter applications:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch student chapter applications" 
      });
    }
  });

  app.patch("/api/student-chapter-applications/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateStudentChapterApplicationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Student chapter application status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Student chapter application not found"
        });
      }
    } catch (error) {
      console.error("Error updating student chapter application status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update student chapter application status"
      });
    }
  });

  // Career Application API
  const careerApplicationValidator = insertCareerApplicationSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(5, "Phone number is required"),
    position: z.string().min(2, "Position applied for is required"),
    education: z.string().min(5, "Education information is required"),
    experience: z.string().min(5, "Experience information is required"),
    resumeLink: z.string().min(5, "Resume link is required"),
    coverLetter: z.string().min(10, "Cover letter is required"),
  });

  app.post("/api/career-applications", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const applicationData = careerApplicationValidator.parse(req.body);
      
      // Create the application in the database
      const application = await storage.createCareerApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your career application has been successfully submitted.",
        application
      });
    } catch (error) {
      console.error("Career application error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid application data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to submit career application. Please try again later." 
      });
    }
  });

  app.get("/api/career-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getCareerApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching career applications:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch career applications" 
      });
    }
  });

  app.patch("/api/career-applications/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }
      
      const success = await storage.updateCareerApplicationStatus(id, status);
      
      if (success) {
        return res.json({
          success: true,
          message: "Career application status updated successfully"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Career application not found"
        });
      }
    } catch (error) {
      console.error("Error updating career application status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update career application status"
      });
    }
  });

  // Payment gateway routes
  // Stripe payment intent creation
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount, email, name } = req.body;
      
      if (!stripe) {
        return res.status(500).json({
          success: false,
          message: "Stripe is not configured properly."
        });
      }
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "A valid positive amount is required."
        });
      }
      
      // Convert amount to cents for Stripe
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        description: `Donation from ${name || 'Anonymous'} (${email || 'No email'})`,
        receipt_email: email,
        metadata: {
          name: name || 'Anonymous',
          email: email || 'No email'
        }
      });
      
      // Record the donation in our database
      await storage.createDonation({
        name: name || 'Anonymous',
        email: email || 'anonymous@example.com',
        donationType: 'one-time',
        donationAmount: amount.toString(),
        paymentMethod: 'stripe',
        status: 'pending',
        transactionId: paymentIntent.id,
        message: '',
        isAnonymous: !name || !email
      });
      
      // Return the client secret to the frontend
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Error creating Stripe payment intent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment intent",
      });
    }
  });
  
  // PayPal API routes
  app.post("/api/paypal/create-order", async (req: Request, res: Response) => {
    try {
      const { amount, email, name } = req.body;
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Valid amount is required" 
        });
      }
      
      // In a production environment, you would use the PayPal SDK to create an order
      // For this demo, we'll simulate the order creation
      const orderId = `PAYPAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Record the donation in the database
      await storage.createDonation({
        name: name || 'Anonymous',
        email: email || 'anonymous@example.com',
        donationType: 'one-time',
        donationAmount: amount.toString(),
        paymentMethod: 'paypal',
        status: 'pending',
        transactionId: orderId,
        message: '',
        isAnonymous: !name || !email
      });
      
      res.json({ 
        success: true,
        id: orderId
      });
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create PayPal order"
      });
    }
  });
  
  app.post("/api/paypal/capture-order", async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID is required"
        });
      }
      
      // In a production environment, you would use the PayPal SDK to capture the payment
      // For this demo, we'll simulate the capture process
      
      // Update the donation status in the database
      // Note: This would typically be done in a webhook handler in production
      
      res.json({
        success: true,
        id: orderId,
        status: "COMPLETED"
      });
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to capture PayPal payment"
      });
    }
  });
  
  // Paystack API routes
  app.post("/api/paystack/initialize", async (req: Request, res: Response) => {
    try {
      const { amount, email, name, reference, paymentMethod } = req.body;
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid amount is required"
        });
      }
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }
      
      if (!reference) {
        return res.status(400).json({
          success: false,
          message: "Reference is required"
        });
      }
      
      // In a production environment, you would use the Paystack API to initialize a transaction
      // For this demo, we'll simulate the initialization
      
      // Record the donation in the database
      await storage.createDonation({
        name: name || 'Anonymous',
        email: email,
        donationType: 'one-time',
        donationAmount: (amount / 100 / 13).toString(), // Convert from kobo to USD (approximate)
        paymentMethod: paymentMethod === 'mobile-money' ? 'paystack-mobile' : 'paystack-card',
        status: 'pending',
        transactionId: reference,
        message: '',
        isAnonymous: !name
      });
      
      res.json({
        success: true,
        reference,
        status: "success"
      });
    } catch (error) {
      console.error("Error initializing Paystack payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to initialize Paystack payment"
      });
    }
  });
  
  app.get("/api/paystack/verify/:reference", async (req: Request, res: Response) => {
    try {
      const { reference } = req.params;
      
      if (!reference) {
        return res.status(400).json({
          success: false,
          message: "Reference is required"
        });
      }
      
      // In a production environment, you would use the Paystack API to verify the transaction
      // For this demo, we'll simulate the verification process
      
      // Update the donation status in the database
      // Note: This would typically be done in a webhook handler in production
      
      res.json({
        success: true,
        status: "success",
        message: "Payment verified successfully"
      });
    } catch (error) {
      console.error("Error verifying Paystack payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify Paystack payment"
      });
    }
  });
  
  // Paystack webhook endpoint (for payment verification)
  app.post("/api/paystack-webhook", async (req: Request, res: Response) => {
    // This would be implemented with Paystack's webhook signature verification
    // For now, we'll just acknowledge the request
    res.status(200).send('Webhook received');
  });
  
  // PayPal webhook endpoint (for payment verification)
  app.post("/api/paypal-webhook", async (req: Request, res: Response) => {
    // This would be implemented with PayPal's webhook signature verification
    // For now, we'll just acknowledge the request
    res.status(200).send('Webhook received');
  });

  // ===== Annotation and Note API Routes =====

  // Annotation validators
  const annotationValidator = insertAnnotationSchema.extend({
    documentType: z.string().min(1, "Document type is required"),
    documentId: z.number().int().positive("Document ID must be a positive integer"),
    userName: z.string().min(1, "User name is required"),
    userEmail: z.string().email("Valid email is required"),
    text: z.string().min(1, "Annotation text is required"),
    position: z.any().refine(val => !!val, "Position data is required"),
    highlight: z.string().min(1, "Highlighted text is required"),
    color: z.string().optional(),
    isPublic: z.boolean().optional(),
    replyToId: z.number().int().positive().optional(),
  });

  // Get annotations for a document
  app.get("/api/annotations", async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;

      if (!documentType || !documentId) {
        return res.status(400).json({
          success: false,
          message: "Document type and document ID are required"
        });
      }

      const annotations = await storage.getAnnotations(
        documentType as string, 
        parseInt(documentId as string)
      );
      
      res.json(annotations);
    } catch (error) {
      console.error("Error fetching annotations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch annotations"
      });
    }
  });

  // Get a specific annotation
  app.get("/api/annotations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const annotation = await storage.getAnnotation(id);

      if (!annotation) {
        return res.status(404).json({
          success: false,
          message: "Annotation not found"
        });
      }

      res.json(annotation);
    } catch (error) {
      console.error(`Error fetching annotation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch annotation"
      });
    }
  });

  // Create a new annotation
  app.post("/api/annotations", async (req: Request, res: Response) => {
    try {
      const annotationData = annotationValidator.parse(req.body);
      const annotation = await storage.createAnnotation(annotationData);

      res.status(201).json({
        success: true,
        message: "Annotation created successfully",
        annotation
      });
    } catch (error) {
      console.error("Error creating annotation:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid annotation data",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create annotation"
      });
    }
  });

  // Update an annotation
  app.patch("/api/annotations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { text } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({
          success: false,
          message: "Annotation text is required"
        });
      }

      const updatedAnnotation = await storage.updateAnnotation(id, text);

      if (!updatedAnnotation) {
        return res.status(404).json({
          success: false,
          message: "Annotation not found"
        });
      }

      res.json({
        success: true,
        message: "Annotation updated successfully",
        annotation: updatedAnnotation
      });
    } catch (error) {
      console.error(`Error updating annotation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to update annotation"
      });
    }
  });

  // Delete an annotation
  app.delete("/api/annotations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnotation(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Annotation not found"
        });
      }

      res.json({
        success: true,
        message: "Annotation deleted successfully"
      });
    } catch (error) {
      console.error(`Error deleting annotation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to delete annotation"
      });
    }
  });

  // Get replies to an annotation
  app.get("/api/annotations/:id/replies", async (req: Request, res: Response) => {
    try {
      const annotationId = parseInt(req.params.id);
      const replies = await storage.getAnnotationReplies(annotationId);

      res.json(replies);
    } catch (error) {
      console.error(`Error fetching replies for annotation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch annotation replies"
      });
    }
  });

  // Toggle annotation visibility
  app.patch("/api/annotations/:id/toggle-visibility", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedAnnotation = await storage.toggleAnnotationVisibility(id);

      if (!updatedAnnotation) {
        return res.status(404).json({
          success: false,
          message: "Annotation not found"
        });
      }

      res.json({
        success: true,
        message: `Annotation is now ${updatedAnnotation.isPublic ? 'public' : 'private'}`,
        annotation: updatedAnnotation
      });
    } catch (error) {
      console.error(`Error toggling visibility for annotation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle annotation visibility"
      });
    }
  });

  // ===== Note API Routes =====

  // Note validators
  const noteValidator = insertNoteSchema.extend({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    userName: z.string().min(1, "User name is required"),
    userEmail: z.string().email("Valid email is required"),
    documentType: z.string().min(1, "Document type is required"),
    documentId: z.number().int().positive("Document ID must be a positive integer"),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  });

  // Get notes for a document
  app.get("/api/notes", async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;

      if (!documentType || !documentId) {
        return res.status(400).json({
          success: false,
          message: "Document type and document ID are required"
        });
      }

      const notes = await storage.getNotes(
        documentType as string, 
        parseInt(documentId as string)
      );
      
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notes"
      });
    }
  });

  // Get notes for a user
  app.get("/api/user-notes", async (req: Request, res: Response) => {
    try {
      const { userEmail } = req.query;

      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: "User email is required"
        });
      }

      const notes = await storage.getUserNotes(userEmail as string);
      
      res.json(notes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user notes"
      });
    }
  });

  // Get a specific note
  app.get("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNote(id);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }

      res.json(note);
    } catch (error) {
      console.error(`Error fetching note ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch note"
      });
    }
  });

  // Create a new note
  app.post("/api/notes", async (req: Request, res: Response) => {
    try {
      const noteData = noteValidator.parse(req.body);
      const note = await storage.createNote(noteData);

      res.status(201).json({
        success: true,
        message: "Note created successfully",
        note
      });
    } catch (error) {
      console.error("Error creating note:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid note data",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create note"
      });
    }
  });

  // Update a note
  app.patch("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required"
        });
      }

      const updatedNote = await storage.updateNote(id, title, content, tags);

      if (!updatedNote) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }

      res.json({
        success: true,
        message: "Note updated successfully",
        note: updatedNote
      });
    } catch (error) {
      console.error(`Error updating note ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to update note"
      });
    }
  });

  // Delete a note
  app.delete("/api/notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNote(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }

      res.json({
        success: true,
        message: "Note deleted successfully"
      });
    } catch (error) {
      console.error(`Error deleting note ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to delete note"
      });
    }
  });

  // Toggle note visibility
  app.patch("/api/notes/:id/toggle-visibility", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedNote = await storage.toggleNoteVisibility(id);

      if (!updatedNote) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }

      res.json({
        success: true,
        message: `Note is now ${updatedNote.isPublic ? 'public' : 'private'}`,
        note: updatedNote
      });
    } catch (error) {
      console.error(`Error toggling visibility for note ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle note visibility"
      });
    }
  });

  // ===== Sharing API Routes =====

  // Annotation sharing validator
  const annotationSharingValidator = insertAnnotationSharingSchema.extend({
    annotationId: z.number().int().positive("Annotation ID must be a positive integer"),
    sharedWithEmail: z.string().email("Valid email is required"),
  });

  // Note sharing validator
  const noteSharingValidator = insertNoteSharingSchema.extend({
    noteId: z.number().int().positive("Note ID must be a positive integer"),
    sharedWithEmail: z.string().email("Valid email is required"),
  });

  // Share an annotation
  app.post("/api/annotations/:id/share", async (req: Request, res: Response) => {
    try {
      const annotationId = parseInt(req.params.id);
      const { sharedWithEmail } = req.body;

      if (!sharedWithEmail) {
        return res.status(400).json({
          success: false,
          message: "Email to share with is required"
        });
      }

      // Check if the annotation exists
      const annotation = await storage.getAnnotation(annotationId);
      if (!annotation) {
        return res.status(404).json({
          success: false,
          message: "Annotation not found"
        });
      }

      const sharingData = annotationSharingValidator.parse({
        annotationId,
        sharedWithEmail
      });

      const sharing = await storage.shareAnnotation(sharingData);

      res.status(201).json({
        success: true,
        message: "Annotation shared successfully",
        sharing
      });
    } catch (error) {
      console.error(`Error sharing annotation ${req.params.id}:`, error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid sharing data",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to share annotation"
      });
    }
  });

  // Get annotation sharing list
  app.get("/api/annotations/:id/sharing", async (req: Request, res: Response) => {
    try {
      const annotationId = parseInt(req.params.id);
      const sharings = await storage.getAnnotationSharings(annotationId);

      res.json(sharings);
    } catch (error) {
      console.error(`Error fetching sharing info for annotation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch annotation sharing information"
      });
    }
  });

  // Accept annotation sharing invitation
  app.post("/api/annotation-shares/accept/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const success = await storage.acceptAnnotationSharing(token);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired sharing token"
        });
      }

      res.json({
        success: true,
        message: "Annotation sharing accepted successfully"
      });
    } catch (error) {
      console.error(`Error accepting annotation sharing with token ${req.params.token}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to accept annotation sharing"
      });
    }
  });

  // Delete annotation sharing
  app.delete("/api/annotation-shares/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnotationSharing(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Annotation sharing not found"
        });
      }

      res.json({
        success: true,
        message: "Annotation sharing removed successfully"
      });
    } catch (error) {
      console.error(`Error deleting annotation sharing ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to remove annotation sharing"
      });
    }
  });

  // Share a note
  app.post("/api/notes/:id/share", async (req: Request, res: Response) => {
    try {
      const noteId = parseInt(req.params.id);
      const { sharedWithEmail } = req.body;

      if (!sharedWithEmail) {
        return res.status(400).json({
          success: false,
          message: "Email to share with is required"
        });
      }

      // Check if the note exists
      const note = await storage.getNote(noteId);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }

      const sharingData = noteSharingValidator.parse({
        noteId,
        sharedWithEmail
      });

      const sharing = await storage.shareNote(sharingData);

      res.status(201).json({
        success: true,
        message: "Note shared successfully",
        sharing
      });
    } catch (error) {
      console.error(`Error sharing note ${req.params.id}:`, error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid sharing data",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to share note"
      });
    }
  });

  // Get note sharing list
  app.get("/api/notes/:id/sharing", async (req: Request, res: Response) => {
    try {
      const noteId = parseInt(req.params.id);
      const sharings = await storage.getNoteSharings(noteId);

      res.json(sharings);
    } catch (error) {
      console.error(`Error fetching sharing info for note ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch note sharing information"
      });
    }
  });

  // Accept note sharing invitation
  app.post("/api/note-shares/accept/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const success = await storage.acceptNoteSharing(token);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired sharing token"
        });
      }

      res.json({
        success: true,
        message: "Note sharing accepted successfully"
      });
    } catch (error) {
      console.error(`Error accepting note sharing with token ${req.params.token}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to accept note sharing"
      });
    }
  });

  // Delete note sharing
  app.delete("/api/note-shares/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNoteSharing(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Note sharing not found"
        });
      }

      res.json({
        success: true,
        message: "Note sharing removed successfully"
      });
    } catch (error) {
      console.error(`Error deleting note sharing ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to remove note sharing"
      });
    }
  });

  // Gallery Images API
  const galleryImageValidator = insertGalleryImageSchema.extend({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().optional(),
    imageUrl: z.string().url("Please enter a valid image URL"),
    category: z.string().min(2, "Category must be at least 2 characters long"),
    uploadedBy: z.string().min(2, "Uploaded by name must be at least 2 characters long"),
    uploadedByEmail: z.string().email("Please enter a valid email address"),
    programId: z.number().int().optional(),
    eventId: z.number().int().optional(),
    isPublic: z.boolean().default(true),
    tags: z.array(z.string()).optional()
  });

  // Get all gallery images
  app.get("/api/gallery", async (req: Request, res: Response) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch gallery images" 
      });
    }
  });

  // Get gallery images by category
  app.get("/api/gallery/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const images = await storage.getGalleryImagesByCategory(category);
      res.json(images);
    } catch (error) {
      console.error(`Error fetching gallery images for category ${req.params.category}:`, error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch gallery images for the specified category" 
      });
    }
  });

  // Get gallery images by program
  app.get("/api/gallery/program/:programId", async (req: Request, res: Response) => {
    try {
      const programId = parseInt(req.params.programId);
      const images = await storage.getGalleryImagesByProgram(programId);
      res.json(images);
    } catch (error) {
      console.error(`Error fetching gallery images for program ${req.params.programId}:`, error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch gallery images for the specified program" 
      });
    }
  });

  // Get gallery images by event
  app.get("/api/gallery/event/:eventId", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const images = await storage.getGalleryImagesByEvent(eventId);
      res.json(images);
    } catch (error) {
      console.error(`Error fetching gallery images for event ${req.params.eventId}:`, error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch gallery images for the specified event" 
      });
    }
  });

  // Get a specific gallery image
  app.get("/api/gallery/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.getGalleryImage(id);
      
      if (!image) {
        return res.status(404).json({ 
          success: false,
          message: "Gallery image not found" 
        });
      }
      
      res.json(image);
    } catch (error) {
      console.error(`Error fetching gallery image ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch gallery image" 
      });
    }
  });

  // Create a new gallery image - admin access only
  app.post("/api/gallery", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      // For development use, we'll allow all requests in dev mode
      if (process.env.NODE_ENV !== 'development') {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ 
            success: false,
            message: "Authentication required" 
          });
        }
        
        // If you have an isAdmin field on user, check it here
        // This is just a placeholder - adjust based on your user model
        if (req.user && !req.user.isAdmin) {
          return res.status(403).json({ 
            success: false,
            message: "Administrator privileges required" 
          });
        }
      }
      
      const imageData = galleryImageValidator.parse(req.body);
      const newImage = await storage.createGalleryImage(imageData);
      
      res.status(201).json({ 
        success: true,
        message: "Gallery image created successfully",
        image: newImage
      });
    } catch (error) {
      console.error("Error creating gallery image:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid gallery image data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to create gallery image" 
      });
    }
  });

  // Update a gallery image - admin access only
  app.patch("/api/gallery/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      // For development use, we'll allow all requests in dev mode
      if (process.env.NODE_ENV !== 'development') {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ 
            success: false,
            message: "Authentication required" 
          });
        }
        
        // If you have an isAdmin field on user, check it here
        if (req.user && !req.user.isAdmin) {
          return res.status(403).json({ 
            success: false,
            message: "Administrator privileges required" 
          });
        }
      }
      
      const id = parseInt(req.params.id);
      
      // First check if the image exists
      const existingImage = await storage.getGalleryImage(id);
      if (!existingImage) {
        return res.status(404).json({
          success: false,
          message: "Gallery image not found"
        });
      }
      
      // Validate update data
      const updateData = galleryImageValidator.partial().parse(req.body);
      const updatedImage = await storage.updateGalleryImage(id, updateData);
      
      res.json({ 
        success: true,
        message: "Gallery image updated successfully",
        image: updatedImage
      });
    } catch (error) {
      console.error(`Error updating gallery image ${req.params.id}:`, error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid gallery image data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to update gallery image" 
      });
    }
  });

  // Delete a gallery image - admin access only
  app.delete("/api/gallery/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      // For development use, we'll allow all requests in dev mode
      if (process.env.NODE_ENV !== 'development') {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ 
            success: false,
            message: "Authentication required" 
          });
        }
        
        // If you have an isAdmin field on user, check it here
        if (req.user && !req.user.isAdmin) {
          return res.status(403).json({ 
            success: false,
            message: "Administrator privileges required" 
          });
        }
      }
      
      const id = parseInt(req.params.id);
      
      // First check if the image exists
      const existingImage = await storage.getGalleryImage(id);
      if (!existingImage) {
        return res.status(404).json({
          success: false,
          message: "Gallery image not found"
        });
      }
      
      const success = await storage.deleteGalleryImage(id);
      
      if (success) {
        return res.json({
          success: true,
          message: "Gallery image deleted successfully"
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to delete gallery image"
        });
      }
    } catch (error) {
      console.error(`Error deleting gallery image ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false,
        message: "Failed to delete gallery image" 
      });
    }
  });

  // Staff Member API
  const staffMemberValidator = insertStaffMemberSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    position: z.string().min(2, "Position must be at least 2 characters long"),
    bio: z.string().min(10, "Bio must be at least 10 characters long"),
    education: z.array(z.string()).optional().default([]),
    expertise: z.array(z.string()).optional().default([]),
    publications: z.array(z.string()).optional().default([]),
    email: z.string().email("Please enter a valid email address").optional(),
    phone: z.string().optional(),
    photoUrl: z.string().optional(),
    socialLinks: z.record(z.string()).optional().default({}),
    isFeatured: z.boolean().optional().default(false),
    sortOrder: z.number().int().optional().default(0)
  });
  
  app.get("/api/staff", async (req: Request, res: Response) => {
    try {
      const members = await storage.getStaffMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch staff members" 
      });
    }
  });
  
  app.get("/api/staff/featured", async (req: Request, res: Response) => {
    try {
      const members = await storage.getFeaturedStaffMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching featured staff members:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch featured staff members" 
      });
    }
  });
  
  app.get("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getStaffMember(id);
      
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found"
        });
      }
      
      res.json(member);
    } catch (error) {
      console.error("Error fetching staff member:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch staff member" 
      });
    }
  });
  
  app.post("/api/staff", async (req: Request, res: Response) => {
    try {
      // For development: temporarily bypass authentication
      // In production, uncomment the authentication check:
      // if (!req.isAuthenticated() || !req.user?.isAdmin) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized. Admin access required."
      //   });
      // }
      
      const staffData = staffMemberValidator.parse(req.body);
      const newMember = await storage.createStaffMember(staffData);
      
      res.status(201).json({ 
        success: true,
        message: "Staff member created successfully",
        member: newMember
      });
    } catch (error) {
      console.error("Error creating staff member:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid staff member data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to create staff member" 
      });
    }
  });
  
  app.patch("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      // For development: temporarily bypass authentication
      // In production, uncomment the authentication check:
      // if (!req.isAuthenticated() || !req.user?.isAdmin) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized. Admin access required."
      //   });
      // }
      
      const id = parseInt(req.params.id);
      
      // First check if the staff member exists
      const existingMember = await storage.getStaffMember(id);
      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found"
        });
      }
      
      // Validate the update data
      const updateData = staffMemberValidator.partial().parse(req.body);
      
      // Update the staff member
      const updatedMember = await storage.updateStaffMember(id, updateData);
      
      res.json({ 
        success: true,
        message: "Staff member updated successfully",
        member: updatedMember
      });
    } catch (error) {
      console.error("Error updating staff member:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid staff member data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: "Failed to update staff member" 
      });
    }
  });
  
  app.delete("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      // For development: temporarily bypass authentication
      // In production, uncomment the authentication check:
      // if (!req.isAuthenticated() || !req.user?.isAdmin) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized. Admin access required."
      //   });
      // }
      
      const id = parseInt(req.params.id);
      
      // First check if the staff member exists
      const existingMember = await storage.getStaffMember(id);
      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found"
        });
      }
      
      const success = await storage.deleteStaffMember(id);
      
      if (success) {
        return res.json({
          success: true,
          message: "Staff member deleted successfully"
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to delete staff member"
        });
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to delete staff member" 
      });
    }
  });

  // Chatbot API
  const chatMessageSchema = z.object({
    messages: z.array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1)
      })
    ),
    systemPrompt: z.string().optional()
  });

  app.post("/api/chatbot", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const { messages, systemPrompt } = chatMessageSchema.parse(req.body);
      
      // Ensure message sequence is valid (must alternate user/assistant)
      let formattedMessages = [...messages];
      
      // Add system message at the beginning
      const systemMessage: { role: "system" | "user" | "assistant"; content: string } = {
        role: "system", 
        content: systemPrompt || `You are an AI assistant for the Movement for Positive Change (MPC), a Ghanaian policy research organization focused on positive societal transformation in Ghana. MPC conducts research on economic development, natural resources, governance, education, and social issues in Ghana. 

Key information about MPC:
- Founded as a non-profit policy research center focused on Ghana's development
- Current research focuses include economic recovery, natural resource management, educational reform, and governance in Ghana
- Has published policy briefs on topics like "Economic Recovery Post-COVID in Ghana" and research papers like "The Natural Resource Trap"
- Organizes events including campus tours and community discussions 
- Has a mission to transform Ghana through research-backed policy recommendations

Always respond as if you are representing the Movement for Positive Change. When asked about research topics, reference our actual policy briefs and research papers if relevant. If asked about topics we haven't researched, acknowledge this but offer general information related to Ghana when possible.`
      };
      
      // Validate that the final message is from the user
      if (formattedMessages.length === 0 || formattedMessages[formattedMessages.length - 1].role !== "user") {
        throw new Error("The last message must be from the user");
      }
      
      // Validate message alternation (Perplexity requirement)
      for (let i = 1; i < formattedMessages.length; i++) {
        const prevRole = formattedMessages[i - 1].role;
        const currRole = formattedMessages[i].role;
        
        if (prevRole === currRole) {
          // Messages of same role can't be adjacent
          formattedMessages.splice(i, 1);
          i--; // Adjust index after splice
        }
      }
      
      // Add system message at the beginning
      formattedMessages = [systemMessage, ...formattedMessages];
      
      // Get response from Perplexity
      const response = await getChatCompletion(formattedMessages);
      
      // Return the response
      res.json({
        success: true,
        message: "Chatbot response generated successfully",
        response
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid chat message format",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to generate chatbot response"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
