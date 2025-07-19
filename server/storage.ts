import { users, tools, toolRequests, analytics, type User, type InsertUser, type Tool, type InsertTool, type ToolRequest, type InsertToolRequest, type Analytics } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tool methods
  getTool(id: number): Promise<Tool | undefined>;
  getToolByName(name: string): Promise<Tool | undefined>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  getAllTools(): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
  getRecentTools(limit?: number): Promise<Tool[]>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: number, updates: Partial<Tool>): Promise<Tool | undefined>;
  incrementToolUsage(id: number): Promise<void>;

  // Tool request methods
  getToolRequest(id: number): Promise<ToolRequest | undefined>;
  getToolRequestsByUser(userId: number): Promise<ToolRequest[]>;
  createToolRequest(request: InsertToolRequest): Promise<ToolRequest>;
  updateToolRequest(id: number, updates: Partial<ToolRequest>): Promise<ToolRequest | undefined>;

  // Analytics methods
  getAnalytics(): Promise<Analytics>;
  updateAnalytics(updates: Partial<Analytics>): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tools: Map<number, Tool>;
  private toolRequests: Map<number, ToolRequest>;
  private analytics: Analytics;
  private currentUserId: number;
  private currentToolId: number;
  private currentRequestId: number;

  constructor() {
    this.users = new Map();
    this.tools = new Map();
    this.toolRequests = new Map();
    this.currentUserId = 1;
    this.currentToolId = 1;
    this.currentRequestId = 1;

    this.analytics = {
      id: 1,
      toolsGenerated: 127,
      activeSessions: 8,
      successRate: 99,
      totalRequests: 1543,
      updatedAt: new Date(),
    };

    // Initialize with some predefined tools
    this.initializeDefaultTools();
  }

  private initializeDefaultTools() {
    const defaultTools: Omit<Tool, 'id' | 'createdAt' | 'usageCount'>[] = [
      // PDF Tools
      { name: 'AI PDF Summarizer', description: 'Extract key points from any PDF using advanced AI', category: 'pdf', icon: '📄', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Smart PDF Merger', description: 'Merge PDFs with intelligent page ordering', category: 'pdf', icon: '🔗', status: 'active', code: null, metadata: null, userId: null },
      { name: 'OCR Text Extractor', description: 'Extract text from images and scanned PDFs', category: 'pdf', icon: '👁️', status: 'active', code: null, metadata: null, userId: null },
      { name: 'PDF Compressor Pro', description: 'Reduce PDF file size without quality loss', category: 'pdf', icon: '🗜️', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Digital Signature Tool', description: 'Add secure digital signatures to documents', category: 'pdf', icon: '✍️', status: 'active', code: null, metadata: null, userId: null },

      // Video Tools
      { name: 'AI Video Enhancer', description: 'Upscale and enhance video quality using AI', category: 'video', icon: '🎬', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Smart Video Trimmer', description: 'Automatically detect and trim video segments', category: 'video', icon: '✂️', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Background Remover', description: 'Remove video backgrounds without green screen', category: 'video', icon: '🎭', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Auto Subtitle Generator', description: 'Generate accurate subtitles using speech AI', category: 'video', icon: '💬', status: 'active', code: null, metadata: null, userId: null },

      // AI Tools
      { name: 'ChatGPT Assistant', description: 'Conversational AI for any task', category: 'ai', icon: '🤖', status: 'active', code: null, metadata: null, userId: null },
      { name: 'AI Image Generator', description: 'Create stunning images from text descriptions', category: 'ai', icon: '🎨', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Voice Cloning Studio', description: 'Clone any voice with just 30 seconds of audio', category: 'ai', icon: '🎙️', status: 'active', code: null, metadata: null, userId: null },
      { name: 'AI Code Generator', description: 'Generate code in any programming language', category: 'ai', icon: '💻', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Smart Data Analyzer', description: 'Analyze datasets and generate insights', category: 'ai', icon: '📊', status: 'active', code: null, metadata: null, userId: null },

      // Image Tools
      { name: 'Background Remover AI', description: 'Remove backgrounds from images instantly', category: 'image', icon: '🖼️', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Image Upscaler Pro', description: 'Enhance image resolution using AI', category: 'image', icon: '🔍', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Photo Style Transfer', description: 'Transform photos into artistic styles', category: 'image', icon: '🎨', status: 'active', code: null, metadata: null, userId: null },

      // Productivity Tools
      { name: 'AI Resume Builder', description: 'Create professional resumes with AI assistance', category: 'productivity', icon: '📋', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Smart Task Scheduler', description: 'AI-powered task and calendar management', category: 'productivity', icon: '📅', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Excel Formula Generator', description: 'Generate complex Excel formulas from descriptions', category: 'productivity', icon: '📊', status: 'active', code: null, metadata: null, userId: null },

      // Unique Tools
      { name: 'Dream Interpreter', description: 'AI analyzes and interprets your dreams', category: 'unique', icon: '🌙', status: 'beta', code: null, metadata: null, userId: null },
      { name: 'Nostalgia Filter', description: 'Transform modern photos to vintage styles', category: 'unique', icon: '📸', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Meme Resurrector', description: 'Revive old memes with modern context', category: 'unique', icon: '😄', status: 'active', code: null, metadata: null, userId: null },
      { name: 'Time Capsule Creator', description: 'Create digital time capsules for the future', category: 'unique', icon: '⏰', status: 'beta', code: null, metadata: null, userId: null },
    ];

    defaultTools.forEach(tool => {
      const newTool: Tool = {
        ...tool,
        id: this.currentToolId++,
        createdAt: new Date(),
        usageCount: Math.floor(Math.random() * 1000),
      };
      this.tools.set(newTool.id, newTool);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Tool methods
  async getTool(id: number): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async getToolByName(name: string): Promise<Tool | undefined> {
    return Array.from(this.tools.values()).find(tool => tool.name === name);
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  async getAllTools(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }

  async getFeaturedTools(): Promise<Tool[]> {
    const allTools = Array.from(this.tools.values());
    return allTools
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 6);
  }

  async getRecentTools(limit = 10): Promise<Tool[]> {
    const allTools = Array.from(this.tools.values());
    return allTools
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.currentToolId++;
    const tool: Tool = {
      name: insertTool.name,
      description: insertTool.description,
      category: insertTool.category,
      icon: insertTool.icon || '🛠️',
      status: insertTool.status || 'active',
      code: insertTool.code || null,
      metadata: insertTool.metadata || null,
      userId: insertTool.userId || null,
      id,
      createdAt: new Date(),
      usageCount: 0,
    };
    this.tools.set(id, tool);
    
    // Update analytics
    this.analytics.toolsGenerated = (this.analytics.toolsGenerated || 0) + 1;
    this.analytics.totalRequests = (this.analytics.totalRequests || 0) + 1;
    
    return tool;
  }

  async updateTool(id: number, updates: Partial<Tool>): Promise<Tool | undefined> {
    const tool = this.tools.get(id);
    if (!tool) return undefined;

    const updatedTool = { ...tool, ...updates };
    this.tools.set(id, updatedTool);
    return updatedTool;
  }

  async incrementToolUsage(id: number): Promise<void> {
    const tool = this.tools.get(id);
    if (tool) {
      const updatedTool = { ...tool, usageCount: (tool.usageCount || 0) + 1 };
      this.tools.set(id, updatedTool);
    }
  }

  // Tool request methods
  async getToolRequest(id: number): Promise<ToolRequest | undefined> {
    return this.toolRequests.get(id);
  }

  async getToolRequestsByUser(userId: number): Promise<ToolRequest[]> {
    return Array.from(this.toolRequests.values()).filter(request => request.userId === userId);
  }

  async createToolRequest(insertRequest: InsertToolRequest): Promise<ToolRequest> {
    const id = this.currentRequestId++;
    const request: ToolRequest = {
      query: insertRequest.query,
      status: insertRequest.status || 'pending',
      toolId: insertRequest.toolId || null,
      userId: insertRequest.userId || null,
      progress: insertRequest.progress || 0,
      errorMessage: insertRequest.errorMessage || null,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.toolRequests.set(id, request);
    return request;
  }

  async updateToolRequest(id: number, updates: Partial<ToolRequest>): Promise<ToolRequest | undefined> {
    const request = this.toolRequests.get(id);
    if (!request) return undefined;

    const updatedRequest = { ...request, ...updates };
    this.toolRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Analytics methods
  async getAnalytics(): Promise<Analytics> {
    return this.analytics;
  }

  async updateAnalytics(updates: Partial<Analytics>): Promise<Analytics> {
    this.analytics = { ...this.analytics, ...updates, updatedAt: new Date() };
    return this.analytics;
  }
}

export const storage = new MemStorage();
