/**
 * 路由配置文件
 * 该文件定义了所有API端点的路由处理逻辑
 */
import axios from "axios";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { hashPassword } from "./auth"; // 导入密码哈希函数
import z from 'zod';
import { insertUserSchema, insertCompetitionSchema, insertTrackSchema, insertRegistrationSchema } from "@shared/schema";

/**
 * 注册所有路由
 * 这个函数接收一个Express应用实例，并为其设置所有后端路由。
 * @param app Express应用实例
 * @returns HTTP服务器实例
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // 设置认证相关路由（如登录、注册、获取用户信息等）
  setupAuth(app);

  // === 竞赛相关路由 ===

  /**
   * 获取所有竞赛列表
   * 处理 GET /competition/race/list 请求
   */
  app.get("/competition/race/list", async (req, res) => {
    try {
      // 调用 storage 模块的方法从数据库获取所有竞赛列表
      const competitions = await axios.get('http://127.0.0.1:8088/competition/race/list');
      res.json(competitions); // 返回JSON格式的竞赛列表
    } catch (error) {
      console.error("Error fetching competitions:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to fetch competitions" }); // 返回500内部服务器错误及错误信息
    }
  });

  /**
   * 获取特定竞赛详情
   * 处理 GET /competition/race/:id 请求
   * :id 是一个路由参数，代表竞赛的ID
   */
  app.get("/competition/race/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id); // 从路由参数中解析出竞赛ID (字符串转整数)
      const competition = await storage.getCompetition(id); // 根据ID从数据库获取竞赛详情

      if (!competition) {
        return res.status(404).json({ message: "Competition not found" }); // 如果找不到竞赛，返回404 Not Found
      }

      res.json(competition); // 返回JSON格式的竞赛详情
    } catch (error) {
      console.error("Error fetching competition:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to fetch competition" }); // 返回500内部服务器错误
    }
  });

  /**
   * 创建新竞赛（仅管理员）
   * 处理 POST /api/competitions 请求
   * 需要管理员权限
   */
  app.post("/api/competitions", async (req, res) => {
    // 检查用户是否已认证且角色为管理员
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" }); // 如果没有管理员权限，返回403 Forbidden
    }

    try {
      const competitionData = insertCompetitionSchema.parse(req.body); // 使用Zod验证请求体数据
      const competition = await storage.createCompetition(competitionData); // 在数据库中创建新竞赛
      res.status(201).json(competition); // 返回201 Created 和新创建的竞赛数据
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competition data", errors: error.errors }); // 如果数据验证失败，返回400 Bad Request和验证错误信息
      }
      console.error("Error creating competition:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to create competition" }); // 返回500内部服务器错误
    }
  });

  /**
   * 更新竞赛信息（仅管理员）
   * 处理 PATCH /api/competitions/:id 请求
   * 需要管理员权限
   */
  app.patch("/api/competitions/:id", async (req, res) => {
    // 检查用户是否已认证且角色为管理员
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" }); // 如果没有管理员权限，返回403 Forbidden
    }

    try {
      const id = parseInt(req.params.id); // 从路由参数中解析出竞赛ID
      const competitionData = insertCompetitionSchema.parse(req.body); // 使用Zod验证请求体数据
      const competition = await storage.updateCompetition(id, competitionData); // 更新数据库中的竞赛信息

      if (!competition) {
        return res.status(404).json({ message: "Competition not found" }); // 如果找不到竞赛，返回404 Not Found
      }

      res.json(competition); // 返回更新后的竞赛数据
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competition data", errors: error.errors }); // 如果数据验证失败，返回400 Bad Request
      }
      console.error("Error updating competition:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to update competition" }); // 返回500内部服务器错误
    }
  });

  /**
   * 删除竞赛（仅管理员）
   * 处理 DELETE /api/competitions/:id 请求
   * 需要管理员权限
   */
  app.delete("/api/competitions/:id", async (req, res) => {
    // 检查用户是否已认证且角色为管理员
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" }); // 如果没有管理员权限，返回403 Forbidden
    }

    try {
      const id = parseInt(req.params.id); // 从路由参数中解析出竞赛ID
      await storage.deleteCompetition(id); // 从数据库中删除竞赛
      res.status(204).send(); // 返回204 No Content 表示删除成功
    } catch (error) {
      console.error("Error deleting competition:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to delete competition" }); // 返回500内部服务器错误
    }
  });

  // === 赛道相关路由 ===

  /**
   * 获取所有赛道列表
   * 处理 GET /tracks 请求
   */
  app.get("/tracks", async (req, res) => {
    try {
      const tracks = await storage.getAllTracks(); // 从数据库获取所有赛道列表
      res.json(tracks); // 返回JSON格式的赛道列表
    } catch (error) {
      console.error("Error fetching tracks:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to fetch tracks" }); // 返回500内部服务器错误
    }
  });

  /**
   * 获取特定赛道详情
   * 处理 GET /tracks/:id 请求
   * :id 是一个路由参数，代表赛道的ID
   */
  app.get("/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id); // 从路由参数中解析出赛道ID
      const track = await storage.getTrack(id); // 根据ID从数据库获取赛道详情

      if (!track) {
        return res.status(404).json({ message: "Track not found" }); // 如果找不到赛道，返回404 Not Found
      }

      res.json(track); // 返回JSON格式的赛道详情
    } catch (error) {
      console.error("Error fetching track:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to fetch track" }); // 返回500内部服务器错误
    }
  });

  /**
   * 创建新赛道（仅管理员）
   * 处理 POST /tracks 请求
   * 需要管理员权限
   */
  app.post("/tracks", async (req, res) => {
    // 检查用户是否已认证且角色为管理员
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" }); // 如果没有管理员权限，返回403 Forbidden
    }

    try {
      const trackData = insertTrackSchema.parse(req.body); // 使用Zod验证请求体数据
      const track = await storage.createTrack(trackData); // 在数据库中创建新赛道
      res.status(201).json(track); // 返回201 Created 和新创建的赛道数据
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid track data", errors: error.errors }); // 如果数据验证失败，返回400 Bad Request
      }
      console.error("Error creating track:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to create track" }); // 返回500内部服务器错误
    }
  });

  // === 时间线相关路由 ===

  /**
   * 获取竞赛时间线数据
   * 处理 GET /competition-timeline 请求
   * 返回竞赛各阶段时间安排和赛区时间安排
   */
  app.get("/competition-timeline", async (req, res) => {
    try {
      // 这里可以从数据库获取实际的时间数据
      // 目前返回静态模拟数据，将来可以根据需要修改为动态数据
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
      
      res.json(timeline); // 返回JSON格式的时间线数据
    } catch (error) {
      console.error("Error fetching timeline:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to fetch timeline" }); // 返回500内部服务器错误
    }
  });

  // === 报名相关路由 ===

  /**
   * 获取所有报名记录（仅管理员）
   * 处理 GET /registrations 请求
   * 需要管理员权限
   */
  app.get("/registrations", async (req, res) => {
    // 检查用户是否已认证且角色为管理员
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" }); // 如果没有管理员权限，返回403 Forbidden
    }

    try {
      const registrations = await storage.getAllRegistrations(); // 从数据库获取所有报名记录
      res.json(registrations); // 返回JSON格式的报名记录列表
    } catch (error) {
      console.error("Error fetching registrations:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to fetch registrations" }); // 返回500内部服务器错误
    }
  });

  /**
   * 检查用户是否已报名特定竞赛
   * 处理 GET /registrations/check/:competitionId 请求
   * 需要用户认证
   */
  app.get("/registrations/check/:competitionId", async (req, res) => {
    // 检查用户是否已认证
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" }); // 如果未认证，返回401 Unauthorized
    }

    try {
      const competitionId = parseInt(req.params.competitionId); // 从路由参数中解析出竞赛ID
      const userId = req.user.id; // 获取当前认证用户的ID

      const isRegistered = await storage.checkRegistration(userId, competitionId); // 检查用户是否已报名该竞赛
      res.json(isRegistered); // 返回布尔值表示是否已报名
    } catch (error) {
      console.error("Error checking registration:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to check registration" }); // 返回500内部服务器错误
    }
  });

  /**
   * 创建新的报名记录
   * 处理 POST /registrations 请求
   * 需要用户认证
   */
  app.post("/registrations", async (req, res) => {
    // 检查用户是否已认证
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" }); // 如果未认证，返回401 Unauthorized
    }

    try {
      const registrationData = insertRegistrationSchema.parse(req.body); // 使用Zod验证请求体数据

      // 确保用户只能为自己报名
      if (registrationData.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only register yourself" }); // 如果尝试为他人报名，返回403 Forbidden
      }

      // 检查是否已经报名
      const isRegistered = await storage.checkRegistration(
        registrationData.userId,
        registrationData.competitionId
      );

      if (isRegistered) {
        return res.status(400).json({ message: "Already registered for this competition" }); // 如果已经报名，返回400 Bad Request
      }

      const registration = await storage.createRegistration(registrationData); // 在数据库中创建新的报名记录
      res.status(201).json(registration); // 返回201 Created 和新创建的报名记录
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors }); // 如果数据验证失败，返回400 Bad Request
      }
      console.error("Error creating registration:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to create registration" }); // 返回500内部服务器错误
    }
  });

  /**
   * 更新报名状态（仅管理员）
   * 处理 PATCH /api/registrations/:id 请求
   * 需要管理员权限
   */
  app.patch("/api/registrations/:id", async (req, res) => {
    // 检查用户是否已认证且角色为管理员
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" }); // 如果没有管理员权限，返回403 Forbidden
    }

    try {
      const id = parseInt(req.params.id); // 从路由参数中解析出报名记录ID
      const { status } = req.body; // 从请求体中获取状态信息

      // 验证状态值是否有效
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" }); // 如果状态值无效，返回400 Bad Request
      }

      const registration = await storage.updateRegistrationStatus(id, status); // 更新数据库中的报名记录状态
      res.json(registration); // 返回更新后的报名记录
    } catch (error) {
      console.error("Error updating registration status:", error); // 记录错误日志
      res.status(500).json({ message: "Failed to update registration status" }); // 返回500内部服务器错误
    }
  });

  // 创建并返回HTTP服务器实例
  // 这个服务器实例将监听配置的端口并处理到app的请求
  return createServer(app);
}

