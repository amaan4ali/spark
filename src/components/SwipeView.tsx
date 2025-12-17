import { useState, useEffect } from "react";
import { MatchedVenue } from "@/lib/matchingEngine";
import { SwipeableCard } from "./SwipeableCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SwipeViewProps {
  venues: MatchedVenue[];
  sessionId: string;
  sharedInterests: string[];
  onBack: () => void;
  onViewSaved: () => void;
}

export function SwipeView({
  venues,
  sessionId,
  sharedInterests,
  onBack,
  onViewSaved,
}: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const { toast } = useToast();

  const currentVenue = venues[currentIndex];
  const nextVenue = venues[currentIndex + 1];

  const handleSwipeLeft = () => {
    if (currentIndex < venues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = async () => {
    if (currentVenue) {
      await supabase.from("saved_activities").insert({
        session_id: sessionId,
        venue_id: currentVenue.id,
      });
      setSavedCount((c) => c + 1);
      toast({
        title: "Added to your list! 💕",
        description: currentVenue.name,
      });
    }
    if (currentIndex < venues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isComplete = currentIndex >= venues.length;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-hero flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            You've seen them all!
          </h1>
          <p className="text-muted-foreground mb-8">
            You saved {savedCount} activities to your list.
          </p>
          <div className="space-y-3">
            <Button variant="hero" size="lg" className="w-full" onClick={onViewSaved}>
              <Heart className="w-5 h-5 mr-2" />
              View Saved ({savedCount})
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={onBack}>
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={onViewSaved}
            className="flex items-center gap-2 text-primary font-medium"
          >
            <Heart className="w-4 h-4" />
            Saved ({savedCount})
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Finding matches</span>
            <span>
              {currentIndex + 1} / {venues.length}
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentIndex + 1) / venues.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Shared interests banner */}
        {sharedInterests.length > 0 && (
          <div className="mb-4 p-3 bg-primary/10 rounded-2xl">
            <p className="text-xs text-primary font-medium mb-1">
              ✨ You both like:
            </p>
            <div className="flex flex-wrap gap-1">
              {sharedInterests.slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
              {sharedInterests.length > 5 && (
                <span className="text-xs text-primary">
                  +{sharedInterests.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Card stack */}
        <div className="relative h-[500px]">
          {nextVenue && (
            <SwipeableCard
              key={nextVenue.id}
              venue={nextVenue}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
              isTop={false}
            />
          )}
          {currentVenue && (
            <SwipeableCard
              key={currentVenue.id}
              venue={currentVenue}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTop={true}
            />
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Swipe right to save, left to skip
        </p>
      </div>
    </div>
  );
}
