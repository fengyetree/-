import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  university: text("university"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  university: true,
  email: true,
});

export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  trackId: integer("track_id").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCompetitionSchema = createInsertSchema(competitions).pick({
  title: true,
  description: true,
  imageUrl: true,
  trackId: true,
  registrationDeadline: true,
  startDate: true,
  endDate: true,
  status: true,
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrackSchema = createInsertSchema(tracks).pick({
  name: true,
  description: true,
  icon: true,
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  competitionId: integer("competition_id").notNull(),
  teamName: text("team_name"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  userId: true,
  competitionId: true,
  teamName: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Competition = typeof competitions.$inferSelect;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export const universities = [
  "清华大学", "北京大学", "复旦大学", "浙江大学", "上海交通大学", 
  "南京大学", "武汉大学", "中国人民大学", "哈尔滨工业大学", 
  "四川大学", "西安交通大学", "中山大学", "北京航空航天大学", 
  "华中科技大学", "南开大学", "天津大学", "同济大学", "厦门大学",
  "中南大学", "山东大学", "吉林大学", "华东师范大学", "北京师范大学",
  "东南大学", "西北工业大学", "电子科技大学", "湖南大学", "兰州大学",
  "重庆大学", "北京理工大学", "东北大学", "其他院校"
];
