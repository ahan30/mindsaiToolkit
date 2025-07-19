import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isGenerating?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isGenerating = false, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const suggestions = [
    'YouTube video downloader',
    'AI resume builder',
    'Password generator',
    'Image background remover',
    'PDF merger',
    'QR code generator',
    'Voice changer',
    'Text to speech converter',
    'Excel formula generator',
    'Logo maker',
    'Meme generator',
    'Color palette extractor'
  ];

  const getRandomSuggestion = () => {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      onSearch(query.trim());
    }
  };

  const handleFocus = () => {
    if (!query) {
      const randomSuggestion = getRandomSuggestion();
      setQuery(`Try: "${randomSuggestion}"`);
      setTimeout(() => setQuery(""), 3000);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="glass-morphism rounded-2xl p-8 search-glow">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              placeholder={placeholder || "Describe any tool you need... (e.g., 'Convert YouTube to MP4', 'AI Resume Builder')"}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all focus-glow"
              disabled={isGenerating}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <Button 
            type="submit"
            disabled={!query.trim() || isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Tool
              </>
            )}
          </Button>
        </form>
        <div className="mt-4 text-sm text-gray-400 text-center">
          ✨ AI analyzes requests, checks legality, and builds copyright-safe tools with API integrations
        </div>
      </div>
    </div>
  );
}
