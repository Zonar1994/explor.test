import React from 'react';
import { Route, X, ChevronRight, Clock, MapPin, CornerUpRight, Navigation, Globe, Phone, MessageSquare, Maximize2, Minimize2, Star } from 'lucide-react';
import { Trip, POI } from '../../types';

interface TripDetailsProps {
  trip: Trip;
  allPois: POI[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  onPoiClick: (id: string) => void;
}

export function TripDetails({ trip, allPois, isExpanded, onToggleExpand, onClose, onPoiClick }: TripDetailsProps) {
  const [selectedDate, setSelectedDate] = React.useState(0);
  
  // Generate some mock dates based on the trip's start date
  const mockDates = ['25-08-2025', '26-08-2025', '27-08-2025', '27-08-2025'];

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-2 rounded-2xl">
            <Route size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Trips</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={onToggleExpand} className="p-2 bg-[#333333] rounded-full hover:bg-gray-600 transition-colors">
            {isExpanded ? <Minimize2 size={16} className="text-gray-300" /> : <Maximize2 size={16} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-2 bg-[#333333] rounded-full hover:bg-gray-600 transition-colors">
            <X size={18} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <h3 className="text-xl font-bold text-white mb-4">{trip.name}!!</h3>
        
        {/* Date Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
          {mockDates.map((date, idx) => (
            <button 
              key={`${date}-${idx}`}
              onClick={() => setSelectedDate(idx)}
              className={`font-bold pb-2 whitespace-nowrap transition-colors text-lg ${
                selectedDate === idx 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {/* Start Point */}
          <div className="relative pl-10 pb-8">
            <div className="absolute left-[13px] top-6 bottom-0 w-1 bg-blue-500/30" />
            <div className="absolute left-0 top-1 w-7 h-7 bg-blue-500 rounded-full border-[6px] border-[#1A1A1A]" />
            
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                  09:00 <span className="h-px w-full bg-white/10"></span>
                </div>
                <div className="flex items-center gap-2 text-blue-400 text-base font-semibold">
                  Current location <ChevronRight size={16} className="text-gray-500" />
                </div>
                <div className="text-gray-200 font-bold text-lg mt-1">Museum space biebie doebie...</div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> 1:15</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> 120 km</span>
                </div>
              </div>
              <button className="p-2.5 bg-[#2A2A2A] rounded-xl hover:bg-gray-600 transition-colors border border-white/5">
                <CornerUpRight size={20} className="text-gray-300" />
              </button>
            </div>
          </div>

          {/* POIs in Trip */}
          {trip.pois.map((poiId, index, arr) => {
            const poi = allPois.find(p => p.id === poiId);
            if (!poi) return null;
            const isLast = index === arr.length - 1;

            return (
              <div key={poi.id} className="relative pl-10 pb-4">
                {!isLast && <div className="absolute left-[13px] top-6 bottom-0 w-1 bg-red-500/30" />}
                <div className="absolute left-0 top-1 w-7 h-7 bg-red-500 rounded-full border-[6px] border-[#1A1A1A]" />
                
                <div className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                  10:15 <span className="h-px w-full bg-white/10"></span>
                </div>
                
                <div 
                  className="bg-[#262626] rounded-3xl overflow-hidden border border-white/5 cursor-pointer hover:border-white/20 transition-all shadow-xl mb-4"
                  onClick={() => onPoiClick(poi.id)}
                >
                  <div className="relative h-56">
                    <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {poi.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full font-bold border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-white/10">
                        <Navigation size={12} /> {poi.distance}
                      </span>
                    </div>
                    
                    {/* Image Pagination Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-gray-100 leading-tight">{poi.name}</h4>
                      <span className="bg-white/5 text-gray-400 text-[11px] px-3 py-1.5 rounded-full font-bold whitespace-nowrap ml-2 border border-white/5">
                        {poi.hours}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={`${i < poi.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                      <span className="text-sm text-gray-500 font-bold ml-2">({poi.reviews} Ratings)</span>
                    </div>

                    <p className="text-[15px] text-gray-400 mb-6 leading-relaxed line-clamp-2">{poi.description}</p>
                    
                    <div className="flex items-center gap-5 text-gray-400 mb-6">
                      <Globe size={20} className="hover:text-white transition-colors" />
                      <MapPin size={20} className="hover:text-white transition-colors" />
                      <Phone size={20} className="hover:text-white transition-colors" />
                      <Clock size={20} className="hover:text-white transition-colors" />
                      <MessageSquare size={20} className="hover:text-white transition-colors" />
                    </div>

                    <div className="flex items-center justify-between text-[13px] text-gray-500 border-t border-white/5 pt-5">
                      <span className="font-medium">Added by - {poi.addedBy}</span>
                      <span className="flex items-center gap-2 font-medium"><Clock size={14} /> Expected duration: {poi.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Trip Button - Shown below each POI as per image */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPoiClick('swipe');
                  }}
                  className="w-full py-4 bg-[#262626] hover:bg-[#2A2A2A] text-gray-100 font-bold rounded-2xl transition-all border border-white/10 shadow-lg active:scale-[0.98] text-base mb-4"
                >
                  Add to Trip
                </button>
              </div>
            );
          })}
        </div>

        {/* Constraints Section */}
        <div className="mt-6 pt-8 border-t border-white/5">
          <h3 className="text-lg font-bold text-white mb-5">Constraints</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#262626] rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-xl"><Clock size={20} className="text-gray-300" /></div>
                <span className="text-gray-200 font-bold">Work</span>
              </div>
              <ChevronRight size={20} className="text-gray-500 transform rotate-90" />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#262626] rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-xl"><Clock size={20} className="text-gray-300" /></div>
                <span className="text-gray-200 font-bold">Errands</span>
              </div>
              <ChevronRight size={20} className="text-gray-500 transform rotate-90" />
            </div>
            <button className="w-full py-4 mt-2 border-2 border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/30 text-base font-bold rounded-2xl transition-all">
              Add Constraint
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
