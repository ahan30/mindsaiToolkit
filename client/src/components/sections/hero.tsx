import { SearchBar } from "@/components/ui/search-bar";

interface HeroProps {
  onSearch: (query: string) => void;
  isGenerating?: boolean;
}

export function Hero({ onSearch, isGenerating }: HeroProps) {
  const stats = [
    { value: "1000+", label: "Legal Tools" },
    { value: "AI+API", label: "Integration" },
    { value: "24/7", label: "Generation" },
    { value: "✓", label: "Compliant" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Animated particles */}
      <div className="ai-particles">
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i + 1) * 10}%`,
              animationDelay: `${i}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="gradient-text">AI That Builds</span>
            <br />
            <span className="text-white">Tools Automatically</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Revolutionary AI-powered toolhub with legal compliance and API integrations. 
            From PDF processors to AI assistants - copyright-safe tools built instantly with enterprise APIs.
          </p>

          <SearchBar 
            onSearch={onSearch} 
            isGenerating={isGenerating}
            placeholder="Describe any tool you need... (e.g., 'Convert YouTube to MP4', 'AI Resume Builder')"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-morphism rounded-xl p-6 text-center">
                <div className={`text-3xl font-bold ${
                  index % 2 === 0 ? 'text-secondary' : 'text-primary'
                }`}>
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
