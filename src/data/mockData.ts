import { Trip, POI } from '../types';

export const initialTrips: Trip[] = [];

export const mockPois: POI[] = [
  {
    id: 'poi-1',
    name: "Museum space biebie doebie...",
    type: "Historical landmark",
    tags: ["WWII", "Historical landmark", "12 Km"],
    distance: "120 km",
    rating: 4,
    reviews: 203,
    hours: "Opens monday 9 am",
    description: "Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et vel. A deep dive into the historical significance of the region.",
    addedBy: "@zonar420",
    duration: "2:30",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544333323-5e927515152a?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 18, condition: "Partly Cloudy", forecast: "Light rain expected in the afternoon" },
    keyHighlights: ["Original artifacts", "Interactive maps", "Expert guided tours"],
    userReviews: [
      { user: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah", rating: 5, comment: "Absolutely moving experience. Must see for history buffs.", date: "2 days ago" },
      { user: "Marc L.", avatar: "https://i.pravatar.cc/150?u=marc", rating: 4, comment: "Well organized museum. A bit crowded on weekends.", date: "1 week ago" }
    ],
    lat: 49.3,
    lng: -0.8
  },
  {
    id: 'poi-2',
    name: "Omaha Beach Memorial",
    type: "Monument",
    tags: ["WWII", "Monument", "Beach"],
    distance: "15 km",
    rating: 5,
    reviews: 1500,
    hours: "Open 24/7",
    description: "Historic site of the D-Day landings. A place of reflection and solemn beauty on the coast of Normandy.",
    addedBy: "@historybuff",
    duration: "1:00",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1506466010722-395ee2bef877?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541410945926-2a6285324707?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 16, condition: "Windy", forecast: "Strong coastal winds, dress warmly" },
    keyHighlights: ["Beach walk", "Memorial statue", "Historical plaques"],
    userReviews: [
      { user: "John D.", avatar: "https://i.pravatar.cc/150?u=john", rating: 5, comment: "Sobering place. The scale of it all is hard to grasp until you're there.", date: "3 days ago" },
      { user: "Elena P.", avatar: "https://i.pravatar.cc/150?u=elena", rating: 5, comment: "Beautifully maintained. The atmosphere is unique.", date: "5 days ago" }
    ],
    lat: 49.37,
    lng: -0.88
  },
  {
    id: 'poi-3',
    name: "Pointe du Hoc",
    type: "Historical landmark",
    tags: ["WWII", "Cliffs", "Bunkers"],
    distance: "22 km",
    rating: 4.8,
    reviews: 890,
    hours: "Open 24/7",
    description: "Dramatic cliff top location assaulted by US Rangers on D-Day. You can still see the craters from the naval bombardment.",
    addedBy: "@explorer_dan",
    duration: "2:00",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 17, condition: "Sunny", forecast: "Perferct day for hiking the cliffs" },
    keyHighlights: ["Cliffside views", "Authentic bunkers", "Craters landscape"],
    userReviews: [
      { user: "Alex W.", avatar: "https://i.pravatar.cc/150?u=alex", rating: 5, comment: "The views are incredible. Seeing the bunkers up close is amazing.", date: "Yesterday" }
    ],
    lat: 49.39,
    lng: -0.98
  },
  {
    id: 'poi-4',
    name: "Preikestolen (Pulpit Rock)",
    type: "Nature",
    tags: ["Hiking", "Views", "Fjords"],
    distance: "450 km",
    rating: 4.9,
    reviews: 5200,
    hours: "Daylight hours",
    description: "Famous steep cliff rising 604 metres above Lysefjorden. A bucket-list hike with unparalleled fjord views.",
    addedBy: "@nordic_walker",
    duration: "4:00",
    image: "https://images.unsplash.com/photo-1513553404607-988bf2703777?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 12, condition: "Cloudy", forecast: "Misty at the top, watch your step" },
    keyHighlights: ["Fjord vista", "Steep climb", "Iconic plateau"],
    userReviews: [
      { user: "Kari H.", avatar: "https://i.pravatar.cc/150?u=kari", rating: 5, comment: "Breathless! The hike is tough but worth every second.", date: "1 month ago" }
    ],
    lat: 58.98,
    lng: 6.18
  },
  {
    id: 'poi-5',
    name: "Trolltunga",
    type: "Nature",
    tags: ["Extreme Hiking", "Views", "Rock Formation"],
    distance: "520 km",
    rating: 4.9,
    reviews: 3100,
    hours: "Summer only",
    description: "One of the most spectacular scenic cliffs in Norway, hovering 700 metres above Lake Ringedalsvatnet.",
    addedBy: "@mountain_goat",
    duration: "10:00",
    image: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 10, condition: "Cold", forecast: "Chance of snow at altitude" },
    keyHighlights: ["The Tongue", "Epic photo ops", "Mountain lakes"],
    userReviews: [
      { user: "Bjorn", avatar: "https://i.pravatar.cc/150?u=bjorn", rating: 5, comment: "Long hike, bring plenty of water. Life-changing views.", date: "2 weeks ago" }
    ],
    lat: 60.13,
    lng: 6.75
  },
  {
    id: 'poi-6',
    name: "Matterhorn Base Camp",
    type: "Mountain",
    tags: ["Alps", "Climbing", "Views"],
    distance: "800 km",
    rating: 5.0,
    reviews: 4200,
    hours: "Daylight hours",
    description: "Iconic pyramidal peak in the Swiss Alps, one of the highest summits in Europe and the Alps.",
    addedBy: "@swiss_hiker",
    duration: "6:00",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 5, condition: "Snowy", forecast: "Heavy winds at the ridge" },
    keyHighlights: ["Pyramid peak", "Alpine air", "Climber hub"],
    userReviews: [
      { user: "Heidi", avatar: "https://i.pravatar.cc/150?u=heidi", rating: 5, comment: "Majestic. Simply majestic.", date: "4 days ago" }
    ],
    lat: 45.97,
    lng: 7.65
  },
  {
    id: 'poi-7',
    name: "Teufelsberg",
    type: "Abandoned",
    tags: ["Cold War", "Street Art", "Views"],
    distance: "5 km",
    rating: 4.5,
    reviews: 1200,
    hours: "10:00 - 18:00",
    description: "Abandoned Cold War listening station covered in street art, offering great views over Berlin.",
    addedBy: "@berlin_underground",
    duration: "2:30",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=800&auto=format&fit=crop",
    moreImages: [
      "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 22, condition: "Sunny", forecast: "Warm evening, perfect for sunset" },
    keyHighlights: ["Street art gallery", "Radar domes", "Berlin skyline"],
    userReviews: [
      { user: "Gunther", avatar: "https://i.pravatar.cc/150?u=gunther", rating: 4, comment: "Spooky and cool at the same time.", date: "3 days ago" }
    ],
    lat: 52.49,
    lng: 13.24
  },
  {
    id: 'poi-8',
    name: "Mont Saint-Michel",
    type: "Historical landmark",
    tags: ["Castle", "Island", "UNESCO"],
    distance: "85 km",
    rating: 4.8,
    reviews: 3200,
    hours: "Open 9:00 AM - 7:00 PM",
    description: "A stunning island commune in Normandy, France. Famous for its gravity-defying abbey and dramatic tides.",
    addedBy: "@traveler99",
    duration: "4:00",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
    moreImages: [
        "https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 19, condition: "Cloudy", forecast: "Watch the tide schedule!" },
    keyHighlights: ["Gothic Abbey", "Tidal walks", "Medieval streets"],
    userReviews: [
      { user: "Marie", avatar: "https://i.pravatar.cc/150?u=marie", rating: 5, comment: "Like a fairy tale come to life.", date: "1 week ago" }
    ],
    lat: 48.636,
    lng: -1.511
  },
  {
    id: 'poi-9',
    name: "Cliffs of Étretat",
    type: "Nature",
    tags: ["Cliffs", "Ocean", "Hiking"],
    distance: "45 km",
    rating: 4.9,
    reviews: 890,
    hours: "Open 24/7",
    description: "Famous for its stunning white chalk cliffs and natural arches, Étretat is a picturesque coastal town.",
    addedBy: "@naturelover",
    duration: "2:00",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop",
    moreImages: [
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 20, condition: "Sunny", forecast: "Clear horizon" },
    keyHighlights: ["Natural arches", "Seaside promenade", "Inspiration for artists"],
    userReviews: [
      { user: "Claude", avatar: "https://i.pravatar.cc/150?u=claude", rating: 5, comment: "I could paint this forever.", date: "2 days ago" }
    ],
    lat: 49.707,
    lng: 0.204
  },
  {
    id: 'poi-10',
    name: "Rouen Cathedral",
    type: "Architecture",
    tags: ["Gothic", "Church", "History"],
    distance: "110 km",
    rating: 4.7,
    reviews: 650,
    hours: "Open 8:00 AM - 6:00 PM",
    description: "A masterpiece of French Gothic architecture, famously painted by Claude Monet.",
    addedBy: "@artfan",
    duration: "1:30",
    image: "https://images.unsplash.com/photo-1548625361-1b33075ea87d?q=80&w=800&auto=format&fit=crop",
    moreImages: [],
    weather: { temp: 21, condition: "Partly Cloudy", forecast: "Nice light for photos" },
    keyHighlights: ["Monet connection", "Stained glass", "Lionheart's tomb"],
    userReviews: [
      { user: "Sophie", avatar: "https://i.pravatar.cc/150?u=sophie", rating: 4, comment: "Stunning details on the facade.", date: "5 days ago" }
    ],
    lat: 49.440,
    lng: 1.095
  },
  {
    id: 'poi-11',
    name: "Eiffel Tower",
    type: "Historical Landmark",
    tags: ["Landmark", "Views", "Must See"],
    distance: "1.2 km",
    rating: 5,
    reviews: 12500,
    hours: "Open 9:00 AM - 11:45 PM",
    description: "Iconic wrought-iron lattice tower on the Champ de Mars in Paris, France.",
    addedBy: "@traveler_jane",
    duration: "2:30",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=1000",
    moreImages: [
        "https://images.unsplash.com/photo-1543349689-9a4d426bee87?q=80&w=800&auto=format&fit=crop"
    ],
    weather: { temp: 23, condition: "Sunny", forecast: "Blue skies over Paris" },
    keyHighlights: ["Iron lady", "Champ de Mars", "City views"],
    userReviews: [
      { user: "Jean", avatar: "https://i.pravatar.cc/150?u=jean", rating: 5, comment: "The symbol of France. Magnificent.", date: "1 day ago" }
    ],
    lat: 48.8584,
    lng: 2.2945
  },
  {
    id: 'poi-12',
    name: "Colosseum",
    type: "Historical Landmark",
    tags: ["Ancient", "Ruins", "History"],
    distance: "15 km",
    rating: 5,
    reviews: 15200,
    hours: "Open 8:30 AM - 7:00 PM",
    description: "An oval amphitheatre in the centre of the city of Rome, Italy. The largest ancient amphitheatre ever built.",
    addedBy: "@history_buff",
    duration: "2:00",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1000",
    moreImages: [],
    weather: { temp: 28, condition: "Hot", forecast: "Drink plenty of water" },
    keyHighlights: ["Gladiator history", "Roman engineering", "Ancient ruins"],
    userReviews: [
      { user: "Lucia", avatar: "https://i.pravatar.cc/150?u=lucia", rating: 5, comment: "Stepping back into history.", date: "3 days ago" }
    ],
    lat: 41.8902,
    lng: 12.4922
  },
  {
    id: 'poi-13',
    name: "Sagrada Familia",
    type: "Architecture",
    tags: ["Gaudí", "Church", "Architecture"],
    distance: "3.1 km",
    rating: 5,
    reviews: 11000,
    hours: "Open 9:00 AM - 8:00 PM",
    description: "A large unfinished Roman Catholic minor basilica designed by Antoni Gaudí.",
    addedBy: "@arch_hunter",
    duration: "3:00",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=1000",
    moreImages: [],
    weather: { temp: 25, condition: "Sunny", forecast: "Beautiful light through the windows" },
    keyHighlights: ["Gaudí masterpiece", "Stained glass", "Forest of columns"],
    userReviews: [
      { user: "Antonio", avatar: "https://i.pravatar.cc/150?u=antonio", rating: 5, comment: "No words for such beauty.", date: "4 days ago" }
    ],
    lat: 41.4036,
    lng: 2.1744
  },
  {
    id: 'poi-14',
    name: "Tower of London",
    type: "Historical Landmark",
    tags: ["Castle", "Crown Jewels", "History"],
    distance: "4.2 km",
    rating: 4,
    reviews: 9500,
    hours: "Open 9:00 AM - 5:30 PM",
    description: "Historic castle on the north bank of the River Thames. Famous for housing the Crown Jewels.",
    addedBy: "@londoner",
    duration: "3:30",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80&w=1000",
    moreImages: [],
    weather: { temp: 15, condition: "Overcast", forecast: "Typical London day" },
    keyHighlights: ["Beefeaters", "Raven legends", "White Tower"],
    userReviews: [
      { user: "James", avatar: "https://i.pravatar.cc/150?u=james", rating: 4, comment: "Great history and well told.", date: "2 days ago" }
    ],
    lat: 51.5081,
    lng: -0.0759
  },
  {
    id: 'poi-15',
    name: "Rijksmuseum",
    type: "Museum",
    tags: ["Art", "Dutch Masters", "Museum"],
    distance: "1.8 km",
    rating: 5,
    reviews: 7200,
    hours: "Open 9:00 AM - 5:00 PM",
    description: "A Dutch national museum dedicated to arts and history in Amsterdam. Features works by Rembrandt and Vermeer.",
    addedBy: "@dutch_art",
    duration: "4:00",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1000",
    moreImages: [],
    weather: { temp: 18, condition: "Cloudy", forecast: "Perfect for museum day" },
    keyHighlights: ["The Night Watch", "Vermeer collection", "Library of Rijksmuseum"],
    userReviews: [
      { user: "Hans", avatar: "https://i.pravatar.cc/150?u=hans", rating: 5, comment: "Top tier museum. The building is art itself.", date: "6 days ago" }
    ],
    lat: 52.3600,
    lng: 4.8852
  }
];
