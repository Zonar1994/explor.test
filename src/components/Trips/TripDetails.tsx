import React from 'react';
import { motion } from 'framer-motion';
import { Route, X, ChevronRight, Clock, MapPin, CornerUpRight, Globe, Phone, MessageSquare, Maximize2, Minimize2, Star, Trash2, Navigation } from 'lucide-react';
import { Trip, POI } from '../../types';

interface TripDetailsProps {
  trip: Trip;
  allPois: POI[];
  isExpanded: boolean;
  isMapSplit: boolean;
  onToggleExpand: () => void;
  onToggleMapSplit: () => void;
  onClose: () => void;
  onPoiClick: (id: string) => void;
  onRemovePoi: (id: string) => void;
}

export function TripDetails({ 
  trip, 
  allPois, 
  isExpanded, 
  isMapSplit,
  onToggleExpand, 
  onToggleMapSplit,
  onClose, 
  onPoiClick, 
  onRemovePoi 
}: TripDetailsProps) {
  const [selectedDate, setSelectedDate] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<'feed' | 'summary'>('feed');
  
  const mockDates = ['25-08-2025', '26-08-2025', '27-08-2025', '27-08-2025'];

  // Mock distance/time calculation based on index
  const getTravelInfo = (index: number) => {
    if (index === 0) return { distance: "120 km", time: "1:15" };
    const distances = ["12 km", "8 km", "15 km", "5 km"];
    const times = ["0:20", "0:15", "0:30", "0:10"];
    return { 
      distance: distances[index % distances.length], 
      time: times[index % times.length] 
    };
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#3B82F6] p-3 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={24} className="text-white" />
          </div>
          <h2 className="text-[22px] font-bold tracking-tight">Trips</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onToggleExpand} 
            className="p-3 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5"
          >
            {isExpanded ? <Minimize2 size={20} className="text-gray-300" /> : <Maximize2 size={20} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-3 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5">
            <X size={20} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-10">
        <h3 className="text-[28px] font-bold text-white mb-6 leading-tight">{trip.name}!!</h3>
        
        {/* Date and View Mode Tabs */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5">
          <div className="flex gap-8 overflow-x-auto pb-1 scrollbar-hide">
            {mockDates.map((date, idx) => (
              <button 
                key={`${date}-${idx}`}
                onClick={() => setSelectedDate(idx)}
                className={`font-bold pb-4 transition-all text-[16px] relative whitespace-nowrap tracking-wide ${
                  selectedDate === idx 
                    ? 'text-[#3B82F6]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {date}
                {selectedDate === idx && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" 
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex bg-[#262626] rounded-full p-1 border border-white/5 mb-3">
            <button 
              onClick={() => setViewMode('feed')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'feed' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Feed
            </button>
            <button 
              onClick={() => setViewMode('summary')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'summary' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Route
            </button>
          </div>
        </div>

        {viewMode === 'feed' ? (
          <div className="space-y-4">
            {/* Start Point */}
            <div className="relative pl-10 pb-12">
              <div className="absolute left-[13px] top-6 bottom-0 w-[3px] bg-blue-500/20" />
              <div className="absolute left-0 top-1 w-7 h-7 bg-[#3B82F6] rounded-full border-[6px] border-[#1A1A1A] z-10 shadow-lg" />
              
              <div className="flex items-center gap-3 text-sm font-bold text-gray-500 mb-6">
                <span>09:00</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="flex gap-4">
                {/* Blue Sidebar */}
                <div className="w-[6px] rounded-full bg-[#3B82F6]" />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#3B82F6] text-[17px] font-bold mb-1">
                        Current location <ChevronRight size={18} className="text-gray-600" />
                      </div>
                      <div className="text-gray-100 font-bold text-[19px] leading-snug max-w-[80%]">Museum space biebie doebie...</div>
                      <div className="flex items-center gap-5 text-[14px] text-gray-500 mt-4 font-bold">
                        <span className="flex items-center gap-1.5"><Clock size={16} /> 1:15</span>
                        <span className="flex items-center gap-1.5"><Navigation size={16} /> 120 km</span>
                      </div>
                    </div>
                    <button className="p-3 bg-[#262626] hover:bg-white/5 rounded-2xl transition-all border border-white/5 text-gray-400 hover:text-white">
                      <CornerUpRight size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* POIs */}
            {trip.pois.length === 0 ? (
              <div className="relative pl-10 pb-4">
                <div className="absolute left-0 top-1 w-7 h-7 bg-gray-600 rounded-full border-[6px] border-[#1A1A1A]" />
                <div className="bg-[#262626] rounded-[32px] p-10 text-center border border-white/5 shadow-2xl mb-4 mt-2">
                  <MapPin size={40} className="mx-auto text-gray-600 mb-4" />
                  <h4 className="text-xl font-bold text-gray-300 mb-2">Build your journey</h4>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">Start discovering and adding beautiful places to your itinerary.</p>
                  <button 
                    onClick={() => onPoiClick('swipe')}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
                  >
                    Discover Places
                  </button>
                </div>
              </div>
            ) : (
              trip.pois.map((poiId, index, arr) => {
                const poi = allPois.find(p => p.id === poiId);
                if (!poi) return null;
                const isLast = index === arr.length - 1;
                const travelInfo = getTravelInfo(index + 1);

                return (
                  <div key={poi.id} className="relative pl-10 pb-8 group">
                    {!isLast && <div className="absolute left-[13px] top-6 bottom-0 w-[3px] bg-[#FF6B6B]/20" />}
                    <div className="absolute left-0 top-1 w-7 h-7 bg-[#FF6B6B] rounded-full border-[6px] border-[#1A1A1A] z-10 shadow-lg" />
                    
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500 mb-6">
                      <span>10:15</span>
                      <div className="h-px bg-white/5 flex-1" />
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                      {/* Coral Sidebar */}
                      <div className="w-[6px] rounded-full bg-[#FF6B6B]" />
                      
                      <div className="flex-1 bg-[#262626] rounded-[32px] overflow-hidden border border-white/5 cursor-pointer hover:border-white/20 transition-all shadow-2xl relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Remove ${poi.name} from this trip?`)) onRemovePoi(poi.id);
                          }}
                          className="absolute top-5 right-5 z-20 p-2.5 bg-black/60 backdrop-blur-md rounded-full text-gray-300 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="relative h-64">
                          <img src={poi.image} alt={poi.name} className="w-full h-full object-cover select-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#262626] via-transparent to-transparent opacity-60" />
                          
                          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                            {poi.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="bg-black/60 backdrop-blur-md text-white text-[11px] px-3.5 py-1.5 rounded-full font-bold border border-white/10 tracking-tight">
                                {tag}
                              </span>
                            ))}
                            <span className="bg-blue-600/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-white/10">
                              <Navigation size={10} className="fill-white" /> {travelInfo.distance}
                            </span>
                          </div>
                          
                          {/* Image Pagination Dots */}
                          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white shadow-md"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                          </div>
                        </div>
                        
                        <div className="p-7">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[22px] font-bold text-white tracking-tight leading-snug">{poi.name}</h4>
                            <span className="bg-white/5 text-gray-400 text-[11px] px-4 py-2 rounded-full font-bold border border-white/5 whitespace-nowrap ml-4">
                              {poi.hours || 'Opens monday 9 am'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 mb-5 text-[13px] font-bold text-gray-500">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={`${i < Math.floor(poi.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 hover:text-yellow-400 transition-colors'}`} />
                              ))}
                            </div>
                            <span className="text-gray-400 ml-1">({poi.reviews} Ratings)</span>
                          </div>

                          <div className="flex items-center justify-between mb-6 group/desc" onClick={() => onPoiClick(poi.id)}>
                            <p className="text-[15px] text-gray-400 leading-relaxed line-clamp-2 italic pr-4">
                              {poi.description}
                            </p>
                            <ChevronRight size={20} className="text-gray-600 shrink-0 group-hover/desc:text-white transition-colors" />
                          </div>
                          
                          <div className="flex items-center gap-6 text-gray-500 mb-2">
                            <Globe size={20} className="hover:text-white cursor-pointer transition-colors" />
                            <MapPin size={20} className="hover:text-white cursor-pointer transition-colors" />
                            <Phone size={20} className="hover:text-white cursor-pointer transition-colors" />
                            <Clock size={20} className="hover:text-white cursor-pointer transition-colors" />
                            <MessageSquare size={20} className="hover:text-white cursor-pointer transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[13px] text-gray-500 font-bold px-2 mb-6 uppercase tracking-wider">
                      <span>Added by - {poi.addedBy}</span>
                      <span className="flex items-center gap-2"><Clock size={15} /> Expected: {poi.duration}</span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPoiClick('swipe');
                      }}
                      className="w-full py-4.5 bg-[#262626] hover:bg-[#2A2A2A] text-white font-bold rounded-[20px] transition-all border border-white/5 shadow-lg active:scale-[0.98] text-[15px] mb-2"
                    >
                      Add to Trip
                    </button>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-0">
            {/* Route Summary (Train-ride style) */}
            <div className="relative pl-8 pb-4">
              <div className="absolute left-[4px] top-4 bottom-0 w-px bg-white/10 border-l border-dashed border-white/30" />
              
              {/* Start Point */}
              <div className="relative mb-10">
                <div className="absolute -left-[11px] top-1.5 w-[15px] h-[15px] bg-white rounded-full ring-4 ring-[#1A1A1A] z-10" />
                <div className="flex items-center justify-between">
                  <div className="text-[19px] font-bold text-white tracking-tight">Start Point</div>
                  <div className="text-[13px] font-bold text-gray-500 tracking-widest uppercase">09:00</div>
                </div>
              </div>

              {trip.pois.map((poiId, index, arr) => {
                const poi = allPois.find(p => p.id === poiId);
                if (!poi) return null;
                const travelInfo = getTravelInfo(index + 1);

                return (
                  <React.Fragment key={poi.id}>
                    {/* Leg Info */}
                    <div className="py-4 my-2 flex items-center gap-6">
                      <div className="text-[13px] font-bold text-[#3B82F6] italic tracking-wide">
                        {travelInfo.distance} • {travelInfo.time}
                      </div>
                      <div className="h-px bg-white/10 flex-1 border-t border-dashed border-white/20" />
                    </div>

                    {/* POI Node */}
                    <div className="relative mb-10 group">
                      <div className="absolute -left-[11px] top-1.5 w-[15px] h-[15px] bg-[#FF6B6B] rounded-full ring-4 ring-[#1A1A1A] z-10" />
                      <div className="flex items-center justify-between bg-[#262626]/40 p-4 rounded-3xl border border-white/5 hover:bg-[#262626] transition-all">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => onPoiClick(poi.id)}
                        >
                          <div className="text-[18px] font-bold text-white tracking-tight">{poi.name}</div>
                          <div className="text-[13px] text-gray-500 mt-1 font-semibold">{poi.hours || 'Opens 9am'} • Added by {poi.addedBy}</div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Remove ${poi.name}?`)) onRemovePoi(poi.id);
                          }}
                          className="p-3 text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Final Footer Stats */}
              <div className="mt-16 bg-[#262626] rounded-[32px] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <div className="text-gray-500 font-bold uppercase tracking-widest text-[12px]">Total Distance</div>
                  <div className="text-[26px] font-bold text-white tracking-tight">
                    {trip.pois.length > 0 ? (120 + (trip.pois.length) * 12) : 0} km
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 font-bold uppercase tracking-widest text-[12px]">Estimated Time</div>
                  <div className="text-[26px] font-bold text-[#3B82F6] tracking-tight">5h 30m</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
