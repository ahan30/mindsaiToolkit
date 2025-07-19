import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { toolGenerator } from "./services/toolGenerator";
import { toolFactory } from "./services/toolFactory";
import { z } from "zod";

const generateToolSchema = z.object({
  query: z.string().min(1, "Query is required"),
  userId: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time tool generation updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('WebSocket message received:', data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast progress updates to connected clients
  const broadcastProgress = (requestId: number, progress: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'toolProgress',
          requestId,
          progress,
        }));
      }
    });
  };

  // API Routes

  // Get all tools
  app.get('/api/tools', async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
      res.status(500).json({ error: 'Failed to fetch tools' });
    }
  });

  // Get tools by category
  app.get('/api/tools/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const tools = await storage.getToolsByCategory(category);
      res.json(tools);
    } catch (error) {
      console.error('Error fetching tools by category:', error);
      res.status(500).json({ error: 'Failed to fetch tools' });
    }
  });

  // Get featured tools
  app.get('/api/tools/featured', async (req, res) => {
    try {
      const tools = await storage.getFeaturedTools();
      res.json(tools);
    } catch (error) {
      console.error('Error fetching featured tools:', error);
      res.status(500).json({ error: 'Failed to fetch featured tools' });
    }
  });

  // Get recent tools
  app.get('/api/tools/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const tools = await storage.getRecentTools(limit);
      res.json(tools);
    } catch (error) {
      console.error('Error fetching recent tools:', error);
      res.status(500).json({ error: 'Failed to fetch recent tools' });
    }
  });

  // Get specific tool
  app.get('/api/tools/:id', async (req, res) => {
    try {
      const toolId = parseInt(req.params.id);
      const tool = await storage.getTool(toolId);
      
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      // Increment usage count
      await storage.incrementToolUsage(toolId);
      
      res.json(tool);
    } catch (error) {
      console.error('Error fetching tool:', error);
      res.status(500).json({ error: 'Failed to fetch tool' });
    }
  });

  // Search tools
  app.get('/api/tools/search/:query', async (req, res) => {
    try {
      const { query } = req.params;
      const allTools = await storage.getAllTools();
      
      // Simple fuzzy search
      const searchResults = allTools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );

      res.json(searchResults);
    } catch (error) {
      console.error('Error searching tools:', error);
      res.status(500).json({ error: 'Failed to search tools' });
    }
  });

  // Generate new tool
  app.post('/api/tools/generate', async (req, res) => {
    try {
      const validatedData = generateToolSchema.parse(req.body);
      
      const result = await toolGenerator.generateTool(
        validatedData.query,
        validatedData.userId,
        (progress) => {
          // Broadcast progress to WebSocket clients
          broadcastProgress(result.requestId, progress);
        }
      );

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      
      console.error('Error generating tool:', error);
      res.status(500).json({ error: 'Failed to generate tool' });
    }
  });

  // Get tool generation status
  app.get('/api/requests/:id', async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getToolRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json(request);
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).json({ error: 'Failed to fetch request' });
    }
  });

  // Get analytics
  app.get('/api/analytics', async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Get tool categories with counts
  app.get('/api/categories', async (req, res) => {
    try {
      const allTools = await storage.getAllTools();
      const categories = ['pdf', 'video', 'ai', 'image', 'productivity', 'security', 'developer', 'unique'];
      
      const categoryCounts = categories.map(category => ({
        name: category,
        count: allTools.filter(tool => tool.category === category).length,
        icon: getCategoryIcon(category),
        description: getCategoryDescription(category),
      }));

      res.json(categoryCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Get available API integrations
  app.get('/api/integrations', async (req, res) => {
    try {
      const availableAPIs = toolFactory.getAvailableAPIs();
      res.json(availableAPIs);
    } catch (error) {
      console.error('Error fetching API integrations:', error);
      res.status(500).json({ error: 'Failed to fetch API integrations' });
    }
  });

  // Check tool legality
  app.post('/api/tools/check-legality', async (req, res) => {
    try {
      const { toolName } = req.body;
      if (!toolName) {
        return res.status(400).json({ error: 'Tool name is required' });
      }
      
      const legalityCheck = toolFactory.checkLegality(toolName);
      res.json(legalityCheck);
    } catch (error) {
      console.error('Error checking tool legality:', error);
      res.status(500).json({ error: 'Failed to check tool legality' });
    }
  });

  // Get system status including compliance and API health
  app.get('/api/system/status', async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      const systemStatus = {
        aiEngine: 'online',
        toolFactory: 'ready',
        database: 'synced',
        legalCompliance: 'active',
        apiIntegrations: Object.keys(toolFactory.getAvailableAPIs()).length,
        totalTools: analytics.toolsGenerated,
        successRate: analytics.successRate,
        lastUpdate: new Date().toISOString()
      };
      
      res.json(systemStatus);
    } catch (error) {
      console.error('Error fetching system status:', error);
      res.status(500).json({ error: 'Failed to fetch system status' });
    }
  });

  return httpServer;
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    pdf: '📄',
    video: '🎥',
    ai: '🤖',
    image: '🖼️',
    productivity: '📊',
    security: '🔐',
    developer: '💻',
    unique: '✨',
  };
  return icons[category] || '🛠️';
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    pdf: 'Merge, split, compress, OCR, and AI analysis',
    video: 'Edit, convert, compress, and AI enhancement',
    ai: 'GPT assistants, image generation, analysis',
    image: 'Edit, enhance, background removal, AI art',
    productivity: 'Automation, scheduling, AI writing',
    security: 'Encryption, password management, VPN',
    developer: 'Code generation, API testing, debugging',
    unique: 'Revolutionary tools found nowhere else',
  };
  return descriptions[category] || 'Innovative digital tools';
}
