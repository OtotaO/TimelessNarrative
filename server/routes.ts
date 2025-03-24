import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { literaryEvents, users, historicalPhrases } from "@db/schema";
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

  // Literary Event routes
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

  // Historical Phrases routes
  app.get("/api/phrases", async (req, res) => {
    try {
      const phrases = await db.query.historicalPhrases.findMany({
        orderBy: [desc(historicalPhrases.createdAt)]
      });
      res.json(phrases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch phrases" });
    }
  });

  // Search phrases
  app.get("/api/phrases/search", async (req, res) => {
    const { query } = req.query;
    try {
      const phrases = await db.query.historicalPhrases.findMany({
        where: sql`to_tsvector('english', ${historicalPhrases.phrase} || ' ' || ${historicalPhrases.meaning} || ' ' || ${historicalPhrases.origin}) @@ plainto_tsquery('english', ${query})`
      });
      res.json(phrases);
    } catch (error) {
      res.status(500).json({ error: "Failed to search phrases" });
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

  // Submit new phrase (requires authentication)
  app.post("/api/phrases", isAuthenticated, async (req, res) => {
    const { phrase, meaning, origin, timePeriod, category, source } = req.body;
    try {
      const newPhrase = await db.insert(historicalPhrases).values({
        phrase,
        meaning,
        origin,
        timePeriod,
        category,
        source,
        contributorId: (req.user as any).id,
        status: 'pending'
      }).returning();
      res.json(newPhrase[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit phrase" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}