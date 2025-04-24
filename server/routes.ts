import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";

// Initialize Stripe if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });
}
import { 
  insertSubscriberSchema, 
  insertContactMessageSchema, 
  insertResearchMetricSchema, 
  insertEventRegistrationSchema,
  insertMembershipApplicationSchema,
  insertDonationSchema,
  insertVolunteerApplicationSchema,
  insertDiscussionForumRegistrationSchema,
  insertFellowshipApplicationSchema,
  insertStudentChapterApplicationSchema,
  insertCareerApplicationSchema
} from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}
