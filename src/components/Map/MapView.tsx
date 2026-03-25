import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
import { fetchOsmPois } from '../../utils/osmService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Compass, Layers } from 'lucide-react';
import { POI } from '../../types';

// Fix for default marker icons in react-leaflet
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const HeartIcon = L.divIcon({
  html: '<div style="display:flex; justify-content:center; align-items:center; width:30px; height:30px; background:white; border-radius:50%; border:2px solid #EC4899; box-shadow:0 10px 15px -3px rgba(236, 72, 153, 0.3); transform:translate(-50%, -50%);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#EC4899" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [0, 0]
});

interface MapViewProps {
  pois: POI[];
  tripPois?: POI[];
  onPoiClick: (id: string) => void;
  selectedPoiId?: string | null;
  isModalOpen?: boolean;
  isDiscoverOpen?: boolean;
  offsetYOverride?: number;
  mapType?: 'voyager' | 'light' | 'dark' | 'satellite' | 'hybrid';
  onOsmPoisChange?: (pois: POI[]) => void;
  onWaypointSet?: (lat: number, lng: number) => void;
  onReFetch?: () => void;
  onMapReady?: (map: L.Map) => void;
  likedPois?: POI[];
}

function MapReadyHandler({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
  const map = useMap();
  const hasCalled = React.useRef(false);
  useEffect(() => {
    if (onMapReady && !hasCalled.current) {
      onMapReady(map);
      hasCalled.current = true;
    }
  }, [map, onMapReady]);
  return null;
}

function MapController({ center, zoom, offsetY = 0 }: { center: [number, number], zoom?: number, offsetY?: number }) {
  const map = useMap();
  const lastPosRef = React.useRef<{lat: number, lng: number, zoom?: number, offsetY?: number} | null>(null);

  useEffect(() => {
    if (!center) return;
    
    // Deep comparison using Ref to prevent infinite loop
    if (lastPosRef.current && 
        lastPosRef.current.lat === center[0] && 
        lastPosRef.current.lng === center[1] && 
        lastPosRef.current.zoom === zoom && 
        lastPosRef.current.offsetY === offsetY) {
        return;
    }
    
    let finalCenter = L.latLng(center);
    if (offsetY !== 0) {
      const zoomToUse = zoom || map.getZoom();
      const point = map.project(center, zoomToUse);
      const offsetPoint = point.add([0, offsetY]);
      finalCenter = map.unproject(offsetPoint, zoomToUse);
    }

    lastPosRef.current = { lat: center[0], lng: center[1], zoom, offsetY };

    if (zoom) {
      map.flyTo(finalCenter, zoom, { duration: 0.8 });
    } else {
      map.setView(finalCenter, map.getZoom());
    }
  }, [center[0], center[1], map, zoom, offsetY]);
  return null;
}

function MapEventHandler({ 
  onZoomChange, 
  onMoveEnd, 
  onContextMenu 
}: { 
  onZoomChange: (zoom: number) => void, 
  onMoveEnd: (bounds: L.LatLngBounds) => void,
  onContextMenu: (latlng: L.LatLng) => void
}) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
    moveend: () => {
      onMoveEnd(map.getBounds());
    },
    contextmenu: (e) => {
      onContextMenu(e.latlng);
    }
  });
  return null;
}

function MapControls({ onPoiClick, onReFetch }: { onPoiClick: (id: string) => void, onReFetch?: () => void }) {
  const map = useMap();

  const handleLocate = () => {
    map.locate()
      .on("locationfound", function (e) {
        map.flyTo(e.latlng, 12);
      })
      .on("locationerror", function (e) {
        alert("Could not access your location. Please check your browser permissions.");
      });
  };

  return (
    <div className="absolute right-3 top-20 flex flex-col gap-3 z-[1000]">
      <button 
        className="bg-[#4B4D52] p-2.5 rounded-full shadow-lg hover:bg-[#5B5D62] transition-colors border border-[#333333] flex items-center justify-center"
        onClick={handleLocate}
      >
        <Navigation size={20} className="text-white fill-white" />
      </button>
      <button 
        className="bg-[#FFC145] p-2.5 rounded-full shadow-lg hover:bg-[#FFD165] transition-colors border border-[#333333] flex items-center justify-center"
        onClick={() => {
          onReFetch?.();
          onPoiClick('swipe');
        }}
      >
        <Compass size={20} className="text-white" />
      </button>
    </div>
  );
}

