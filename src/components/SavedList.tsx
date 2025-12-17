import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { venues } from "@/data/venues";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";

interface SavedListProps {
  sessionId: string;
  onBack: () => void;
}

export function SavedList({ sessionId, onBack }: SavedListProps) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSaved() {
      const { data } = await supabase
        .from("saved_activities")
        .select("venue_id")
        .eq("session_id", sessionId);
      if (data) {
        setSavedIds(data.map((d) => d.venue_id));
      }
    }
    fetchSaved();
  }, [sessionId]);

  const savedVenues = venues.filter((v) => savedIds.includes(v.id));

  const typeEmoji = {
    restaurant: "🍽️",
    activity: "🎭",
    dessert: "🍨",
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to swiping
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Saved Activities 💕
          </h1>
          <p className="text-muted-foreground">
            {savedVenues.length} places you both want to try
          </p>
        </div>

        {savedVenues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No saved activities yet. Keep swiping!
            </p>
            <Button variant="hero" onClick={onBack}>
              Continue Swiping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-card rounded-2xl border border-border p-4 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{typeEmoji[venue.type]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{venue.name}</h3>
                    {venue.cuisine && (
                      <p className="text-sm text-muted-foreground">{venue.cuisine}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{venue.neighborhood}</span>
                      <span>•</span>
                      <span>{"$".repeat(venue.priceLevel)}</span>
                    </div>
                    <p className="text-sm text-foreground mt-2">{venue.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
