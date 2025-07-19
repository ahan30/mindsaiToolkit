import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, Activity, Users, TrendingUp } from "lucide-react";
import type { Tool, Analytics } from "@/lib/types";

interface WorkspaceProps {
  onGenerateNew: () => void;
  onToolClick: (tool: Tool) => void;
}

export function Workspace({ onGenerateNew, onToolClick }: WorkspaceProps) {
  const { data: recentTools, isLoading: toolsLoading } = useQuery<Tool[]>({
    queryKey: ['/api/tools/recent'],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ['/api/analytics'],
  });

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="glass-morphism rounded-3xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Your Workspace</span>
            </h2>
            <p className="text-lg text-gray-300">
              Manage your generated tools and track usage analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Tools */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Recent Tools</h3>
                  <Button 
                    variant="ghost" 
                    onClick={onGenerateNew}
                    className="text-secondary hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {toolsLoading ? (
                    Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="loading-shimmer bg-white/5 rounded-xl h-16" />
                    ))
                  ) : recentTools?.length ? (
                    recentTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => onToolClick(tool)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                            <span className="text-lg">{tool.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{tool.name}</h4>
                            <p className="text-sm text-gray-400">
                              {tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'N/A'} • {tool.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-green-400 border-green-400/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            ready
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-4">🛠️</div>
                      <p>No tools generated yet</p>
                      <Button 
                        variant="ghost" 
                        onClick={onGenerateNew}
                        className="mt-4 text-secondary hover:text-white"
                      >
                        Generate Your First Tool
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-6">
              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-secondary" />
                  Usage Analytics
                </h3>
                {analyticsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} className="loading-shimmer bg-white/5 rounded-lg h-12" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tools Generated</span>
                      <span className="text-2xl font-bold text-secondary">
                        {analytics?.toolsGenerated || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Active Sessions</span>
                      <span className="text-2xl font-bold text-primary">
                        {analytics?.activeSessions || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-2xl font-bold text-green-400">
                        {analytics?.successRate || 0}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Engine</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tool Factory</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      Ready
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Legal Compliance</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">API Integrations</span>
                    <span className="flex items-center text-secondary">
                      <div className="w-2 h-2 bg-secondary rounded-full mr-2" />
                      4 Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database</span>
                    <span className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
