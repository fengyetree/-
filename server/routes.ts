/**
 * 路由配置文件
 * 该文件定义了所有API端点的路由处理逻辑
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { hashPassword } from "./auth"; // 导入密码哈希函数
import z from 'zod';
import { insertUserSchema, insertCompetitionSchema, insertTrackSchema, insertRegistrationSchema } from "@shared/schema";

/**
 * 注册所有路由
 * @param app Express应用实例
 * @returns HTTP服务器实例
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // 设置认证相关路由
  setupAuth(app);

  // === 竞赛相关路由 ===

  /**
   * 获取所有竞赛列表
   * GET /api/competitions
   */
  app.get("/api/competition/race/list", async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitions" });
    }
  });

  /**
   * 获取特定竞赛详情
   * GET /api/competitions/:id
   */
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

  /**
   * 创建新竞赛（仅管理员）
   * POST /api/competitions
   */
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

  /**
   * 更新竞赛信息（仅管理员）
   * PATCH /api/competitions/:id
   */
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

  /**
   * 删除竞赛（仅管理员）
   * DELETE /api/competitions/:id
   */
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

  // === 赛道相关路由 ===

  /**
   * 获取所有赛道列表
   * GET /api/tracks
   */
  app.get("/api/tracks", async (req, res) => {
    try {
      const tracks = await storage.getAllTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  /**
   * 获取特定赛道详情
   * GET /api/tracks/:id
   */
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

  /**
   * 创建新赛道（仅管理员）
   * POST /api/tracks
   */
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

  // === 时间线相关路由 ===

  /**
   * 获取竞赛时间线数据
   * GET /api/competition-timeline
   * 返回竞赛各阶段时间安排和赛区时间安排
   */
  app.get("/api/competition-timeline", async (req, res) => {
    try {
      // 这里可以从数据库获取实际的时间数据
      // 目前返回静态数据，将来可以根据需要修改为动态数据
      const timeline = {
        stages: [
          { stageId: 1, dateRange: "9月1日 - 10月15日" },
          { stageId: 2, dateRange: "10月20日 - 11月5日" },
          { stageId: 3, dateRange: "11月15日 - 12月5日" },
          { stageId: 4, dateRange: "12月20日 - 12月22日" }
        ],
        districts: [
          { region: "north", registrationDates: "2023-09-01 ~ 09-20", preliminaryDates: "2023-10-10 ~ 10-15", finalDate: "2023-12-10" },
          { region: "east", registrationDates: "2023-09-05 ~ 09-25", preliminaryDates: "2023-10-12 ~ 10-18", finalDate: "2023-12-12" },
          { region: "southwest", registrationDates: "2023-09-10 ~ 09-28", preliminaryDates: "2023-10-15 ~ 10-20", finalDate: "2023-12-15" },
          { region: "northeast", registrationDates: "2023-09-12 ~ 09-30", preliminaryDates: "2023-10-18 ~ 10-22", finalDate: "2023-12-18" }
        ]
      };
      
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline" });
    }
  });

  // === 报名相关路由 ===

  /**
   * 获取所有报名记录（仅管理员）
   * GET /api/registrations
   */
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

  /**
   * 检查用户是否已报名特定竞赛
   * GET /api/registrations/check/:competitionId
   */
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

  /**
   * 创建新的报名记录
   * POST /api/registrations
   */
  app.post("/api/registrations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const registrationData = insertRegistrationSchema.parse(req.body);

      // 确保用户只能为自己报名
      if (registrationData.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only register yourself" });
      }

      // 检查是否已经报名
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

  /**
   * 更新报名状态（仅管理员）
   * PATCH /api/registrations/:id
   */
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
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update registration status" });
    }
  });

  // 创建并返回HTTP服务器实例
  return createServer(app);
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
          title: "2025年（第二届）大学生数据要素素质大赛",
          description: "为深入贯彻中央《提升全民数字素养与技能行动纲要》及《2024年提升全民数字素养与技能工作要点》等一系列文件精神，积极响应国家经济社会数字化转型的迫切需求，加速培养具备高水平数据素养的复合型人才，由全国数据工程教学联盟发起举办"2024年大学生数据要素素质大赛"。",
          imageUrl: "https://obs-cq.cucloud.cn/zeno-videofile/files/20240603/0008a5be-2394-4b60-8a4b-86546e633a85.png",
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
