export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'beta' | 'generating';
  code?: string | null;
  metadata?: any;
  userId?: number | null;
  createdAt?: Date | null;
  usageCount?: number;
}

export interface ToolRequest {
  id: number;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  toolId?: number | null;
  userId?: number | null;
  progress: number;
  errorMessage?: string | null;
  createdAt?: Date | null;
  completedAt?: Date | null;
}

export interface Analytics {
  id: number;
  toolsGenerated: number;
  activeSessions: number;
  successRate: number;
  totalRequests: number;
  updatedAt?: Date | null;
}

export interface ToolCategory {
  name: string;
  count: number;
  icon: string;
  description: string;
}

export interface ToolGenerationProgress {
  step: string;
  progress: number;
  message: string;
}

export interface WebSocketMessage {
  type: 'toolProgress';
  requestId: number;
  progress: ToolGenerationProgress;
}
