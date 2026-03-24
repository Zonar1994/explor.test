export type TripEventType = 'poi' | 'break' | 'accommodation' | 'entertainment' | 'drive' | 'flight';

export type TripItem = {
  id: string; // unique identifier for the timeline item
  type: TripEventType;
  poiId?: string; // Only if type === 'poi'
  name?: string;  // Custom name for manual events
  duration?: string; // e.g., '2 hrs'
  dayIndex?: number; // 0-indexed day the item belongs to
  group?: 'break' | 'accommodation' | 'entertainment'; 
  lat?: number;
  lng?: number;
  image?: string;
};

export type Trip = {
  id: string;
  name: string;
  start: string;
  end: string;
  items: TripItem[];
  days?: number; // Total number of days
};

export type Review = {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export interface POI {
  id: string;
  name: string;
  description: string;
  image: string;
  moreImages: string[];
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  hours: string;
  tags: string[];
  distance?: string;
  category?: 'Nature' | 'City' | 'History' | 'Culture' | 'Food' | 'Stay' | 'Fun';
  ticketInfo?: string;
  requirements?: string[];
  weather: {
    temp: number;
    condition: string;
    icon?: string;
  };
  keyHighlights: string[];
  userReviews: Review[];
}

export type ViewState = 'map' | 'swipe' | 'profile' | 'community';
export type ModalState = 'none' | 'trips' | 'new-trip' | 'trip-details' | 'poi-details' | 'swipe';
