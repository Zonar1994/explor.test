import React from 'react';
import { motion } from 'framer-motion';
import { Route, X, Star, Clock, MapPin, Globe, Phone, Navigation, ChevronRight } from 'lucide-react';
import { Trip, POI } from '../../types';

interface PoiDetailsProps {
  poi: POI;
  trips: Trip[];
  onClose: () => void;
  onAddToTrip: (tripId: string, poiId: string) => void;
  onViewOnMap: () => void;
}

export function PoiDetails({ poi, trips, onClose, onAddToTrip, onViewOnMap }: PoiDetailsProps) {
  if (!poi) return null;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header Image Section */}
      <div className="relative h-64 w-full shrink-0">
        <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors z-10 border border-white/10"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Tags overlapping the image bottom */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {poi.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-[#2A2A2A] text-white text-[10px] px-3 py-1.5 rounded-full font-bold border border-white/10 uppercase tracking-widest shadow-xl">
              {tag}
            </span>
          ))}
          <span className="bg-[#3B82F6] text-white text-[10px] px-3 py-1.5 rounded-full font-bold border border-white/10 flex items-center gap-1.5 shadow-xl">
            <Navigation size={10} className="fill-white" /> {poi.distance}
          </span>
        </div>
      </div>

      {/* Date Tabs (Reference Alignment) */}
      <div className="px-5 py-4 border-b border-white/5 flex gap-6 overflow-x-auto scrollbar-hide shrink-0">
        {['25-08-2025', '26-08-2025', '27-08-2025', '28-08-2025'].map((date, idx) => (
          <button key={date} className={`text-[12px] font-bold uppercase tracking-widest pb-1 transition-colors ${idx === 0 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            {date}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 custom-scrollbar">
        {/* Timeline View (Reference) */}
        <div className="relative pl-8 mb-8">
          <div className="absolute left-[4px] top-6 bottom-0 w-[2px] bg-blue-500/20" />
          
          <div className="relative pb-10">
            <div className="absolute -left-[32px] top-1.5 w-[16px] h-[16px] bg-[#3B82F6] rounded-full border-[3px] border-[#1A1A1A] z-10" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-gray-200">{poi.name}</span>
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">09:00</span>
            </div>
            <p className="text-[12px] text-gray-400 leading-relaxed pr-4">{poi.description}</p>
          </div>

          <div className="relative pb-4">
            <div className="absolute -left-[32px] top-1.5 w-[16px] h-[16px] bg-gray-600 rounded-full border-[3px] border-[#1A1A1A] z-10" />
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-gray-500">Next Stop</span>
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">10:15</span>
            </div>
          </div>
        </div>

        {/* POI Metadata Table */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#222] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Rating</span>
            </div>
            <div className="text-[15px] font-bold">{poi.rating} <span className="text-gray-500 text-[12px] font-medium">({poi.reviews})</span></div>
          </div>
          <div className="bg-[#222] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Hours</span>
            </div>
            <div className="text-[13px] font-bold leading-tight">{poi.hours}</div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center mb-10 px-2 opacity-60">
          <Globe size={20} className="hover:text-blue-400 transition-colors cursor-pointer" />
          <MapPin size={20} className="hover:text-blue-400 transition-colors cursor-pointer" />
          <Phone size={20} className="hover:text-blue-400 transition-colors cursor-pointer" />
          <div className="h-4 w-px bg-white/10" />
          <Navigation size={20} className="hover:text-blue-400 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="p-5 pt-2 mb-2">
        <button 
          onClick={() => onAddToTrip(trips[0]?.id, poi.id)}
          className="w-full py-4 bg-[#2A2A2A] hover:bg-[#333] text-white font-bold rounded-2xl transition-all border border-white/10 shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          Add to Trip
          <ChevronRight size={18} className="text-blue-400" />
        </button>
      </div>
    </div>
  );
}
