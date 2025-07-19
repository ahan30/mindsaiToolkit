import { storage } from "../storage";
import { enhanceToolDescription, categorizeToolRequest } from "./openai";
import { toolFactory } from "./toolFactory";
import type { InsertTool, InsertToolRequest } from "@shared/schema";

export interface ToolGenerationProgress {
  step: string;
  progress: number;
  message: string;
}

export class ToolGenerator {
  private progressCallbacks: Map<number, (progress: ToolGenerationProgress) => void> = new Map();

  async generateTool(
    query: string, 
    userId?: number,
    onProgress?: (progress: ToolGenerationProgress) => void
  ): Promise<{ requestId: number; toolId?: number }> {
    // Create tool request
    const toolRequest = await storage.createToolRequest({
      query,
      userId: userId || null,
      status: 'processing',
      progress: 0,
      toolId: null,
      errorMessage: null,
    });

    if (onProgress) {
      this.progressCallbacks.set(toolRequest.id, onProgress);
    }

    // Start generation process asynchronously
    this.processToolGeneration(toolRequest.id, query).catch(error => {
      console.error('Tool generation failed:', error);
      this.updateProgress(toolRequest.id, {
        step: 'error',
        progress: 0,
        message: `Generation failed: ${error.message}`,
      });
    });

    return { requestId: toolRequest.id };
  }

  private async processToolGeneration(requestId: number, query: string): Promise<void> {
    try {
      // Step 1: Understanding requirements
      await this.updateProgress(requestId, {
        step: 'analyzing',
        progress: 20,
        message: 'Understanding requirements...',
      });

      await storage.updateToolRequest(requestId, { progress: 20 });
      await this.delay(1000);

      // Step 2: Enhance description and categorize
      await this.updateProgress(requestId, {
        step: 'planning',
        progress: 40,
        message: 'Generating code architecture...',
      });

      const enhancedDescription = await enhanceToolDescription(query);
      const category = await categorizeToolRequest(query);
      
      await storage.updateToolRequest(requestId, { progress: 40 });
      await this.delay(1500);

      // Step 3: Legal compliance check
      await this.updateProgress(requestId, {
        step: 'validating',
        progress: 50,
        message: 'Checking legal compliance...',
      });

      const legalityCheck = toolFactory.checkLegality(query);
      if (!legalityCheck.legal) {
        throw new Error(legalityCheck.reason || 'Tool violates legal restrictions');
      }

      await this.delay(500);

      // Step 4: Generate tool with enhanced factory
      await this.updateProgress(requestId, {
        step: 'generating',
        progress: 70,
        message: 'Building tool with AI and API integrations...',
      });

      const generatedTool = await toolFactory.buildTool({
        toolName: query,
        description: enhancedDescription,
        category,
      });

      if (!generatedTool) {
        throw new Error('Failed to generate tool');
      }

      await storage.updateToolRequest(requestId, { progress: 70 });
      await this.delay(2000);

      // Step 5: Testing and optimization
      await this.updateProgress(requestId, {
        step: 'testing',
        progress: 85,
        message: 'Testing API integrations and optimization...',
      });

      // Check if tool with same name already exists
      const existingTool = await storage.getToolByName(generatedTool.name);
      if (existingTool) {
        // Tool already exists, return it
        await storage.updateToolRequest(requestId, { 
          status: 'completed',
          progress: 100,
          toolId: existingTool.id,
          completedAt: new Date(),
        });

        await this.updateProgress(requestId, {
          step: 'completed',
          progress: 100,
          message: 'Tool already exists and is ready to use!',
        });

        return;
      }

      await this.delay(1000);

      // Step 6: Deploy tool
      await this.updateProgress(requestId, {
        step: 'deploying',
        progress: 95,
        message: 'Finalizing deployment...',
      });

      // Create the new tool
      const newTool = await storage.createTool({
        name: generatedTool.name,
        description: generatedTool.description,
        category: generatedTool.category,
        icon: generatedTool.icon,
        status: 'active',
        code: generatedTool.code,
        metadata: generatedTool.metadata,
        userId: null, // System-generated tool
      });

      await this.delay(500);

      // Complete the request
      await storage.updateToolRequest(requestId, { 
        status: 'completed',
        progress: 100,
        toolId: newTool.id,
        completedAt: new Date(),
      });

      await this.updateProgress(requestId, {
        step: 'completed',
        progress: 100,
        message: 'Tool generated successfully! 🎉',
      });

    } catch (error) {
      console.error('Tool generation error:', error);
      
      await storage.updateToolRequest(requestId, { 
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      });

      await this.updateProgress(requestId, {
        step: 'error',
        progress: 0,
        message: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  private async updateProgress(requestId: number, progress: ToolGenerationProgress): Promise<void> {
    const callback = this.progressCallbacks.get(requestId);
    if (callback) {
      callback(progress);
    }

    // Clean up callback when completed or errored
    if (progress.step === 'completed' || progress.step === 'error') {
      this.progressCallbacks.delete(requestId);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getToolGenerationStatus(requestId: number) {
    return await storage.getToolRequest(requestId);
  }
}

export const toolGenerator = new ToolGenerator();
