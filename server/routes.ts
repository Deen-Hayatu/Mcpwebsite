import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertContactMessageSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
