import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { literaryEvents } from "@db/schema";
import { desc, asc, sql } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get all events
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

  const httpServer = createServer(app);
  return httpServer;
}
