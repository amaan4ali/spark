import { venues, Venue } from "@/data/venues";

export interface MatchedVenue extends Venue {
  matchScore: number;
  matchedInterests: string[];
}

// Map interests to venue attributes
const interestToVenueMap: Record<string, (v: Venue) => boolean> = {
  // Food
  'Italian': (v) => v.cuisine?.toLowerCase().includes('italian') || v.name.toLowerCase().includes('italian'),
  'Mexican': (v) => v.cuisine?.toLowerCase().includes('mexican') || v.name.toLowerCase().includes('mexican'),
  'Sushi': (v) => v.cuisine?.toLowerCase().includes('japanese') || v.cuisine?.toLowerCase().includes('sushi'),
  'Pizza': (v) => v.cuisine?.toLowerCase().includes('pizza') || v.name.toLowerCase().includes('pizza'),
  'Brunch': (v) => v.cuisine?.toLowerCase().includes('cafe') || v.cuisine?.toLowerCase().includes('bakery'),
  'Fine Dining': (v) => v.priceLevel === 3,
  'Street Food': (v) => v.priceLevel === 1,
  'Vegetarian': (v) => v.cuisine?.toLowerCase().includes('vegetarian') || v.description.toLowerCase().includes('vegetarian'),
  
  // Drinks
  'Wine Bars': (v) => v.description.toLowerCase().includes('wine') || v.name.toLowerCase().includes('wine'),
  'Cocktails': (v) => v.description.toLowerCase().includes('cocktail') || v.type === 'activity',
  'Craft Beer': (v) => v.description.toLowerCase().includes('beer'),
  'Coffee': (v) => v.cuisine?.toLowerCase().includes('cafe') || v.description.toLowerCase().includes('coffee'),
  'Bubble Tea': (v) => false,
  
  // Outdoors
  'Hiking': (v) => v.name.toLowerCase().includes('trail') || v.name.toLowerCase().includes('lands end'),
  'Beach': (v) => v.description.toLowerCase().includes('coastal') || v.description.toLowerCase().includes('beach'),
  'Parks': (v) => v.name.toLowerCase().includes('park') || v.type === 'activity' && v.priceLevel === 1,
  'Sunset Views': (v) => v.description.toLowerCase().includes('view') || v.name.toLowerCase().includes('palace'),
  'Picnic': (v) => v.name.toLowerCase().includes('park') || v.name.toLowerCase().includes('dolores'),
  
  // Culture
  'Museums': (v) => v.name.toLowerCase().includes('museum') || v.name.toLowerCase().includes('exploratorium'),
  'Art Galleries': (v) => v.description.toLowerCase().includes('art') || v.name.toLowerCase().includes('sfmoma'),
  'Live Music': (v) => v.description.toLowerCase().includes('music') || v.vibeScore >= 4,
  'Theater': (v) => v.description.toLowerCase().includes('theater') || v.description.toLowerCase().includes('performance'),
  'Bookstores': (v) => v.name.toLowerCase().includes('book') || v.name.toLowerCase().includes('city lights'),
  
  // Entertainment
  'Movies': (v) => v.name.toLowerCase().includes('cinema') || v.name.toLowerCase().includes('foreign cinema'),
  'Bowling': (v) => false,
  'Arcade': (v) => v.vibeScore >= 4 && v.type === 'activity',
  'Mini Golf': (v) => false,
  'Escape Room': (v) => false,
  
  // Nightlife
  'Dancing': (v) => v.vibeScore === 5,
  'Live DJ': (v) => v.vibeScore >= 4,
  'Karaoke': (v) => false,
  'Rooftop Bar': (v) => v.description.toLowerCase().includes('rooftop') || v.description.toLowerCase().includes('view'),
};

export function getMatchedVenues(
  creatorInterests: string[],
  partnerInterests: string[]
): MatchedVenue[] {
  const allInterests = [...new Set([...creatorInterests, ...partnerInterests])];
  const sharedInterests = creatorInterests.filter(i => partnerInterests.includes(i));
  
  const scoredVenues: MatchedVenue[] = venues.map(venue => {
    const matchedInterests: string[] = [];
    let score = 0;
    
    allInterests.forEach(interest => {
      const matcher = interestToVenueMap[interest];
      if (matcher && matcher(venue)) {
        matchedInterests.push(interest);
        // Shared interests worth more
        if (sharedInterests.includes(interest)) {
          score += 2;
        } else {
          score += 1;
        }
      }
    });
    
    // Bonus for matching venue type diversity
    if (venue.type === 'restaurant') score += 0.5;
    if (venue.type === 'activity') score += 0.5;
    if (venue.type === 'dessert') score += 0.3;
    
    return {
      ...venue,
      matchScore: score,
      matchedInterests,
    };
  });
  
  // Sort by score descending, filter out zero matches
  return scoredVenues
    .filter(v => v.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getSharedInterests(
  creatorInterests: string[],
  partnerInterests: string[]
): string[] {
  return creatorInterests.filter(i => partnerInterests.includes(i));
}
