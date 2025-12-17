import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Sparkles, DollarSign } from "lucide-react";
import { Occasion } from "@/data/venues";

interface FormData {
  city: string;
  budget: 1 | 2 | 3;
  vibe: number;
  occasion: Occasion;
  preferences: string;
}

interface DatePlannerFormProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

const budgetOptions = [
  { value: 1, label: "$", description: "Budget-friendly", icon: "💰" },
  { value: 2, label: "$$", description: "Moderate", icon: "💵" },
  { value: 3, label: "$$$", description: "Treat yourself", icon: "✨" },
] as const;

const occasionOptions = [
  { value: "first-date" as Occasion, label: "First Date", emoji: "💕" },
  { value: "casual" as Occasion, label: "Casual Hangout", emoji: "☕" },
  { value: "anniversary" as Occasion, label: "Anniversary", emoji: "💍" },
  { value: "just-because" as Occasion, label: "Just Because", emoji: "🌟" },
  { value: "surprise" as Occasion, label: "Surprise Date", emoji: "🎁" },
];

const vibeLabels = [
  { value: 1, emoji: "😌", label: "Super Chill" },
  { value: 2, emoji: "🌿", label: "Relaxed" },
  { value: 3, emoji: "⚖️", label: "Balanced" },
  { value: 4, emoji: "🔥", label: "Energetic" },
  { value: 5, emoji: "🎉", label: "Hype!" },
];

export function DatePlannerForm({ onSubmit, onBack }: DatePlannerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    city: "san-francisco",
    budget: 2,
    vibe: 3,
    occasion: "first-date",
    preferences: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const currentVibeLabel = vibeLabels.find((v) => v.value === formData.vibe);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Let's plan your date
          </h1>
          <p className="text-muted-foreground">
            Tell us what you're looking for
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* City Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              📍 Where are you dating?
            </label>
            <Select
              value={formData.city}
              onValueChange={(value) =>
                setFormData({ ...formData, city: value })
              }
            >
              <SelectTrigger className="h-14 rounded-2xl bg-card border-2 border-border hover:border-primary/30 transition-colors">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent className="bg-card border-2 border-border rounded-xl">
                <SelectItem value="san-francisco" className="rounded-lg">
                  🌉 San Francisco
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              💸 What's your budget?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {budgetOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, budget: option.value })
                  }
                  data-active={formData.budget === option.value}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/30 transition-all data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:border-primary data-[active=true]:shadow-soft"
                >
                  <span className="text-2xl mb-1">{option.icon}</span>
                  <span className="text-lg font-bold">{option.label}</span>
                  <span className="text-xs opacity-80">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Slider */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              ✨ What's the vibe?
            </label>
            <div className="bg-card rounded-2xl border-2 border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <span className="text-2xl">😌</span>
                  <p className="text-xs text-muted-foreground mt-1">Chill</p>
                </div>
                <div className="text-center px-4 py-2 rounded-full bg-primary/10">
                  <span className="text-2xl">{currentVibeLabel?.emoji}</span>
                  <p className="text-sm font-medium text-primary">
                    {currentVibeLabel?.label}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-2xl">🎉</span>
                  <p className="text-xs text-muted-foreground mt-1">Hype</p>
                </div>
              </div>
              <Slider
                value={[formData.vibe]}
                onValueChange={(value) =>
                  setFormData({ ...formData, vibe: value[0] })
                }
                min={1}
                max={5}
                step={1}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary-foreground"
              />
            </div>
          </div>

          {/* Occasion Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              🎯 What's the occasion?
            </label>
            <Select
              value={formData.occasion}
              onValueChange={(value) =>
                setFormData({ ...formData, occasion: value as Occasion })
              }
            >
              <SelectTrigger className="h-14 rounded-2xl bg-card border-2 border-border hover:border-primary/30 transition-colors">
                <SelectValue placeholder="Select an occasion" />
              </SelectTrigger>
              <SelectContent className="bg-card border-2 border-border rounded-xl">
                {occasionOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.emoji} {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              💭 Any preferences? <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              value={formData.preferences}
              onChange={(e) =>
                setFormData({ ...formData, preferences: e.target.value })
              }
              placeholder="e.g., vegetarian, no loud bars, loves dessert, walking distance preferred..."
              className="min-h-[100px] rounded-2xl bg-card border-2 border-border hover:border-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full mt-8"
          >
            <Sparkles className="w-5 h-5" />
            Generate My Plans
          </Button>
        </form>
      </div>
    </div>
  );
}
