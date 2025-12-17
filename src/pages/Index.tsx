import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DatePlannerForm } from "@/components/DatePlannerForm";
import { ResultsPage } from "@/components/ResultsPage";
import { generateDatePlans, DatePlan } from "@/lib/planGenerator";
import { Occasion } from "@/data/venues";

type View = "hero" | "form" | "results";

interface FormData {
  city: string;
  budget: 1 | 2 | 3;
  vibe: number;
  occasion: Occasion;
  preferences: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("hero");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [plans, setPlans] = useState<DatePlan[]>([]);

  const handleGetStarted = () => {
    setCurrentView("form");
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    const generatedPlans = generateDatePlans(
      data.budget,
      data.vibe,
      data.occasion,
      data.preferences
    );
    setPlans(generatedPlans);
    setCurrentView("results");
  };

  const handleBackToForm = () => {
    setCurrentView("form");
  };

  const handleBackToHero = () => {
    setCurrentView("hero");
  };

  const handleRegenerate = () => {
    if (formData) {
      const newPlans = generateDatePlans(
        formData.budget,
        formData.vibe,
        formData.occasion,
        formData.preferences
      );
      setPlans(newPlans);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === "hero" && (
        <HeroSection onGetStarted={handleGetStarted} />
      )}
      {currentView === "form" && (
        <DatePlannerForm onSubmit={handleFormSubmit} onBack={handleBackToHero} />
      )}
      {currentView === "results" && (
        <ResultsPage
          plans={plans}
          onBack={handleBackToForm}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};

export default Index;
