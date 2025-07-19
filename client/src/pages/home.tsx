import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

import { Hero } from "@/components/sections/hero";
import { ToolCategories } from "@/components/sections/tool-categories";
import { FeaturedTools } from "@/components/sections/featured-tools";
import { Workspace } from "@/components/sections/workspace";
import { GenerationModal } from "@/components/ui/generation-modal";
import { PreviewModal } from "@/components/ui/preview-modal";

import type { Tool, ToolGenerationProgress, WebSocketMessage } from "@/lib/types";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<ToolGenerationProgress>({
    step: 'analyzing',
    progress: 0,
    message: 'Starting generation...',
  });
  const [currentToolName, setCurrentToolName] = useState("");
  const [previewTool, setPreviewTool] = useState<Tool | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // WebSocket connection for real-time updates
  useWebSocket((message: WebSocketMessage) => {
    if (message.type === 'toolProgress' && message.requestId === currentRequestId) {
      setGenerationProgress(message.progress);
      
      if (message.progress.step === 'completed') {
        setTimeout(() => {
          setIsGenerating(false);
          // Refresh tools lists
          queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
          queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
          
          toast({
            title: "Tool Generated Successfully! 🎉",
            description: `Your "${currentToolName}" tool is ready to use.`,
          });
        }, 1500);
      } else if (message.progress.step === 'error') {
        setTimeout(() => {
          setIsGenerating(false);
          toast({
            title: "Generation Failed",
            description: message.progress.message,
            variant: "destructive",
          });
        }, 1000);
      }
    }
  });

  const generateToolMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('POST', '/api/tools/generate', { query });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentRequestId(data.requestId);
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = (query: string) => {
    if (isGenerating) return;
    
    setCurrentToolName(query);
    setIsGenerating(true);
    setGenerationProgress({
      step: 'analyzing',
      progress: 0,
      message: 'Understanding requirements...',
    });
    
    generateToolMutation.mutate(query);
  };

  const handleCloseGenerationModal = () => {
    setIsGenerating(false);
    setCurrentRequestId(null);
  };

  const handlePreviewTool = (tool: Tool) => {
    setPreviewTool(tool);
  };

  const handleClosePreviewModal = () => {
    setPreviewTool(null);
  };

  const handleUseTool = (tool: Tool) => {
    // Increment usage count
    apiRequest('GET', `/api/tools/${tool.id}`);
    toast({
      title: "Tool Activated",
      description: `${tool.name} is now running!`,
    });
  };

  const handleShareTool = (tool: Tool) => {
    const shareUrl = `${window.location.origin}/tool/${tool.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share Link Copied",
      description: "Tool share link has been copied to clipboard.",
    });
  };

  const handleFavoriteTool = (tool: Tool) => {
    toast({
      title: "Added to Favorites",
      description: `${tool.name} has been saved to your favorites.`,
    });
  };

  const handleCategoryClick = (category: string) => {
    // TODO: Navigate to category page or filter tools
    toast({
      title: "Category Selected",
      description: `Showing ${category} tools`,
    });
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Background Elements */}
      <div className="fixed inset-0 gradient-bg" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">MindsAI</h1>
                <p className="text-xs text-gray-300">ToolsHub</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-300 hover:text-white transition-colors">Tools</button>
              <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
              <button className="text-gray-300 hover:text-white transition-colors">Analytics</button>
              <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium hover:shadow-lg transition-all">
                Owner Panel
              </button>
            </div>
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <Hero onSearch={handleSearch} isGenerating={isGenerating} />
        <ToolCategories onCategoryClick={handleCategoryClick} />
        <FeaturedTools 
          onPreview={handlePreviewTool}
          onUse={handleUseTool}
          onShare={handleShareTool}
          onFavorite={handleFavoriteTool}
        />
        <Workspace 
          onGenerateNew={scrollToSearch}
          onToolClick={handlePreviewTool}
        />
      </main>

      {/* Modals */}
      <GenerationModal
        isOpen={isGenerating}
        onClose={handleCloseGenerationModal}
        toolName={currentToolName}
        progress={generationProgress}
      />

      <PreviewModal
        isOpen={!!previewTool}
        onClose={handleClosePreviewModal}
        tool={previewTool}
        onUse={handleUseTool}
        onShare={handleShareTool}
        onFavorite={handleFavoriteTool}
      />
    </div>
  );
}
