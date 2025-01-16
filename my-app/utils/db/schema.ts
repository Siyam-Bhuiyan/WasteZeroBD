// utils/db/schema.ts
import { integer, varchar, pgTable, serial, text, timestamp, jsonb, boolean, decimal, } from "drizzle-orm/pg-core";
import {sql} from 'drizzle-orm'

export const Certificates = pgTable('certificates', {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => Users.id).notNull(), // Assuming businesses are part of Users
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  type: text('type'), // 'iron', 'bronze', 'silver', 'gold'
  points: integer('points'),
  reportedWastes: integer('reported_wastes'),
  collectedWastes: integer('collected_wastes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const WasteListings = pgTable("waste_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: text("location").notNull(),
  wasteType: varchar("waste_type", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  verificationResult: jsonb("verification_result"),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  money: varchar("money", { length: 255 }).notNull(),
});

export const buyRequests = pgTable('buy_requests', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  wasteType: varchar('waste_type', { length: 50 }).notNull(),
  amount: varchar('amount', { length: 50 }).notNull(),
  money: decimal('money', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


// Users table
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  banned: boolean("banned").default(false).notNull(), // Ban status
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports table
export const Reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  location: text("location").notNull(),
  wasteType: varchar("waste_type", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 255 }).notNull(),
  imageUrl: text("image_url"),
  verificationResult: jsonb("verification_result"),
  recyclingRecommendations: jsonb("recycling_recommendations"), // New column
  status: varchar("status", { length: 255 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  collectorId: integer("collector_id").references(() => Users.id),
});

// Rewards table
export const Rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  points: integer("points").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  description: text("description"),
  name: varchar("name", { length: 255 }).notNull(),
  collectionInfo: text("collection_info").notNull(),
});

// CollectedWastes table
export const CollectedWastes = pgTable("collected_wastes", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").references(() => Reports.id).notNull(),
  collectorId: integer("collector_id").references(() => Users.id).notNull(),
  collectionDate: timestamp("collection_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("collected"),
});

// Notifications table
export const Notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New Transactions table
export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'earned' or 'redeemed'
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

// export const Certificates = pgTable("certificates", {
//   id: serial("id").primaryKey(),
//   businessId: integer("business_id").references(() => Users.id).notNull(), // Assuming businesses are part of Users
//   issuedAt: timestamp("issued_at").defaultNow().notNull(),
// });

export const CertificateReviews = pgTable("certificate_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => Users.id),
  answers: text("answers").notNull(), // JSON format of user answers
  score: integer("score"), // Calculated score
  status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'approved', 'rejected'
  adminFeedback: text("admin_feedback"), // Optional feedback from admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const ResidentialServices = pgTable('residential_services', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  cleanerId: integer('cleaner_id'),
  location: text('location').notNull(),
  wasteType: varchar('waste_type', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const Cleaners = pgTable('cleaners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  location: text('location').notNull(),
  availability: varchar('availability', { length: 50 }).default('available'),
  rating: integer('rating').default(5),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const Images = pgTable('images', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
});

export const Payment = pgTable("payments", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  transactionId: varchar("transactionId", { length: 50 }).unique(), // Unique transaction ID
  userEmail: varchar("userEmail").references(() => Users.email).notNull(), // Foreign key referencing Users table
  type: varchar("type", { length: 20 }).notNull(), // 'residential service', 'certificate', or 'buy&sell'
  amount: integer("amount").notNull(),
  userName: text("userName").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const MarketplaceOrders = pgTable('marketplace_orders', {
  id: serial('id').primaryKey(),
  buyerId: integer('buyer_id').references(() => Users.id).notNull(),
  sellerId: integer('seller_id').references(() => Users.id).notNull(),
  listingId: integer('listing_id').references(() => WasteListings.id).notNull(),
  quantity: varchar('quantity', { length: 255 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const Cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => Users.id).notNull(),
  listingId: integer('listing_id').references(() => WasteListings.id).notNull(),
  quantity: varchar('quantity', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});