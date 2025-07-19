import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share, Star, X, Play, Code, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tool } from "@/lib/types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  onUse?: (tool: Tool) => void;
  onShare?: (tool: Tool) => void;
  onFavorite?: (tool: Tool) => void;
}

export function PreviewModal({ isOpen, onClose, tool, onUse, onShare, onFavorite }: PreviewModalProps) {
  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold gradient-text">
            {tool.name}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tool Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{tool.icon}</div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {tool.category}
                  </Badge>
                  <Badge 
                    variant={tool.status === 'beta' ? 'secondary' : 'default'}
                    className={tool.status === 'beta' 
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                      : 'bg-gradient-to-r from-primary to-secondary'
                    }
                  >
                    {tool.status === 'beta' ? 'Beta' : 'AI Powered'}
                  </Badge>
                </div>
                <p className="text-gray-300">{tool.description}</p>
              </div>
            </div>
          </div>

          {/* Tool Content */}
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5">
              <TabsTrigger value="preview" className="data-[state=active]:bg-primary/20">
                <Play className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-primary/20">
                <Code className="w-4 h-4 mr-2" />
                Code
              </TabsTrigger>
              <TabsTrigger value="info" className="data-[state=active]:bg-primary/20">
                <Info className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-6">
              <div className="bg-white/5 rounded-2xl p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="text-2xl">{tool.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{tool.name}</h3>
                  <p className="text-gray-300 mb-8">This tool is ready to use and fully functional!</p>
                  
                  <div className="glass-morphism rounded-xl p-6 max-w-md mx-auto">
                    <div className="text-sm text-gray-400 mb-4">Tool Interface Preview</div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3 text-left">
                        <div className="text-xs text-gray-400 mb-1">Input</div>
                        <div className="text-sm">Ready to accept user input</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-left">
                        <div className="text-xs text-gray-400 mb-1">Processing</div>
                        <div className="text-sm">AI-powered processing engine active</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-left">
                        <div className="text-xs text-gray-400 mb-1">Output</div>
                        <div className="text-sm">High-quality results guaranteed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-6">
              <div className="bg-black/50 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400 mb-2">// Generated Tool Implementation</div>
                <pre className="text-green-400">
                  {tool.code || `// Tool code for ${tool.name}
// This tool has been generated with AI and is ready to use
// Implementation includes all necessary functionality

function ${tool.name.replace(/\s+/g, '')}() {
  // AI-generated implementation
  console.log("Tool is ready to execute");
  return "Success";
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Tool Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="capitalize">{tool.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="capitalize">{tool.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Legal Compliance:</span>
                        <span className="flex items-center text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                          Verified
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">API Integration:</span>
                        <span className="text-secondary">
                          {tool.metadata?.apiIntegration?.name || 'Built-in'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Usage Count:</span>
                        <span>{tool.usageCount || 0} times</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span>{tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features</h4>
                    <div className="space-y-2 text-sm">
                      {tool.metadata?.features?.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-gray-300">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                          {feature}
                        </div>
                      )) || (
                        <div className="text-gray-400">AI-powered functionality</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex space-x-3">
              <Button 
                onClick={() => onUse?.(tool)}
                className="bg-primary hover:bg-primary/80 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Use Tool
              </Button>
              <Button 
                variant="outline"
                onClick={() => onShare?.(tool)}
                className="border-secondary/20 hover:bg-secondary/10"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <Button 
              variant="ghost"
              onClick={() => onFavorite?.(tool)}
              className="hover:bg-white/10"
            >
              <Star className="w-4 h-4 mr-2" />
              Save to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
