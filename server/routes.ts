import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { hashPassword } from "./auth"; // Import hashPassword function
import z from 'zod';
import { insertUserSchema, insertCompetitionSchema, insertTrackSchema, insertRegistrationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // === COMPETITIONS ROUTES ===

  // Get all competitions
  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitions" });
    }
  });

  // Get a specific competition
  app.get("/api/competitions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const competition = await storage.getCompetition(id);

      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }

      res.json(competition);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competition" });
    }
  });

  // Create a competition (admin only)
  app.post("/api/competitions", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(competitionData);
      res.status(201).json(competition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competition data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create competition" });
    }
  });

  // Update a competition (admin only)
  app.patch("/api/competitions/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.updateCompetition(id, competitionData);

      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }

      res.json(competition);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competition data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update competition" });
    }
  });

  // Delete a competition (admin only)
  app.delete("/api/competitions/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompetition(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete competition" });
    }
  });

  // === TRACKS ROUTES ===

  // Get all tracks
  app.get("/api/tracks", async (req, res) => {
    try {
      const tracks = await storage.getAllTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  // Get a specific track
  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.getTrack(id);

      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }

      res.json(track);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  // Create a track (admin only)
  app.post("/api/tracks", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const trackData = insertTrackSchema.parse(req.body);
      const track = await storage.createTrack(trackData);
      res.status(201).json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid track data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create track" });
    }
  });

  // === REGISTRATIONS ROUTES ===

  // Get all registrations (admin only)
  app.get("/api/registrations", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const registrations = await storage.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  // Check if user is registered for a competition
  app.get("/api/registrations/check/:competitionId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const competitionId = parseInt(req.params.competitionId);
      const userId = req.user.id;

      const isRegistered = await storage.checkRegistration(userId, competitionId);
      res.json(isRegistered);
    } catch (error) {
      res.status(500).json({ message: "Failed to check registration" });
    }
  });

  // Register for a competition
  app.post("/api/registrations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const registrationData = insertRegistrationSchema.parse(req.body);

      // Ensure the user can only register themselves
      if (registrationData.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only register yourself" });
      }

      // Check if already registered
      const isRegistered = await storage.checkRegistration(
        registrationData.userId,
        registrationData.competitionId
      );

      if (isRegistered) {
        return res.status(400).json({ message: "Already registered for this competition" });
      }

      const registration = await storage.createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create registration" });
    }
  });

  // Update registration status (admin only)
  app.patch("/api/registrations/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const registration = await storage.updateRegistrationStatus(id, status);

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update registration" });
    }
  });

  // === USERS ROUTES ===

  // Get all users (admin only)
  // app.get("/api/users", async (req, res) => {
  //   if (!req.isAuthenticated() || req.user.role !== "admin") {
  //     return res.status(403).json({ message: "Unauthorized" });
  //   }
  //
  //   try {
  //     const users = await storage.getAllUsers();
  //     res.json(users);
  //   } catch (error) {
  //     res.status(500).json({ message: "Failed to fetch users" });
  //   }
  // });

  // Create the HTTP server
  const httpServer = createServer(app);

  // Initialize the database with default data if needed
  await initializeData();

  return httpServer;
}

// Function to initialize the database with default data
async function initializeData() {
  try {
    // Create admin user if it doesn't exist
    const adminExists = await storage.getUserByUsername("admin");
    if (!adminExists) {
      // Hash the password before storing
      const hashedPassword = await hashPassword("000000");
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "admin",
        university: "管理员",
        email: "admin@example.com"
      });
    }

    // Create default tracks if none exist
    const tracks = await storage.getAllTracks();
    if (!tracks || tracks.length === 0) {
      const defaultTracks = [
        {
          name: "创新创业赛道",
          description: "针对具有市场潜力和商业价值的创新项目和创业计划",
          icon: "fas fa-lightbulb"
        },
        {
          name: "人工智能赛道",
          description: "专注于人工智能技术在各领域的创新应用和解决方案",
          icon: "fas fa-laptop-code"
        },
        {
          name: "乡村振兴赛道",
          description: "围绕乡村振兴战略，提出创新方案和实践项目",
          icon: "fas fa-leaf"
        },
        {
          name: "生物医学赛道",
          description: "聚焦生物医学科技创新，提升健康医疗水平的项目",
          icon: "fas fa-flask"
        }
      ];

      for (const track of defaultTracks) {
        await storage.createTrack(track);
      }
    }

    // Create default competition if none exist
    const competitions = await storage.getAllCompetitions();
    if (!competitions || competitions.length === 0) {
      // Get the first track ID
      const tracks = await storage.getAllTracks();
      if (tracks && tracks.length > 0) {
        const trackId = tracks[0].id;

        await storage.createCompetition({
          title: "2023全国大学生创新创业大赛",
          description: "聚焦新时代创新创业，汇聚青年智慧，探索科技前沿，推动创业实践，打造全方位创新创业竞赛平台。",
          imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
          trackId: trackId,
          registrationDeadline: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          startDate: new Date(),
          endDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          status: "active"
        });
      }
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}
