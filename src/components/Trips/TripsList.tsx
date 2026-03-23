import React from 'react';
import { Search, ChevronRight, Route, Maximize2, Minimize2, X, Trash2, Mail } from 'lucide-react';
import { Trip } from '../../types';

interface TripsListProps {
  trips: Trip[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  onOpenNewTrip: () => void;
  onOpenTripDetails: (id: string) => void;
  onDeleteTrip: (id: string) => void;
}

export function TripsList({ trips, isExpanded, onToggleExpand, onClose, onOpenNewTrip, onOpenTripDetails, onDeleteTrip }: TripsListProps) {
  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Trips</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onToggleExpand} 
            className="p-2.5 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5"
            title={isExpanded ? "Collapse" : "Full Screen"}
          >
            {isExpanded ? <Minimize2 size={20} className="text-gray-300" /> : <Maximize2 size={20} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-2.5 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5">
            <X size={20} className="text-gray-300" />
          </button>
        </div>
      </div>

      
      {/* Trips List */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        <h3 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Your Trips</h3>
        
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <Route size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-400 mb-2 font-medium">No trips planned yet.</p>
            <p className="text-sm text-gray-500">Create a trip to start saving places.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="group relative h-48 bg-[#262626] rounded-[32px] overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-xl"
                onClick={() => onOpenTripDetails(trip.id)}
              >
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-[13px] font-bold text-gray-200">
                      {trip.start} — {trip.end}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this trip?')) {
                          onDeleteTrip(trip.id);
                        }
                      }}
                      className="p-3 bg-black/40 backdrop-blur-md rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/20 transition-all opacity-0 group-hover:opacity-100 border border-white/5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-[26px] font-bold text-white mb-2 leading-tight group-hover:translate-x-1 transition-transform">{trip.name}</h4>
                    <div className="flex items-center gap-4 text-gray-400 font-bold text-[14px]">
                      <span className="flex items-center gap-2"><Route size={16} className="text-[#3B82F6]" /> {trip.pois.length} Places</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[#3B82F6]">{120 + (trip.pois.length * 12)} km total</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 p-4 bg-white/5 rounded-2xl group-hover:bg-[#3B82F6] group-hover:text-white text-gray-500 transition-all border border-white/5">
                  <ChevronRight size={24} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="p-5">
        <button 
          onClick={onOpenNewTrip}
          className="w-full py-4 bg-transparent hover:bg-white/[0.03] text-gray-300 hover:text-white font-bold rounded-2xl transition-all border border-white/10 shadow-lg active:scale-[0.98] text-base"
        >
          Add new Trip
        </button>
      </div>
    </div>
  );
}
