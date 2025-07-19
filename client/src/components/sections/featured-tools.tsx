import { useQuery } from "@tanstack/react-query";
import { ToolCard } from "@/components/ui/tool-card";
import type { Tool } from "@/lib/types";

interface FeaturedToolsProps {
  onPreview: (tool: Tool) => void;
  onUse?: (tool: Tool) => void;
  onShare?: (tool: Tool) => void;
  onFavorite?: (tool: Tool) => void;
}

export function FeaturedTools({ onPreview, onUse, onShare, onFavorite }: FeaturedToolsProps) {
  const { data: tools, isLoading } = useQuery<Tool[]>({
    queryKey: ['/api/tools/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Featured </span>
              <span className="gradient-text">AI Tools</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="glass-morphism rounded-2xl p-6 loading-shimmer h-48" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Featured </span>
            <span className="gradient-text">AI Tools</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our most popular and powerful AI-generated tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {tools?.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onPreview={onPreview}
              onUse={onUse}
              onShare={onShare}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
