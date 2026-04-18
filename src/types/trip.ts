export type NavSection =
  | 'home'
  | 'itinerary'
  | 'explore'
  | 'food'
  | 'packing'
  | 'route'
  | 'notes';

export interface ExternalLink {
  label: string;
  url: string;
  note?: string;
}

export interface TripFeature {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  note: string;
  palette: string;
}

export interface TripMustDo {
  id: string;
  title: string;
  note: string;
  tags: string[];
}

export interface TripDaySegment {
  label: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  details: string;
}

export interface TripDay {
  id: string;
  date: string;
  dayLabel: string;
  title: string;
  location: string;
  summary: string;
  mainActivity: string;
  hike?: string;
  mealNote: string;
  optionalFlex: string;
  bring: string[];
  mood: string;
  vibe: string;
  tags: string[];
  palette: string;
  segments: TripDaySegment[];
}

export interface ExploreCard {
  id: string;
  title: string;
  description: string;
  bestTime: string;
  effort: string;
  why: string;
  note: string;
  tags: string[];
  palette: string;
}

export interface ActivityCard {
  id: string;
  title: string;
  description: string;
  timing: string;
  practical: string;
  tags: string[];
  palette: string;
  links?: ExternalLink[];
}

export interface FoodCategory {
  id: string;
  title: string;
  subtitle: string;
  note: string;
  items: string[];
}

export interface PackingItem {
  id: string;
  label: string;
  phase: 'first' | 'second';
}

export interface PackingCategory {
  id: string;
  title: string;
  subtitle: string;
  items: PackingItem[];
}

export interface RouteStop {
  id: string;
  title: string;
  note: string;
  detail: string;
  tag: string;
  palette: string;
  links?: ExternalLink[];
}

export interface TripData {
  title: string;
  subtitle: string;
  dates: string;
  route: string;
  moodLine: string;
  homeFeatures: TripFeature[];
  mustDos: TripMustDo[];
  days: TripDay[];
  hikes: ExploreCard[];
  activities: ActivityCard[];
  food: FoodCategory[];
  packing: PackingCategory[];
  routeStops: RouteStop[];
}
