import React from 'react';
import { Search, ChevronRight, Route, Maximize2, Minimize2, X, Trash2 } from 'lucide-react';
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
        <div className="flex gap-3">
          <button onClick={onToggleExpand} className="p-2.5 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5">
            {isExpanded ? <Minimize2 size={20} className="text-gray-300" /> : <Maximize2 size={20} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-2.5 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5">
            <X size={20} className="text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* Trips List */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Your Trips</h3>
        
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <Route size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-400 mb-2">You haven't planned any trips yet.</p>
            <p className="text-sm text-gray-500">Create a trip to start saving places you want to visit.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {trips.map((trip) => (
              <div key={trip.id} className="w-full flex items-center justify-between py-4 px-1 group border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg transition-all">
                <button 
                  onClick={() => onOpenTripDetails(trip.id)}
                  className="flex-1 text-left flex items-center justify-between pr-4"
                >
                  <div>
                    <div className="text-[17px] font-semibold text-gray-100 group-hover:text-white transition-colors">{trip.name}</div>
                    <div className="text-[14px] text-gray-500 mt-1">{trip.start} - {trip.end}</div>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this trip?')) {
                        onDeleteTrip(trip.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Trip"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronRight size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="p-6">
        <button 
          onClick={onOpenNewTrip}
          className="w-full py-4 bg-[#262626] hover:bg-[#2A2A2A] text-gray-200 font-bold rounded-2xl transition-all border border-white/10 shadow-lg active:scale-[0.98] text-base"
        >
          Add new Trip
        </button>
      </div>
    </div>
  );
}
