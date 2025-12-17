import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string | null;
}

interface InterestSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  maxSelections?: number;
}

const categoryLabels: Record<string, string> = {
  food: "🍽️ Food",
  drinks: "🍹 Drinks",
  outdoors: "🌲 Outdoors",
  culture: "🎭 Culture",
  entertainment: "🎮 Entertainment",
  nightlife: "🌙 Nightlife",
};

const categoryOrder = ["food", "drinks", "outdoors", "culture", "entertainment", "nightlife"];

export function InterestSelector({
  selectedInterests,
  onInterestsChange,
  maxSelections = 10,
}: InterestSelectorProps) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("food");

  useEffect(() => {
    async function fetchInterests() {
      const { data } = await supabase
        .from("interests")
        .select("*")
        .order("name");
      if (data) setInterests(data);
    }
    fetchInterests();
  }, []);

  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      onInterestsChange(selectedInterests.filter((i) => i !== interestName));
    } else if (selectedInterests.length < maxSelections) {
      onInterestsChange([...selectedInterests, interestName]);
    }
  };

  const groupedInterests = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) acc[interest.category] = [];
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categoryOrder.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Interest pills */}
      <div className="flex flex-wrap gap-2">
        {groupedInterests[activeCategory]?.map((interest) => {
          const isSelected = selectedInterests.includes(interest.name);
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.name)}
              className={cn(
                "px-4 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-2",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card border border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <span>{interest.icon}</span>
              <span>{interest.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selection count */}
      <p className="text-sm text-muted-foreground text-center">
        {selectedInterests.length}/{maxSelections} selected
      </p>
    </div>
  );
}
