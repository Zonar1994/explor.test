import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
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
  onPoiClick: (id: string) => void;
  selectedPoiId?: string | null;
  isModalOpen?: boolean;
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

function ZoomHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
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

export function MapView({ pois, onPoiClick, selectedPoiId, isModalOpen }: MapViewProps) {
  const defaultCenter: [number, number] = [48.8566, 2.3522]; // Center of Europe roughly (Paris)
  const [zoomLevel, setZoomLevel] = useState(5);
  const ZOOM_THRESHOLD = 4; // POIs appear when zoom is > 4

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomHandler onZoomChange={setZoomLevel} />
        <MapControls onPoiClick={onPoiClick} />
        
        {selectedPoiId && pois.find(p => p.id === selectedPoiId) && (
          <MapController 
            center={[pois.find(p => p.id === selectedPoiId)!.lat, pois.find(p => p.id === selectedPoiId)!.lng]} 
            zoom={15} 
            offsetY={isModalOpen ? window.innerHeight * 0.18 : 0} 
          />
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
              <div className="text-sm text-gray-600">{poi.type}</div>
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
