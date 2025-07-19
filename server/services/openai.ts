import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ToolGenerationRequest {
  description: string;
  category?: string;
  userRequirements?: string[];
}

export interface GeneratedTool {
  name: string;
  description: string;
  category: string;
  icon: string;
  code: string;
  metadata: {
    features: string[];
    complexity: 'simple' | 'medium' | 'complex';
    estimatedTime: string;
    technologies: string[];
  };
}

export async function generateToolWithAI(request: ToolGenerationRequest): Promise<GeneratedTool> {
  try {
    const prompt = `
Create a detailed specification for a digital tool based on this description: "${request.description}"

Analyze the request and generate a comprehensive tool specification. The tool should be practical, useful, and implementable.

Determine the most appropriate category from: pdf, video, ai, image, productivity, security, developer, unique

Respond with JSON in this exact format:
{
  "name": "Tool Name",
  "description": "Detailed description of what the tool does",
  "category": "appropriate category",
  "icon": "appropriate emoji icon",
  "code": "// Complete, functional implementation code\n// This should be a working tool implementation\n// Include all necessary functions and logic\n// Make it production-ready",
  "metadata": {
    "features": ["feature1", "feature2", "feature3"],
    "complexity": "simple|medium|complex",
    "estimatedTime": "time estimate",
    "technologies": ["tech1", "tech2"]
  }
}

Requirements:
- Generate actual, functional code that implements the requested tool
- Make the code production-ready with error handling
- Include comprehensive features based on the description
- Choose appropriate technologies for the implementation
- Ensure the tool is innovative and valuable
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert software architect and tool creator. Generate detailed, functional tools based on user descriptions. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response structure
    if (!result.name || !result.description || !result.category || !result.code) {
      throw new Error('Invalid tool generation response from AI');
    }

    return result as GeneratedTool;
  } catch (error) {
    console.error('Error generating tool with AI:', error);
    throw new Error(`Failed to generate tool: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function enhanceToolDescription(description: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a tool description enhancer. Take basic tool descriptions and make them more detailed, professional, and compelling while maintaining accuracy."
        },
        {
          role: "user",
          content: `Enhance this tool description to be more detailed and compelling: "${description}"`
        }
      ],
      temperature: 0.6,
      max_tokens: 200,
    });

    return response.choices[0].message.content || description;
  } catch (error) {
    console.error('Error enhancing description:', error);
    return description; // Return original if enhancement fails
  }
}

export async function categorizeToolRequest(description: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Categorize the tool request into one of these categories: pdf, video, ai, image, productivity, security, developer, unique. 
          
          Categories:
          - pdf: PDF manipulation, document processing
          - video: Video editing, conversion, processing
          - ai: AI-powered tools, machine learning, automation
          - image: Image editing, graphics, visual processing
          - productivity: Office tools, scheduling, organization
          - security: Encryption, passwords, privacy tools
          - developer: Coding tools, APIs, development utilities
          - unique: Innovative, creative, or unusual tools
          
          Respond with only the category name.`
        },
        {
          role: "user",
          content: `Categorize this tool request: "${description}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 20,
    });

    const category = response.choices[0].message.content?.trim().toLowerCase();
    const validCategories = ['pdf', 'video', 'ai', 'image', 'productivity', 'security', 'developer', 'unique'];
    
    return validCategories.includes(category || '') ? category! : 'unique';
  } catch (error) {
    console.error('Error categorizing tool:', error);
    return 'unique'; // Default category
  }
}