/**
 * 初始化数据库数据
 * 这个函数会在服务器启动时运行，用于创建默认的管理员用户、赛道和竞赛（如果它们不存在）。
 */
async function initializeData() {
  try {
    // 创建管理员用户（如果不存在）
    const adminExists = await storage.getUserByUsername("admin");
    if (!adminExists) {
      // 哈希密码后存储
      const hashedPassword = await hashPassword("000000");
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "admin",
        university: "管理员",
        email: "admin@example.com"
      });
      console.log("Default admin user created.");
    }

    // 创建默认赛道（如果不存在）
    const tracks = await storage.getAllTracks();
    if (!tracks || tracks.length === 0) {
      const defaultTracks = [
        { // 创新创业赛道
          name: "创新创业赛道",
          description: "针对具有市场潜力和商业价值的创新项目和创业计划",
          icon: "fas fa-lightbulb"
        },
        { // 人工智能赛道
          name: "人工智能赛道",
          description: "专注于人工智能技术在各领域的创新应用和解决方案",
          icon: "fas fa-laptop-code"
        },
        { // 乡村振兴赛道
          name: "乡村振兴赛道",
          description: "围绕乡村振兴战略，提出创新方案和实践项目",
          icon: "fas fa-leaf"
        },
        { // 生物医学赛道
          name: "生物医学赛道",
          description: "聚焦生物医学科技创新，提升健康医疗水平的项目",
          icon: "fas fa-flask"
        }
      ];

      for (const track of defaultTracks) {
        await storage.createTrack(track);
      }
      console.log("Default tracks created.");
    }

    // 创建默认竞赛（如果不存在）
    const competitions = await storage.getAllCompetitions();
    if (!competitions || competitions.length === 0) {
      // 获取第一个赛道的ID用于创建默认竞赛
      const tracks = await storage.getAllTracks();
      if (tracks && tracks.length > 0) {
        const trackId = tracks[0].id;

        await storage.createCompetition({
          title: "2025年（第二届）大学生数据要素素质大赛",
          description: "为深入贯彻中央《提升全民数字素养与技能行动纲要》及《2024年提升全民数字素养与技能工作要点》等一系列文件精神，积极响应国家经济社会数字化转型的迫切需求，加速培养具备高水平数据素养的复合型人才，由全国数据工程教学联盟发起举办'2024年大学生数据要素素质大赛'。",
          imageUrl: "https://obs-cq.cucloud.cn/zeno-videofile/files/20240603/0008a5be-2394-4b60-8a4b-86546e633a85.png",
          trackId: trackId,
          registrationDeadline: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 报名截止日期（当前时间+30天）
          startDate: new Date(), // 竞赛开始日期（当前时间）
          endDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000), // 竞赛结束日期（当前时间+90天）
          status: "active" // 竞赛状态：活动中
        });
        console.log("Default competition created.");
      }
    }
  } catch (error) {
    console.error("Error initializing data:", error); // 记录初始化数据时的错误日志
  }
}

// 在应用启动时调用初始化函数
// initializeData(); // 这个函数可能需要在应用的主文件中调用，而不是在这里直接调用以避免重复初始化
