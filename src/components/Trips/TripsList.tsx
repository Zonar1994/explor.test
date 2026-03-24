import React from 'react';
import { ChevronRight, Route, Maximize2, Minimize2, X, Trash2, Plus } from 'lucide-react';
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
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-2 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={18} className="text-white" />
          </div>
          <h2 className="text-[18px] font-bold tracking-tight">Trips</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onToggleExpand} 
            className="p-2 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5"
            title={isExpanded ? "Collapse" : "Full Screen"}
          >
            {isExpanded ? <Minimize2 size={16} className="text-gray-300" /> : <Maximize2 size={16} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-2 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5">
            <X size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Trips List */}
      <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar pb-24">
        <h3 className="text-[12px] font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Your Trips</h3>
        
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <div className="bg-white/5 p-3 rounded-full mb-3">
              <Route size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-400 mb-1 font-medium text-[13px]">No trips planned yet.</p>
            <p className="text-[12px] text-gray-500">Create a trip to start saving places.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="group py-4 flex items-center justify-between cursor-pointer border-b border-white/5 hover:bg-white/5 -mx-6 px-6 transition-colors"
                onClick={() => onOpenTripDetails(trip.id)}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-bold text-white mb-0.5 truncate">{trip.name}</h4>
                  <p className="text-[12px] text-gray-500 font-medium">
                    {trip.start} — {trip.end}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this trip?')) {
                        onDeleteTrip(trip.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER BUTTON */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A] to-transparent">
        <button 
          onClick={onOpenNewTrip}
          className="w-full py-3 bg-[#2A2A2A] hover:bg-[#333] text-white font-bold rounded-xl transition-all shadow-xl active:scale-[0.98] text-[14px] border border-white/5 flex items-center justify-center gap-2"
        >
          Add new Trip
        </button>
      </div>
    </div>
  );
}
