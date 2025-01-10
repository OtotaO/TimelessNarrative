import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const literaryEvents = pgTable("literary_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  month: integer("month"),
  day: integer("day"),
  category: text("category").notNull(), // book, author, publication, etc.
  significance: text("significance").notNull(),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(literaryEvents);
export const selectEventSchema = createSelectSchema(literaryEvents);
export type InsertEvent = typeof literaryEvents.$inferInsert;
export type SelectEvent = typeof literaryEvents.$inferSelect;
