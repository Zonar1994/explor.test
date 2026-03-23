import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
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
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-[1000]">
      <button 
        className="bg-[#4B4D52] p-4 rounded-full shadow-lg hover:bg-[#5B5D62] transition-colors border border-[#333333] flex items-center justify-center"
        onClick={handleLocate}
      >
        <Navigation size={32} className="text-white fill-white" />
      </button>
      <button 
        className="bg-[#FFC145] p-4 rounded-full shadow-lg hover:bg-[#FFD165] transition-colors border border-[#333333] flex items-center justify-center"
        onClick={() => onPoiClick('swipe')}
      >
        <Compass size={32} className="text-white" />
      </button>
    </div>
  );
}

export function MapView({ pois, onPoiClick }: MapViewProps) {
  const defaultCenter: [number, number] = [51.1657, 10.4515]; // Center of Germany/Europe roughly
  const [zoomLevel, setZoomLevel] = useState(5);
  const ZOOM_THRESHOLD = 6; // POIs appear when zoom is > 6

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
