import { useQuery } from "@tanstack/react-query";
import { ToolCard } from "@/components/ui/tool-card";
import { ArrowRight } from "lucide-react";
import type { ToolCategory } from "@/lib/types";

interface ToolCategoriesProps {
  onCategoryClick: (category: string) => void;
}

export function ToolCategories({ onCategoryClick }: ToolCategoriesProps) {
  const { data: categories, isLoading } = useQuery<ToolCategory[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Tool Categories</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="glass-morphism rounded-2xl p-6 loading-shimmer h-32" />
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
            <span className="gradient-text">Tool Categories</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive collection of AI-powered tools across all categories. 
            Can't find what you need? Our AI will build it for you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories?.map((category) => (
            <div
              key={category.name}
              className="glass-morphism rounded-2xl p-6 tool-card cursor-pointer"
              onClick={() => onCategoryClick(category.name)}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2 capitalize">{category.name} Tools</h3>
              <p className="text-gray-300 text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">{category.count} tools</span>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
