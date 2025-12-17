import { venues, adjacentNeighborhoods, Venue, Occasion } from "@/data/venues";

export interface DatePlan {
  id: string;
  title: string;
  tagline: string;
  restaurant: Venue;
  activity: Venue;
  dessert: Venue;
  explanation: string;
  totalCost: string;
  totalTime: string;
  walkability: string;
}

const planTitles = [
  "The Mission Foodie Trail",
  "Marina Sunset Stroll",
  "North Beach Romance",
  "Hayes Valley Hop",
  "Golden Gate Adventure",
  "Embarcadero Evening",
  "Urban Explorer's Delight",
  "The Art Lover's Path",
  "Neighborhood Gem Hunt",
  "Classic SF Vibes",
  "The Hidden Gem Tour",
  "Coastal Charm Route",
  "City Lights Journey",
  "The Sweet Spot Circuit",
  "Bay Area Bliss",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getVibeDescriptor(vibe: number): string {
  if (vibe <= 2) return "chill and low-key";
  if (vibe === 3) return "balanced and versatile";
  return "energetic and lively";
}

function getOccasionLabel(occasion: Occasion): string {
  const labels: Record<Occasion, string> = {
    "first-date": "a first date",
    "casual": "a casual hangout",
    "anniversary": "an anniversary",
    "surprise": "a surprise date",
    "just-because": "a spontaneous outing",
  };
  return labels[occasion];
}

function calculateCost(
  restaurant: Venue,
  activity: Venue,
  dessert: Venue
): string {
  const baseCosts: Record<number, [number, number]> = {
    1: [15, 25],
    2: [30, 50],
    3: [60, 90],
  };

  const restaurantCost = baseCosts[restaurant.priceLevel];
  const activityCost = activity.priceLevel === 1 ? [0, 10] : baseCosts[activity.priceLevel];
  const dessertCost = baseCosts[dessert.priceLevel];

  const minTotal = restaurantCost[0] + activityCost[0] + dessertCost[0];
  const maxTotal = restaurantCost[1] + activityCost[1] + dessertCost[1];

  return `$${minTotal}-${maxTotal} per person`;
}

function checkWalkability(
  restaurant: Venue,
  activity: Venue,
  dessert: Venue
): string {
  const neighborhoods = [restaurant.neighborhood, activity.neighborhood, dessert.neighborhood];
  
  const restaurantAdjacent = adjacentNeighborhoods[restaurant.neighborhood] || [restaurant.neighborhood];
  const activityAdjacent = adjacentNeighborhoods[activity.neighborhood] || [activity.neighborhood];
  
  const allWalkable = 
    restaurantAdjacent.includes(activity.neighborhood) &&
    activityAdjacent.includes(dessert.neighborhood);
  
  if (allWalkable) {
    return "All within 15 min walk";
  }
  
  const sameArea = new Set(neighborhoods).size <= 2;
  if (sameArea) {
    return "Mostly walkable with short rides";
  }
  
  return "Requires ride between spots";
}

function generateExplanation(
  restaurant: Venue,
  activity: Venue,
  dessert: Venue,
  occasion: Occasion,
  vibe: number,
  budget: number
): string {
  const vibeDesc = getVibeDescriptor(vibe);
  const occasionLabel = getOccasionLabel(occasion);
  
  const neighborhoods = [restaurant.neighborhood, activity.neighborhood, dessert.neighborhood];
  const uniqueNeighborhoods = new Set(neighborhoods);
  
  let locationComment = "";
  if (uniqueNeighborhoods.size === 1) {
    locationComment = `keeps you in ${restaurant.neighborhood} so there's no rushing around`;
  } else if (uniqueNeighborhoods.size === 2) {
    locationComment = `keeps you in just two neighborhoods for easy walking`;
  } else {
    locationComment = `takes you on a tour of the city's best spots`;
  }
  
  const budgetComment = budget === 1 
    ? "Perfect for keeping things affordable without compromising on quality."
    : budget === 3 
      ? "This is a treat-yourself kind of night."
      : "Great balance of quality and value.";
  
  return `You wanted ${occasionLabel} that feels ${vibeDesc}. This plan ${locationComment}. We started with ${restaurant.name} for ${restaurant.cuisine?.toLowerCase() || "great food"} (${restaurant.description.toLowerCase()}), then ${activity.name} for ${activity.activityType?.toLowerCase() || "a fun activity"}, and wrapped up at ${dessert.name} because ${dessert.description.toLowerCase()}. ${budgetComment}`;
}

export function generateDatePlans(
  budget: 1 | 2 | 3,
  vibe: number,
  occasion: Occasion,
  _preferences?: string
): DatePlan[] {
  // Filter venues by criteria
  const filteredRestaurants = venues.filter(
    (v) =>
      v.type === "restaurant" &&
      v.priceLevel <= budget &&
      Math.abs(v.vibeScore - vibe) <= 1 &&
      v.goodFor.includes(occasion)
  );

  const filteredActivities = venues.filter(
    (v) =>
      v.type === "activity" &&
      v.priceLevel <= budget &&
      Math.abs(v.vibeScore - vibe) <= 1 &&
      v.goodFor.includes(occasion)
  );

  const filteredDesserts = venues.filter(
    (v) =>
      v.type === "dessert" &&
      v.priceLevel <= budget &&
      Math.abs(v.vibeScore - vibe) <= 1 &&
      v.goodFor.includes(occasion)
  );

  // Fallback to all venues if filters are too strict
  const restaurants = filteredRestaurants.length >= 3 
    ? filteredRestaurants 
    : venues.filter((v) => v.type === "restaurant" && v.priceLevel <= budget);
  
  const activities = filteredActivities.length >= 3 
    ? filteredActivities 
    : venues.filter((v) => v.type === "activity" && v.priceLevel <= budget);
  
  const desserts = filteredDesserts.length >= 3 
    ? filteredDesserts 
    : venues.filter((v) => v.type === "dessert" && v.priceLevel <= budget);

  // Shuffle for randomness
  const shuffledRestaurants = shuffleArray(restaurants);
  const shuffledActivities = shuffleArray(activities);
  const shuffledDesserts = shuffleArray(desserts);
  const shuffledTitles = shuffleArray(planTitles);

  const plans: DatePlan[] = [];
  const usedVenueIds = new Set<string>();

  for (let i = 0; i < 3; i++) {
    // Find restaurant
    const restaurant = shuffledRestaurants.find((r) => !usedVenueIds.has(r.id));
    if (!restaurant) continue;
    usedVenueIds.add(restaurant.id);

    // Find activity, preferring same/adjacent neighborhood
    const restaurantAdjacent = adjacentNeighborhoods[restaurant.neighborhood] || [restaurant.neighborhood];
    let activity = shuffledActivities.find(
      (a) => !usedVenueIds.has(a.id) && restaurantAdjacent.includes(a.neighborhood)
    );
    if (!activity) {
      activity = shuffledActivities.find((a) => !usedVenueIds.has(a.id));
    }
    if (!activity) continue;
    usedVenueIds.add(activity.id);

    // Find dessert, preferring same/adjacent neighborhood to activity
    const activityAdjacent = adjacentNeighborhoods[activity.neighborhood] || [activity.neighborhood];
    let dessert = shuffledDesserts.find(
      (d) => !usedVenueIds.has(d.id) && activityAdjacent.includes(d.neighborhood)
    );
    if (!dessert) {
      dessert = shuffledDesserts.find((d) => !usedVenueIds.has(d.id));
    }
    if (!dessert) continue;
    usedVenueIds.add(dessert.id);

    const vibeLabel = vibe <= 2 ? "relaxed" : vibe >= 4 ? "lively" : "easygoing";
    const occasionLabel = occasion.replace("-", " ");

    plans.push({
      id: `plan-${i + 1}`,
      title: shuffledTitles[i],
      tagline: `Perfect for ${occasionLabel} • ${vibeLabel} vibes`,
      restaurant,
      activity,
      dessert,
      explanation: generateExplanation(restaurant, activity, dessert, occasion, vibe, budget),
      totalCost: calculateCost(restaurant, activity, dessert),
      totalTime: "~3 hours",
      walkability: checkWalkability(restaurant, activity, dessert),
    });
  }

  return plans;
}
