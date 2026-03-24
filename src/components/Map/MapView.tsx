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
}

function MapController({ center, zoom, offsetY = 0 }: { center: [number, number], zoom?: number, offsetY?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    
    // If we have an offset, calculate a new geographical center that puts our POI at the desired screen position
    let finalCenter = L.latLng(center);
    
    if (offsetY !== 0) {
      const zoomToUse = zoom || map.getZoom();
      const point = map.project(center, zoomToUse);
      const offsetPoint = point.add([0, offsetY]);
      finalCenter = map.unproject(offsetPoint, zoomToUse);
    }

    if (zoom) {
      map.flyTo(finalCenter, zoom, { duration: 1.5 });
    } else {
      map.setView(finalCenter, map.getZoom());
    }
  }, [center, map, zoom, offsetY]);
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

function MapControls({ onPoiClick }: { onPoiClick: (id: string) => void }) {
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
        onClick={() => onPoiClick('swipe')}
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
  mapType = 'voyager',
  onOsmPoisChange,
  onWaypointSet
}: MapViewProps) {
  const tilburgCenter: [number, number] = [51.5583, 5.0833]; // Tilburg (Talent Square)
  const [zoomLevel, setZoomLevel] = useState(13);
  const ZOOM_THRESHOLD = 12; // POIs appear when we're closer

  // Offset calculation to push markers up to the visible top portion of the screen
  const getOffsetY = () => {
    if (offsetYOverride && offsetYOverride > 0) {
      // The override comes from App.tsx as a screen proportion (e.g. 0.8)
      // We want to center it at (1 - Proportion) / 2 from the top.
      const visiblePortion = 1 - (offsetYOverride / 100);
      const targetCenterPx = (visiblePortion / 2) * window.innerHeight;
      return (window.innerHeight / 2) - targetCenterPx;
    }
    if (!isModalOpen) return 0;
    if (isDiscoverOpen) return window.innerHeight * 0.38;
    return window.innerHeight * 0.3;
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
    if (latDiff > 0.5) return; 

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
        <MapControls onPoiClick={onPoiClick} />
        
        {selectedPoiId && pois.find(p => p.id === selectedPoiId) && (
          <MapController 
            center={[pois.find(p => p.id === selectedPoiId)!.lat, pois.find(p => p.id === selectedPoiId)!.lng]} 
            zoom={16} 
            offsetY={getOffsetY()} 
          />
        )}

        {/* Trip Route Visualization */}
        {tripPois && tripPois.length > 1 && (
          <>
            <Polyline 
              positions={tripPois.map(p => [p.lat, p.lng])}
              color="#3B82F6"
              weight={5}
              opacity={0.8}
              lineJoin="round"
            />
            {/* Outline for the route */}
            <Polyline 
              positions={tripPois.map(p => [p.lat, p.lng])}
              color="#FFFFFF"
              weight={8}
              opacity={0.3}
              lineJoin="round"
            />
            {/* Always show markers for trip POIs */}
            {tripPois.map(poi => (
              <Marker 
                key={`trip-${poi.id}`} 
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

        {zoomLevel > ZOOM_THRESHOLD && pois.map((poi) => (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lng]}
            eventHandlers={{
              click: () => onPoiClick(poi.id),
            }}
          >
            <Popup>
              <div className="font-semibold">{poi.name}</div>
              <div className="text-sm text-gray-600">{poi.category}</div>
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
        ))}
      </MapContainer>
    </div>
  );
}
