import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SessionFlow } from "@/components/SessionFlow";
import { Button } from "@/components/ui/button";
import { Users, Sparkles } from "lucide-react";

type View = "hero" | "session";

function Index() {
  const [currentView, setCurrentView] = useState<View>("hero");

  if (currentView === "session") {
    return <SessionFlow onBack={() => setCurrentView("hero")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-hero flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Spark
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            A spark turns into a plan, a night, a memory.
          </p>
          <p className="text-muted-foreground">
            Share your interests, invite your date, and discover what you'll both love
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            variant="hero"
            size="xl"
            className="w-full gap-3"
            onClick={() => setCurrentView("session")}
          >
            <Users className="w-5 h-5" />
            Start a Session
          </Button>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm">How it works</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">1️⃣</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Pick your interests</h3>
                <p className="text-sm text-muted-foreground">Select categories and specific things you enjoy</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">2️⃣</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Invite your date</h3>
                <p className="text-sm text-muted-foreground">Share a link so they can add their interests too</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">3️⃣</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Swipe together</h3>
                <p className="text-sm text-muted-foreground">See activities matched to both your interests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
