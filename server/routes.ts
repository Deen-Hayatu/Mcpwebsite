import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
