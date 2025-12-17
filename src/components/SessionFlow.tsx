import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InterestSelector } from "./InterestSelector";
import { SwipeView } from "./SwipeView";
import { SavedList } from "./SavedList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, Check, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMatchedVenues, getSharedInterests } from "@/lib/matchingEngine";

type FlowStep = "name" | "interests" | "waiting" | "swiping" | "saved";

interface SessionFlowProps {
  sessionCode?: string;
  onBack: () => void;
}

export function SessionFlow({ sessionCode, onBack }: SessionFlowProps) {
  const [step, setStep] = useState<FlowStep>("name");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [code, setCode] = useState(sessionCode || "");
  const [isCreator, setIsCreator] = useState(!sessionCode);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerInterests, setPartnerInterests] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Join existing session if code provided
  useEffect(() => {
    if (sessionCode) {
      joinSession(sessionCode);
    }
  }, [sessionCode]);

  const joinSession = async (joinCode: string) => {
    const { data: session } = await supabase
      .from("sessions")
      .select("*")
      .eq("code", joinCode)
      .maybeSingle();

    if (session) {
      setSessionId(session.id);
      setCode(session.code);
      setIsCreator(false);
      if (session.creator_name) {
        setPartnerName(session.creator_name);
      }
    } else {
      toast({
        title: "Session not found",
        description: "Please check the invite link",
        variant: "destructive",
      });
      onBack();
    }
  };

  const createSession = async () => {
    const { data: session, error } = await supabase
      .from("sessions")
      .insert({ creator_name: name })
      .select()
      .single();

    if (session) {
      setSessionId(session.id);
      setCode(session.code);
    }
  };

  const saveInterests = async () => {
    if (!sessionId) return;

    // Get interest IDs
    const { data: allInterests } = await supabase
      .from("interests")
      .select("id, name");

    if (!allInterests) return;

    const interestIds = interests
      .map((name) => allInterests.find((i) => i.name === name)?.id)
      .filter(Boolean);

    // Save to session_interests
    await supabase.from("session_interests").insert(
      interestIds.map((id) => ({
        session_id: sessionId,
        interest_id: id,
        is_creator: isCreator,
      }))
    );

    // Update session with partner name if joining
    if (!isCreator) {
      await supabase
        .from("sessions")
        .update({ partner_name: name, status: "active" })
        .eq("id", sessionId);
    }
  };

  const handleNameSubmit = async () => {
    if (!name.trim()) return;

    if (isCreator) {
      await createSession();
    } else if (sessionId) {
      // Partner joining - just continue
    }
    setStep("interests");
  };

  const handleInterestsSubmit = async () => {
    if (interests.length < 3) {
      toast({
        title: "Select more interests",
        description: "Please pick at least 3 interests",
        variant: "destructive",
      });
      return;
    }

    await saveInterests();

    if (isCreator) {
      setStep("waiting");
    } else {
      // Partner - fetch creator interests and start swiping
      await fetchPartnerInterests();
      setStep("swiping");
    }
  };

  const fetchPartnerInterests = async () => {
    if (!sessionId) return;

    const { data } = await supabase
      .from("session_interests")
      .select("interest_id, is_creator, interests(name)")
      .eq("session_id", sessionId)
      .eq("is_creator", isCreator ? false : true);

    if (data) {
      const names = data
        .map((d) => (d.interests as any)?.name)
        .filter(Boolean);
      setPartnerInterests(names);
    }
  };

  // Real-time subscription for waiting room
  useEffect(() => {
    if (step !== "waiting" || !sessionId) return;

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        async (payload) => {
          const session = payload.new as any;
          if (session.status === "active" && session.partner_name) {
            setPartnerName(session.partner_name);
            await fetchPartnerInterests();
            setStep("swiping");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [step, sessionId]);

  const copyInviteLink = () => {
    const link = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied!" });
  };

  const matchedVenues = getMatchedVenues(interests, partnerInterests);
  const sharedInterests = getSharedInterests(interests, partnerInterests);

  // Render steps
  if (step === "swiping" && sessionId) {
    return (
      <SwipeView
        venues={matchedVenues}
        sessionId={sessionId}
        sharedInterests={sharedInterests}
        onBack={onBack}
        onViewSaved={() => setStep("saved")}
      />
    );
  }

  if (step === "saved" && sessionId) {
    return (
      <SavedList sessionId={sessionId} onBack={() => setStep("swiping")} />
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {step === "name" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isCreator ? "Start a Session" : "Join Session"}
              </h1>
              <p className="text-muted-foreground">
                {isCreator
                  ? "Enter your name to create an invite link"
                  : `You're joining ${partnerName || "a friend"}'s session`}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-lg"
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleNameSubmit}
                disabled={!name.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "interests" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Pick Your Interests
              </h1>
              <p className="text-muted-foreground">
                Select things you enjoy doing
              </p>
            </div>

            <InterestSelector
              selectedInterests={interests}
              onInterestsChange={setInterests}
            />

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleInterestsSubmit}
              disabled={interests.length < 3}
            >
              {isCreator ? "Get Invite Link" : "Start Matching"}
            </Button>
          </div>
        )}

        {step === "waiting" && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-hero flex items-center justify-center">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Waiting for your date
            </h1>
            <p className="text-muted-foreground">
              Share this link with the person you're going out with
            </p>

            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Invite link:</p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/join/${code}`}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyInviteLink}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Waiting for them to join...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
