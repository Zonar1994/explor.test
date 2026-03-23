export type Trip = {
  id: string;
  name: string;
  start: string;
  end: string;
  pois: string[]; // Array of POI IDs
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
  lat: number;
  lng: number;
};

export type ViewState = 'map' | 'swipe' | 'profile' | 'community';
export type ModalState = 'none' | 'trips' | 'new-trip' | 'trip-details' | 'poi-details' | 'swipe';
