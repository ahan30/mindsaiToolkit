import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share, Play } from "lucide-react";
import type { Tool } from "@/lib/types";

interface ToolCardProps {
  tool: Tool;
  onPreview: (tool: Tool) => void;
  onUse?: (tool: Tool) => void;
  onShare?: (tool: Tool) => void;
  onFavorite?: (tool: Tool) => void;
}

export function ToolCard({ tool, onPreview, onUse, onShare, onFavorite }: ToolCardProps) {
  return (
    <div className="glass-morphism rounded-2xl p-6 tool-card" onClick={() => onPreview(tool)}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{tool.icon}</div>
        <Badge 
          variant={tool.status === 'beta' ? 'secondary' : 'default'}
          className={`px-3 py-1 text-xs font-medium ${
            tool.status === 'beta' 
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
              : 'bg-gradient-to-r from-primary to-secondary text-white'
          }`}
        >
          {tool.status === 'beta' ? 'Beta' : 'AI Powered'}
        </Badge>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-white">{tool.name}</h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{tool.description}</p>
      
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onUse?.(tool);
          }}
          className="text-secondary hover:text-white transition-colors p-0 h-auto font-normal"
        >
          <Play className="w-4 h-4 mr-2" />
          Try Now
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(tool);
            }}
            className="text-gray-400 hover:text-red-400 transition-colors p-1 h-auto"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(tool);
            }}
            className="text-gray-400 hover:text-white transition-colors p-1 h-auto"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
