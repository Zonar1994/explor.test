export type Trip = {
  id: string;
  name: string;
  start: string;
  end: string;
  pois: string[]; // Array of POI IDs
};

export type Review = {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type POI = {
  id: string;
  name: string;
  type: string;
  tags: string[];
  distance: string;
  rating: number;
  reviews: number;
  hours: string;
  description: string;
  addedBy: string;
  duration: string;
  image: string;
  moreImages: string[];
  weather: {
    temp: number;
    condition: string;
    forecast: string;
  };
  keyHighlights: string[];
  userReviews: Review[];
  lat: number;
  lng: number;
};

export type ViewState = 'map' | 'swipe' | 'profile' | 'community';
export type ModalState = 'none' | 'trips' | 'new-trip' | 'trip-details' | 'poi-details' | 'swipe';
