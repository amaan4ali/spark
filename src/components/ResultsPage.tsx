import { useState } from "react";
import { DatePlan } from "@/lib/planGenerator";
import { DatePlanCard } from "@/components/DatePlanCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsPageProps {
  plans: DatePlan[];
  onBack: () => void;
  onRegenerate: () => void;
}

export function ResultsPage({ plans, onBack, onRegenerate }: ResultsPageProps) {
  const [lovedPlan, setLovedPlan] = useState<DatePlan | null>(null);
  const { toast } = useToast();

  const handleLove = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setLovedPlan(plan);
      toast({
        title: "Date saved! 💕",
        description: `"${plan.title}" is ready for your perfect night out.`,
      });
    }
  };

  const handleSkip = (planId: string) => {
    toast({
      description: "Skipped! Check out the other plans below.",
    });
  };

  if (lovedPlan) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Success State */}
          <div className="text-center py-12 animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-hero flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              You're all set!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your date plan is ready. Have an amazing time!
            </p>

            {/* Selected Plan Summary */}
            <div className="bg-card rounded-3xl border-2 border-primary/20 shadow-card p-6 text-left mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {lovedPlan.title}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍽️</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {lovedPlan.restaurant.name}
                    </p>
                    <p className="text-sm text-muted-foreground">6:30pm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎭</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {lovedPlan.activity.name}
                    </p>
                    <p className="text-sm text-muted-foreground">8:00pm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍨</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {lovedPlan.dessert.name}
                    </p>
                    <p className="text-sm text-muted-foreground">9:30pm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => setLovedPlan(null)}
              >
                View All Plans Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onBack}
              >
                Plan Another Date
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Change preferences
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your date plans ✨
          </h1>
          <p className="text-muted-foreground">
            Here are 3 curated plans for your perfect night
          </p>
        </div>

        {/* Plans */}
        <div className="space-y-6">
          {plans.map((plan, index) => (
            <DatePlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onLove={handleLove}
              onSkip={handleSkip}
            />
          ))}
        </div>

        {/* Regenerate */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onRegenerate}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Show Me Different Plans
          </Button>
        </div>
      </div>
    </div>
  );
}
