import { POI } from '../types';

/**
 * Service to fetch POIs from OpenStreetMap using the Overpass API
 */
export const fetchOsmPois = async (south: number, west: number, north: number, east: number): Promise<POI[]> => {
  const cacheKey = `osm_cache_${south.toFixed(3)}_${west.toFixed(3)}_${north.toFixed(3)}_${east.toFixed(3)}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const { pois, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
      if (!isExpired) return pois;
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](${south},${west},${north},${east});
      node["tourism"="hotel"](${south},${west},${north},${east});
      node["tourism"="hostel"](${south},${west},${north},${east});
      node["tourism"="guest_house"](${south},${west},${north},${east});
      node["tourism"="museum"](${south},${west},${north},${east});
      node["tourism"="attraction"](${south},${west},${north},${east});
      node["historic"="monument"](${south},${west},${north},${east});
      way["amenity"="cafe"](${south},${west},${north},${east});
      way["tourism"="hotel"](${south},${west},${north},${east});
      way["tourism"="museum"](${south},${west},${north},${east});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      }
      throw new Error('Failed to fetch POIs from OSM');
    }

    const data = await response.json();
    
    const results = data.elements
      .filter((el: any) => el.type === 'node' || (el.type === 'way' && el.tags))
      .map((el: any) => {
        const name = el.tags?.name || el.tags?.amenity || el.tags?.tourism || el.tags?.historic || 'Unnamed Spot';
        
        // Determine category based on tags
        let category: any = 'City';
        if (el.tags?.amenity === 'cafe') category = 'Food';
        if (el.tags?.tourism === 'hotel' || el.tags?.tourism === 'hostel' || el.tags?.tourism === 'guest_house') category = 'Stay';
        if (el.tags?.tourism === 'museum' || el.tags?.historic === 'monument' || el.tags?.tourism === 'attraction') category = 'History';
        
        // Map to our POI structure
        return {
          id: `osm-${el.id}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          description: el.tags?.description || `A ${category.toLowerCase()} spot discovered via OpenStreetMap.`,
          image: getDefaultImageForCategory(category),
          moreImages: [],
          lat: el.lat || (el.center ? el.center.lat : 0),
          lng: el.lon || (el.center ? el.center.lon : 0),
          rating: 4.0 + Math.random(),
          reviews: Math.floor(Math.random() * 500),
          hours: el.tags?.opening_hours || 'Check locally',
          tags: [el.tags?.amenity, el.tags?.tourism, el.tags?.historic].filter(Boolean) as string[],
          category,
          keyHighlights: ['Discovered via OSM', 'Local gem'],
          userReviews: [],
          weather: { temp: 20, condition: 'Sunny' } // Default placeholder
        } as POI;
      })
      .filter((poi: POI) => poi.lat !== 0 && poi.lng !== 0);

    // Cache the results before returning
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        pois: results,
        timestamp: Date.now()
      }));
    } catch (e) {
      // If quota exceeded, clear some old cache
      if (e.name === 'QuotaExceededError') {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('osm_cache_'));
        keys.slice(0, 10).forEach(k => localStorage.removeItem(k));
      }
    }

    return results;
  } catch (error) {
    console.error('OSM Fetch Error:', error);
    return [];
  }
};

const getDefaultImageForCategory = (category: string) => {
  switch (category) {
    case 'Food': return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800';
    case 'Stay': return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800';
    case 'History': return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800';
    default: return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800';
  }
};
