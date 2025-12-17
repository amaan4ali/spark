import { useState, useRef } from "react";
import { MatchedVenue } from "@/lib/matchingEngine";
import { Heart, X, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  venue: MatchedVenue;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

export function SwipeableCard({
  venue,
  onSwipeLeft,
  onSwipeRight,
  isTop,
}: SwipeableCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!isTop) return;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragStart || !isTop) return;
    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleDragEnd = () => {
    if (!isTop) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (dragOffset.x > threshold) {
      onSwipeRight();
    } else if (dragOffset.x < -threshold) {
      onSwipeLeft();
    }
    
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.05;
  const opacity = Math.max(0, 1 - Math.abs(dragOffset.x) / 300);

  const typeEmoji = {
    restaurant: "🍽️",
    activity: "🎭",
    dessert: "🍨",
  }[venue.type];

  const priceString = "$".repeat(venue.priceLevel);

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 rounded-3xl bg-card shadow-card overflow-hidden cursor-grab active:cursor-grabbing",
        !isTop && "pointer-events-none"
      )}
      style={{
        transform: isTop
          ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`
          : "scale(0.95) translateY(10px)",
        opacity: isTop ? opacity : 0.5,
        transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        zIndex: isTop ? 10 : 5,
      }}
      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
      onMouseMove={(e) => isDragging && handleDragMove(e.clientX, e.clientY)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleDragEnd}
    >
      {/* Swipe indicators */}
      <div
        className={cn(
          "absolute top-8 left-8 px-4 py-2 rounded-xl border-4 border-red-500 text-red-500 font-bold text-2xl rotate-[-20deg] transition-opacity",
          dragOffset.x < -50 ? "opacity-100" : "opacity-0"
        )}
      >
        NOPE
      </div>
      <div
        className={cn(
          "absolute top-8 right-8 px-4 py-2 rounded-xl border-4 border-green-500 text-green-500 font-bold text-2xl rotate-[20deg] transition-opacity",
          dragOffset.x > 50 ? "opacity-100" : "opacity-0"
        )}
      >
        LIKE
      </div>

      {/* Card content */}
      <div className="h-full flex flex-col">
        {/* Header gradient */}
        <div className="h-40 gradient-hero flex items-center justify-center">
          <span className="text-7xl">{typeEmoji}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-foreground">{venue.name}</h2>
            <span className="text-lg font-medium text-primary">{priceString}</span>
          </div>

          {venue.cuisine && (
            <p className="text-sm text-muted-foreground mb-2">{venue.cuisine}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{venue.neighborhood}</span>
          </div>

          <p className="text-foreground mb-4">{venue.description}</p>

          {/* Matched interests */}
          {venue.matchedInterests.length > 0 && (
            <div className="mt-auto">
              <p className="text-xs text-muted-foreground mb-2">Matches your interests:</p>
              <div className="flex flex-wrap gap-2">
                {venue.matchedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-4 flex justify-center gap-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeLeft();
            }}
            className="w-16 h-16 rounded-full bg-card border-2 border-red-400 flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeRight();
            }}
            className="w-16 h-16 rounded-full bg-card border-2 border-green-400 flex items-center justify-center hover:bg-green-50 transition-colors shadow-lg"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
