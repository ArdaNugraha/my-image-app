// lib/schema.ts
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  description: text("description"),
  category_id: integer("category_id").references(() => categories.id),
  uploaded_by: integer("uploaded_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