export function MapView({ 
  pois, 
  tripPois, 
  onPoiClick, 
  selectedPoiId, 
  isModalOpen, 
  isDiscoverOpen, 
  offsetYOverride, 
  mapType = 'hybrid',
  onOsmPoisChange,
  onWaypointSet,
  onReFetch,
  onMapReady,
  likedPois = []
}: MapViewProps) {
  const tilburgCenter: [number, number] = [51.5583, 5.0833]; // Tilburg (Talent Square)
  const [zoomLevel, setZoomLevel] = useState(13);
  const ZOOM_THRESHOLD = 12; // POIs appear when we're closer

  // Offset calculation to push markers up to the visible top portion of the screen
  const getOffsetY = () => {
    // If modal is open, we want the center to be in the middle of the VISIBLE portion
    // visible proportion = 1 - (modalHeight / 100)
    // target middle = (visible proportion / 2)
    // offset = (0.5 - target middle) * height
    if (isModalOpen) {
      const height = window.innerHeight;
      const proportion = (offsetYOverride || 62) / 100;
      const visiblePortion = 1 - proportion;
      const targetMiddleFromTop = visiblePortion / 2;
      return (0.5 - targetMiddleFromTop) * height;
    }
    return 0;
  };

  const mapUrls = {
    voyager: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    hybrid: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  const handleMoveEnd = async (bounds: L.LatLngBounds) => {
    if (!onOsmPoisChange) return;
    
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const north = bounds.getNorth();
    const east = bounds.getEast();
    
    // Only fetch if area isn't too large (basic check)
    const latDiff = Math.abs(north - south);
    if (latDiff > 0.5 || isDiscoverOpen) return; 

    const newPois = await fetchOsmPois(south, west, north, east);
    onOsmPoisChange(newPois);
  };

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={tilburgCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution={mapType.includes('satellite') ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community" : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={mapUrls[mapType]}
        />

        {mapType === 'hybrid' && (
          <TileLayer
            attribution="&copy; Esri &mdash; Labels: Esri, DeLorme, HERE, TomTom, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, &copy; OpenStreetMap contributors, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        
        <MapEventHandler 
          onZoomChange={setZoomLevel} 
          onMoveEnd={handleMoveEnd}
          onContextMenu={(ll) => onWaypointSet?.(ll.lat, ll.lng)}
        />
        <MapReadyHandler onMapReady={onMapReady} />
        <MapControls onPoiClick={onPoiClick} onReFetch={onReFetch} />
        
        {selectedPoiId && pois.find(p => p.id === selectedPoiId) && (
          <MapController 
            center={[pois.find(p => p.id === selectedPoiId)!.lat, pois.find(p => p.id === selectedPoiId)!.lng]} 
            zoom={18} 
            offsetY={getOffsetY()} 
          />
        )}

        {!selectedPoiId && tripPois && tripPois.length === 1 && (
          <MapController 
            center={[tripPois[0].lat, tripPois[0].lng]} 
            zoom={17} 
          />
        )}

        {!selectedPoiId && (!tripPois || tripPois.length === 0) && (
          <MapController 
            center={tilburgCenter} 
          />
        )}

        {/* Trip Markers and Route */}
        {tripPois && tripPois.length > 0 && (
          <>
            {tripPois.length > 1 && (
              <>
                <Polyline 
                  positions={tripPois.map(p => [p.lat, p.lng])}
                  color="#3B82F6"
                  weight={5}
                  opacity={0.8}
                  lineJoin="round"
                />
                <Polyline 
                  positions={tripPois.map(p => [p.lat, p.lng])}
                  color="#FFFFFF"
                  weight={8}
                  opacity={0.3}
                  lineJoin="round"
                />
              </>
            )}
            
            {/* Render Markers for valid trip items */}
            {tripPois.filter(p => p.lat !== 0 && p.lng !== 0).map((poi, idx) => (
              <Marker 
                key={`trip-${poi.id}-${idx}`} 
                position={[poi.lat, poi.lng]}
                eventHandlers={{ click: () => onPoiClick(poi.id) }}
              />
            ))}
          </>
        )}

        {/* Dash line pointing down to the panel */}
        {selectedPoiId && pois.find(p => p.id === selectedPoiId) && isModalOpen && (
          <Polyline 
            positions={[
              [pois.find(p => p.id === selectedPoiId)!.lat, pois.find(p => p.id === selectedPoiId)!.lng],
              [pois.find(p => p.id === selectedPoiId)!.lat - 0.005, pois.find(p => p.id === selectedPoiId)!.lng]
            ]}
            color="#3B82F6"
            weight={3}
            opacity={0.4}
            dashArray="10, 10"
          />
        )}

        {zoomLevel > ZOOM_THRESHOLD && pois.map((poi) => {
          const isLiked = likedPois.some(lp => lp.id === poi.id);
          return (
            <Marker 
              key={poi.id} 
              position={[poi.lat, poi.lng]}
              icon={isLiked ? HeartIcon : DefaultIcon}
              eventHandlers={{
                click: () => onPoiClick(poi.id),
              }}
            >
              <Popup>
                <div className="font-semibold">{poi.name}</div>
                <div className="text-sm text-gray-600">{poi.category}</div>
                {isLiked && <div className="text-pink-500 font-bold text-xs mt-1 uppercase">★ Liked Place</div>}
                <button 
                  className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPoiClick(poi.id);
                  }}
                >
                  View Details
                </button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
