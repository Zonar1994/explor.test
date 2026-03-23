import React from 'react';
import { Route, X, Star, Clock, MapPin, Globe, Phone, MessageSquare, Navigation } from 'lucide-react';
import { Trip, POI } from '../../types';

interface PoiDetailsProps {
  poi: POI;
  trips: Trip[];
  onClose: () => void;
  onAddToTrip: (tripId: string, poiId: string) => void;
}

export function PoiDetails({ poi, trips, onClose, onAddToTrip }: PoiDetailsProps) {
  if (!poi) return null;

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Header Image */}
      <div className="relative h-64 w-full shrink-0">
        <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors z-10"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {poi.tags.map(tag => (
              <span key={tag} className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">{poi.name}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-lg">{poi.rating}</span>
            <span className="text-gray-400 text-sm">({poi.reviews} reviews)</span>
          </div>
          <div className="bg-[#2A2A2A] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#333333]">
            <Navigation size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-gray-200">{poi.distance}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 text-gray-300">
            <Clock size={20} className="text-gray-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-200">Hours</p>
              <p className="text-sm text-gray-400">{poi.hours}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-gray-300">
            <MapPin size={20} className="text-gray-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-200">Location</p>
              <p className="text-sm text-gray-400">{poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {poi.description}
          </p>
        </div>

        <div className="flex items-center justify-around py-4 border-y border-[#333333] mb-6">
          <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="p-3 bg-[#2A2A2A] rounded-full"><Globe size={20} /></div>
            <span className="text-xs font-medium">Website</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="p-3 bg-[#2A2A2A] rounded-full"><Phone size={20} /></div>
            <span className="text-xs font-medium">Call</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="p-3 bg-[#2A2A2A] rounded-full"><MessageSquare size={20} /></div>
            <span className="text-xs font-medium">Review</span>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Add to Trip</h3>
          <div className="space-y-2">
            {trips.map(trip => {
              const isInTrip = trip.pois.includes(poi.id);
              return (
                <button
                  key={trip.id}
                  onClick={() => !isInTrip && onAddToTrip(trip.id, poi.id)}
                  disabled={isInTrip}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left border ${
                    isInTrip 
                      ? 'border-green-500/30 bg-green-500/10 cursor-default' 
                      : 'border-[#333333] bg-[#2A2A2A] hover:bg-[#333333]'
                  }`}
                >
                  <div>
                    <div className="font-medium text-gray-100">{trip.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{trip.pois.length} stops</div>
                  </div>
                  <div className="text-sm font-medium">
                    {isInTrip ? (
                      <span className="text-green-400">Added</span>
                    ) : (
                      <span className="text-blue-400">+ Add</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
