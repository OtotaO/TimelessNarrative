import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const literaryEvents = pgTable("literary_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  month: integer("month"),
  day: integer("day"),
  category: text("category").notNull(),
  significance: text("significance").notNull(),
  source: text("source"),
  contributorId: integer("contributor_id").references(() => users.id),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const historicalPhrases = pgTable("historical_phrases", {
  id: serial("id").primaryKey(),
  phrase: text("phrase").notNull(),
  meaning: text("meaning").notNull(),
  origin: text("origin").notNull(),
  timePeriod: text("time_period").notNull(),
  category: text("category").notNull(), // e.g., maritime, trade, warfare, daily life
  source: text("source"),
  contributorId: integer("contributor_id").references(() => users.id),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relationships
export const eventsRelations = relations(literaryEvents, ({ one }) => ({
  contributor: one(users, {
    fields: [literaryEvents.contributorId],
    references: [users.id],
  }),
}));

export const phrasesRelations = relations(historicalPhrases, ({ one }) => ({
  contributor: one(users, {
    fields: [historicalPhrases.contributorId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  contributions: many(literaryEvents),
  phraseContributions: many(historicalPhrases),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(literaryEvents);
export const selectEventSchema = createSelectSchema(literaryEvents);
export const insertPhraseSchema = createInsertSchema(historicalPhrases);
export const selectPhraseSchema = createSelectSchema(historicalPhrases);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertEvent = typeof literaryEvents.$inferInsert;
export type SelectEvent = typeof literaryEvents.$inferSelect;
export type InsertPhrase = typeof historicalPhrases.$inferInsert;
export type SelectPhrase = typeof historicalPhrases.$inferSelect;