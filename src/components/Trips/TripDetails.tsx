import React from 'react';
import { motion } from 'framer-motion';
import { Route, X, ChevronRight, Clock, MapPin, Globe, Phone, Maximize2, Minimize2, Trash2, Navigation, Plus } from 'lucide-react';
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
  onToggleExpand, 
  onClose, 
  onPoiClick, 
  onRemovePoi 
}: TripDetailsProps) {
  const [selectedDate, setSelectedDate] = React.useState(0);
  const [visualMode, setVisualMode] = React.useState<'detailed' | 'compact'>('detailed');
  
  const mockDates = ['25-08-2025', '26-08-2025', '27-08-2025', '28-08-2025'];

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
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-[#3B82F6] p-1.5 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={15} className="text-white" />
          </div>
          <h2 className="text-[15px] font-bold tracking-tight">Trips</h2>
        </div>
        <div className="flex gap-1.5">
          <div className="flex bg-[#2A2A2A] rounded-full p-0.5 mr-1 border border-white/5">
            <button 
              onClick={() => setVisualMode('detailed')}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold transition-all ${visualMode === 'detailed' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Detailed
            </button>
            <button 
              onClick={() => setVisualMode('compact')}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold transition-all ${visualMode === 'compact' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Compact
            </button>
          </div>
          <button 
            onClick={onToggleExpand} 
            className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5"
          >
            {isExpanded ? <Minimize2 size={14} className="text-gray-300" /> : <Maximize2 size={14} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5">
            <X size={14} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-32">
        <h3 className="text-[15px] font-bold text-white mb-3 leading-tight">{trip.name}!!</h3>
        
        {/* Date Tabs */}
        <div className="flex items-center justify-between mb-5 border-b border-white/5">
          <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-hide">
            {mockDates.map((date, idx) => (
              <button 
                key={`${date}-${idx}`}
                onClick={() => setSelectedDate(idx)}
                className={`font-semibold pb-2 transition-all text-[13px] relative whitespace-nowrap tracking-wide ${
                  selectedDate === idx 
                    ? 'text-[#3B82F6]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {date}
                {selectedDate === idx && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3B82F6]" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {/* Start Point */}
          <div className="relative pl-7 pb-6">
            <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-blue-500/30" />
            <div className="absolute left-0 top-1 w-[16px] h-[16px] bg-[#3B82F6] rounded-full border-[3px] border-[#1A1A1A] z-10 shadow-lg" />
            
            <div className="flex items-center justify-between mb-3 mt-0.5">
              <span className="font-bold text-gray-400 text-xs">09:00</span>
              <div className="h-px bg-white/10 flex-1 mx-3" />
            </div>

            <div className="flex gap-3">
              <div className="w-1 rounded-full bg-[#3B82F6]" />
              <div className="flex-1 bg-[#222] p-4 rounded-2xl border border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#3B82F6] text-[13px] font-semibold mb-0.5">
                      Current location <ChevronRight size={14} className="text-gray-600" />
                    </div>
                    <div className="text-gray-100 font-bold text-[15px] leading-snug">Museum space biebie doebie...</div>
                    <div className="flex items-center gap-4 text-[12px] text-gray-500 mt-2 font-medium">
                      <span className="flex items-center gap-1"><Clock size={12} /> 1:15</span>
                      <span className="flex items-center gap-1"><Navigation size={12} /> 120 km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Between Button (Static reference) */}
          <div className="relative pl-7 py-2">
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-white/5" />
            <button 
              onClick={() => onPoiClick('swipe')}
              className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6] transition-all">
                <Plus size={12} />
              </div>
              <div className="h-px bg-white/5 flex-1 w-24 group-hover:bg-white/10 transition-colors" />
            </button>
          </div>

          {/* POIs */}
          {trip.pois.length === 0 ? (
            <div className="relative pl-7 pb-4">
              <div className="absolute left-0 top-1 w-[16px] h-[16px] bg-gray-600 rounded-full border-[3px] border-[#1A1A1A]" />
              <div className="bg-[#262626] rounded-2xl p-6 text-center border border-white/5 shadow-2xl mb-4 mt-2">
                <MapPin size={24} className="mx-auto text-gray-600 mb-3" />
                <h4 className="text-[15px] font-bold text-gray-300 mb-1">Build your journey</h4>
                <p className="text-gray-500 text-[12px] mb-5 leading-relaxed">Start discovering and adding beautiful places to your itinerary.</p>
                <button 
                  onClick={() => onPoiClick('swipe')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
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
                <div key={poi.id} className="relative pl-7 group">
                  {!isLast && <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-[#FF6B6B]/30" />}
                  <div className="absolute left-0 top-1 w-[16px] h-[16px] bg-[#FF6B6B] rounded-full border-[3px] border-[#1A1A1A] z-10 shadow-lg" />
                  
                  <div className="flex items-center justify-between mb-3 mt-0.5">
                    <span className="font-bold text-gray-400 text-xs">10:15</span>
                    <div className="h-px bg-white/10 flex-1 mx-3" />
                  </div>

                  <motion.div layout className="relative overflow-hidden pb-8">
                    {visualMode === 'detailed' ? (
                      <div className="flex gap-3 mb-3">
                        <div className="w-1 rounded-full bg-[#FF6B6B]" />
                        <div className="flex-1 bg-[#222] rounded-2xl overflow-hidden border border-white/5 relative shadow-xl">
                          <div className="relative h-48">
                            <img src={poi.image} alt={poi.name} className="w-full h-full object-cover select-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#222] via-transparent to-transparent opacity-80" />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                              {poi.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="bg-black/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold border border-white/10 tracking-tight">
                                  {tag}
                                </span>
                              ))}
                              <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-white/10">
                                <Navigation size={10} className="fill-white" /> {travelInfo.distance}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-1.5">
                              <h4 className="text-[16px] font-bold text-white tracking-tight leading-snug">{poi.name}</h4>
                              <div className="flex flex-col items-end">
                                <span className="bg-white/5 text-gray-400 text-[10px] px-2.5 py-1 rounded-full font-semibold border border-white/5">
                                  {poi.hours || 'Opens 9am'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex gap-3">
                                <Globe size={16} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                                <MapPin size={16} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                                <Phone size={16} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                              </div>
                              <button className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-red-400" onClick={() => onRemovePoi(poi.id)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        drag="x"
                        dragConstraints={{ left: -100, right: 0 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -60) onRemovePoi(poi.id);
                        }}
                        className="flex gap-3 mb-2 bg-[#222] p-4 rounded-xl border border-white/5 active:bg-[#2A2A2A] transition-colors relative"
                      >
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <h4 className="text-[14px] font-bold text-white">{poi.name}</h4>
                            <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
                              <span className="text-[#3B82F6] font-bold">{travelInfo.distance} split</span>
                              <span>{poi.hours || '9:00 - 18:00'}</span>
                            </div>
                          </div>
                          <X size={16} className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer" onClick={() => onRemovePoi(poi.id)} />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Plus button in between stops */}
                  <div className="relative pl-0 py-2">
                    <div className="absolute left-[7px] top-[-32px] bottom-0 w-[2px] bg-white/5" />
                    <button 
                      onClick={() => onPoiClick('swipe')}
                      className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6] transition-all">
                        <Plus size={12} />
                      </div>
                      <div className="h-px bg-white/5 flex-1 w-24 group-hover:bg-white/10 transition-colors" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* STICKY BOTTOM BUTTONS */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A] to-transparent pt-8">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPoiClick('swipe');
          }}
          className="w-full max-w-sm mx-auto flex py-3 bg-[#2A2A2A] hover:bg-[#333] text-white font-bold rounded-xl transition-all shadow-xl shadow-black/20 active:scale-[0.98] text-[13px] border border-white/10 items-center justify-center gap-2"
        >
          Add to Trip <ChevronRight size={15} className="text-[#3B82F6]" />
        </button>
      </div>
    </div>
  );
}
