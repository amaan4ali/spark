import { DatePlan } from "@/lib/planGenerator";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  DollarSign,
  MapPin,
  Footprints,
  Sparkles,
} from "lucide-react";

interface DatePlanCardProps {
  plan: DatePlan;
  index: number;
  onLove: (planId: string) => void;
  onSkip: (planId: string) => void;
}

function getPriceString(level: number): string {
  return "$".repeat(level);
}

export function DatePlanCard({ plan, index, onLove, onSkip }: DatePlanCardProps) {
  return (
    <div
      className="bg-card rounded-3xl border-2 border-border shadow-card overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div className="gradient-hero p-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
            <p className="text-sm opacity-90">{plan.tagline}</p>
          </div>
          <div className="bg-primary-foreground/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            Plan {index + 1}
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="p-6 space-y-4">
        {/* Restaurant */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
            🍽️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                6:30pm
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Dinner</span>
            </div>
            <h4 className="font-semibold text-foreground truncate">
              {plan.restaurant.name}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{plan.restaurant.cuisine}</span>
              <span>•</span>
              <span className="text-primary font-medium">
                {getPriceString(plan.restaurant.priceLevel)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {plan.restaurant.description}
            </p>
          </div>
        </div>

        {/* Connector line */}
        <div className="ml-6 border-l-2 border-dashed border-border h-4" />

        {/* Activity */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
            🎭
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                8:00pm
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Activity</span>
            </div>
            <h4 className="font-semibold text-foreground truncate">
              {plan.activity.name}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{plan.activity.activityType}</span>
              <span>•</span>
              <span className="text-primary font-medium">
                {plan.activity.priceLevel === 1
                  ? "Free/$"
                  : getPriceString(plan.activity.priceLevel)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {plan.activity.description}
            </p>
          </div>
        </div>

        {/* Connector line */}
        <div className="ml-6 border-l-2 border-dashed border-border h-4" />

        {/* Dessert */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
            🍨
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                9:30pm
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Dessert</span>
            </div>
            <h4 className="font-semibold text-foreground truncate">
              {plan.dessert.name}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{plan.dessert.cuisine}</span>
              <span>•</span>
              <span className="text-primary font-medium">
                {getPriceString(plan.dessert.priceLevel)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {plan.dessert.description}
            </p>
          </div>
        </div>

        {/* Why we picked this */}
        <div className="mt-6 p-4 rounded-2xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              Why we picked this
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plan.explanation}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">{plan.totalCost}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">{plan.totalTime}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm">
            <Footprints className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">{plan.walkability}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-3">
        <Button
          variant="plan"
          size="lg"
          className="flex-1"
          onClick={() => onLove(plan.id)}
        >
          <Heart className="w-4 h-4" />
          Love This Plan
        </Button>
        <Button
          variant="skip"
          size="lg"
          onClick={() => onSkip(plan.id)}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
