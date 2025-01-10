import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { literaryEvents, users } from "@db/schema";
import { desc, asc, eq, sql } from "drizzle-orm";
import passport from "passport";
import { registerUser } from "./auth";
import type { Request, Response } from "express";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export function registerRoutes(app: Express): Server {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const user = await registerUser(username, email, password);
      res.json({ message: "Registration successful" });
    } catch (error: any) {
      if (error.message.includes("unique constraint")) {
        res.status(400).json({ message: "Username or email already exists" });
      } else {
        res.status(500).json({ message: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await db.query.literaryEvents.findMany({
        orderBy: [asc(literaryEvents.year)]
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Search events
  app.get("/api/events/search", async (req, res) => {
    const { query } = req.query;
    try {
      const events = await db.query.literaryEvents.findMany({
        where: sql`to_tsvector('english', ${literaryEvents.title} || ' ' || ${literaryEvents.description}) @@ plainto_tsquery('english', ${query})`
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to search events" });
    }
  });

  // Submit new event (requires authentication)
  app.post("/api/events", isAuthenticated, async (req, res) => {
    const { title, description, year, month, day, category, significance, source } = req.body;
    try {
      const event = await db.insert(literaryEvents).values({
        title,
        description,
        year,
        month,
        day,
        category,
        significance,
        source,
        contributorId: (req.user as any).id,
        status: 'pending'
      }).returning();
      res.json(event[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit event" });
    }
  });

  // Get user's submitted events
  app.get("/api/events/my-contributions", isAuthenticated, async (req, res) => {
    try {
      const events = await db.query.literaryEvents.findMany({
        where: eq(literaryEvents.contributorId, (req.user as any).id),
        orderBy: [desc(literaryEvents.createdAt)]
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contributions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}