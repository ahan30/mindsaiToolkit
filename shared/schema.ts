import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("🛠️"),
  status: text("status").notNull().default("active"), // active, beta, generating
  code: text("code"), // Generated tool code
  metadata: jsonb("metadata"), // Tool configuration and settings
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  usageCount: integer("usage_count").default(0),
});

export const toolRequests = pgTable("tool_requests", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  toolId: integer("tool_id"),
  userId: integer("user_id"),
  progress: integer("progress").default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  toolsGenerated: integer("tools_generated").default(0),
  activeSessions: integer("active_sessions").default(0),
  successRate: integer("success_rate").default(0), // percentage
  totalRequests: integer("total_requests").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});

export const insertToolRequestSchema = createInsertSchema(toolRequests).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type ToolRequest = typeof toolRequests.$inferSelect;
export type InsertToolRequest = z.infer<typeof insertToolRequestSchema>;
export type Analytics = typeof analytics.$inferSelect;
