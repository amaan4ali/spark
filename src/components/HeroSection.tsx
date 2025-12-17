import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MapPin } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-peach/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <span className="text-3xl font-bold text-gradient">FeedMe</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
          Stop overthinking{" "}
          <span className="text-gradient">date night</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto">
          Get 3 perfect date plans in 30 seconds. From dinner to dessert, we've got your evening covered.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            San Francisco
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            AI-Curated Plans
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="hero"
          size="xl"
          onClick={onGetStarted}
          className="mt-8"
        >
          <Heart className="w-5 h-5" />
          Plan a Date
        </Button>

        {/* Trust text */}
        <p className="text-sm text-muted-foreground pt-4">
          🍽️ 40+ curated venues • 🎯 Personalized matches • ✨ Zero stress
        </p>
      </div>
    </section>
  );
}
