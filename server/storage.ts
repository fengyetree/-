import { 
  User, InsertUser, 
  Competition, InsertCompetition, 
  Track, InsertTrack, 
  Registration, InsertRegistration 
} from "@shared/schema";
import session from "express-session";
// import type { SessionStore } from "express-session";
import createMemoryStore from "memorystore";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const MemoryStore = createMemoryStore(session);

// CRUD interface for the application
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Competition methods
  getCompetition(id: number): Promise<Competition | undefined>;
  getAllCompetitions(): Promise<Competition[]>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: number, competition: InsertCompetition): Promise<Competition | undefined>;
  deleteCompetition(id: number): Promise<void>;
  
  // Track methods
  getTrack(id: number): Promise<Track | undefined>;
  getAllTracks(): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  
  // Registration methods
  getRegistration(id: number): Promise<Registration | undefined>;
  getAllRegistrations(): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  checkRegistration(userId: number, competitionId: number): Promise<boolean>;
  updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined>;
  
  // Session store
  sessionStore: any; // Use any to bypass type checking due to import issue
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private competitions: Map<number, Competition>;
  private tracks: Map<number, Track>;
  private registrations: Map<number, Registration>;
  sessionStore: any; // Use any to bypass type checking due to import issue
  
  private userCurrentId: number;
  private competitionCurrentId: number;
  private trackCurrentId: number;
  private registrationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.competitions = new Map();
    this.tracks = new Map();
    this.registrations = new Map();
    
    this.userCurrentId = 1;
    this.competitionCurrentId = 1;
    this.trackCurrentId = 1;
    this.registrationCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // === USER METHODS ===
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt,
      role: insertUser.role === undefined ? 'student' : insertUser.role,
      university: insertUser.university === undefined ? null : insertUser.university,
      email: insertUser.email === undefined ? null : insertUser.email,
    };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // === COMPETITION METHODS ===
  
  async getCompetition(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }
  
  async getAllCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values());
  }
  
  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const id = this.competitionCurrentId++;
    const createdAt = new Date();
    const competition: Competition = {
      ...insertCompetition,
      id,
      createdAt,
      description: insertCompetition.description === undefined ? null : insertCompetition.description,
      imageUrl: insertCompetition.imageUrl === undefined ? null : insertCompetition.imageUrl,
      registrationDeadline: insertCompetition.registrationDeadline === undefined ? null : insertCompetition.registrationDeadline,
      startDate: insertCompetition.startDate === undefined ? null : insertCompetition.startDate,
      endDate: insertCompetition.endDate === undefined ? null : insertCompetition.endDate,
      status: insertCompetition.status === undefined ? 'active' : insertCompetition.status,
    };
    this.competitions.set(id, competition);
    return competition;
  }
  
  async updateCompetition(id: number, updateData: InsertCompetition): Promise<Competition | undefined> {
    const competition = this.competitions.get(id);
    if (!competition) return undefined;
    
    const updatedCompetition: Competition = { 
      ...competition, 
      ...updateData,
      id // Ensure id doesn't change
    };
    
    this.competitions.set(id, updatedCompetition);
    return updatedCompetition;
  }
  
  async deleteCompetition(id: number): Promise<void> {
    this.competitions.delete(id);
  }

  // === TRACK METHODS ===
  
  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }
  
  async getAllTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }
  
  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.trackCurrentId++;
    const createdAt = new Date();
    const track: Track = {
      ...insertTrack,
      id,
      createdAt,
      description: insertTrack.description === undefined ? null : insertTrack.description,
      icon: insertTrack.icon === undefined ? null : insertTrack.icon,
    };
    this.tracks.set(id, track);
    return track;
  }

  // === REGISTRATION METHODS ===
  
  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }
  
  async getAllRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values());
  }
  
  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.registrationCurrentId++;
    const createdAt = new Date();
    const registration: Registration = {
      ...insertRegistration,
      id,
      createdAt,
      status: insertRegistration.status === undefined ? 'pending' : insertRegistration.status,
      teamName: insertRegistration.teamName === undefined ? null : insertRegistration.teamName,
    };
    this.registrations.set(id, registration);
    return registration;
  }
  
  async checkRegistration(userId: number, competitionId: number): Promise<boolean> {
    return Array.from(this.registrations.values()).some(
      reg => reg.userId === userId && reg.competitionId === competitionId
    );
  }
  
  async updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined> {
    const registration = this.registrations.get(id);
    if (!registration) return undefined;
    
    const updatedRegistration: Registration = {
      ...registration,
      status
    };
    
    this.registrations.set(id, updatedRegistration);
    return updatedRegistration;
  }
}

export const storage = new MemStorage();
