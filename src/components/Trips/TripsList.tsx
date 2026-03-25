import React, { useState } from 'react';
import { ChevronRight, Route, Maximize2, Minimize2, X, Trash2, Layers, SlidersHorizontal, Archive, Zap, RotateCcw, Heart } from 'lucide-react';
import { Trip, POI } from '../../types';

interface TripsListProps {
  trips: Trip[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  onOpenNewTrip: () => void;
  onOpenTripDetails: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onRestoreTrip?: (id: string) => void;
  onOpenSettings?: () => void;
  viewMode: 'active' | 'archived' | 'liked';
  onSetViewMode: (mode: 'active' | 'archived' | 'liked') => void;
  archivedTrips: Trip[];
  likedPois: POI[];
  onRemoveLikedPoi: (id: string) => void;
  onPoiClick?: (id: string) => void;
  mapType?: string;
  onMapTypeToggle?: () => void;
  setMapType?: (type: 'voyager' | 'light' | 'dark' | 'satellite' | 'hybrid') => void;
}

export function TripsList({ 
  trips, 
  isExpanded, 
  onToggleExpand, 
  onClose, 
  onOpenNewTrip, 
  onOpenTripDetails, 
  onDeleteTrip, 
  onRestoreTrip,
  onOpenSettings, 
  viewMode,
  onSetViewMode,
  archivedTrips,
  likedPois,
  onRemoveLikedPoi,
  onPoiClick,
  mapType, 
  onMapTypeToggle, 
  setMapType 
}: TripsListProps) {
  const [showMapMenu, setShowMapMenu] = React.useState(false);

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 relative z-[5000]">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-2 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={18} className="text-white" />
          </div>
          <h2 className="text-[18px] font-black tracking-tight uppercase tracking-widest text-[#3B82F6]">Explor</h2>
        </div>
        <div className="flex gap-2">
          {!isExpanded && (
            <div className="relative">
              <button 
                onClick={() => setShowMapMenu(prev => !prev)}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center border ${showMapMenu ? 'bg-white text-black border-white' : 'bg-[#2A2A2A] hover:bg-white/10 border-white/5'}`}
                title="Toggle Map Style"
              >
                {showMapMenu ? <X size={14} className="text-black" /> : <Layers size={14} className="text-[#3B82F6]" />}
              </button>
              
              {showMapMenu && (
                <div className="absolute top-full mt-2 right-0 bg-[#2A2A2A] border border-white/10 rounded-xl shadow-2xl p-2 w-[140px] z-50 flex flex-col gap-1">
                  {(['hybrid', 'satellite', 'voyager', 'light', 'dark'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setMapType?.(type);
                        setShowMapMenu(false);
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${mapType === type ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trips List Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar pb-24">
        <div className="flex items-center justify-between mb-4 mt-2">
          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
            {viewMode === 'archived' ? (
              <><Archive size={12} className="text-yellow-500" /> Archived Trips</>
            ) : viewMode === 'liked' ? (
              <><Heart size={12} className="text-pink-500 fill-pink-500" /> Liked Places</>
            ) : (
              'Your Trips'
            )}
          </h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenSettings}
              className="p-1 text-gray-500 hover:text-white transition-colors"
              title="Preferences"
            >
              <Zap size={15} className="fill-current" />
            </button>
            <button 
              onClick={() => onSetViewMode(viewMode === 'liked' ? 'active' : 'liked')}
              className={`p-1 transition-colors ${viewMode === 'liked' ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}
              title={viewMode === 'liked' ? "View Active" : "View Liked Places"}
            >
              <Heart size={15} className={viewMode === 'liked' ? "fill-pink-500" : ""} />
            </button>
            <button 
              onClick={() => onSetViewMode(viewMode === 'archived' ? 'active' : 'archived')}
              className={`p-1 transition-colors ${viewMode === 'archived' ? 'text-[#3B82F6]' : 'text-gray-500 hover:text-white'}`}
              title={viewMode === 'archived' ? "View Active" : "View Archive"}
            >
              <Archive size={15} />
            </button>
          </div>
        </div>
        
        {viewMode === 'liked' ? (
          likedPois.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <div className="bg-white/5 p-3 rounded-full mb-3">
                <Heart size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-400 mb-1 font-medium text-[13px]">
                No liked places yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {likedPois.map((poi) => (
                <div 
                  key={poi.id} 
                  onClick={() => onPoiClick?.(poi.id)}
                  className="group py-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 -mx-6 px-6 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                     <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                       <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="min-w-0">
                       <h4 className="text-[14px] font-bold text-white mb-0.5 truncate">{poi.name}</h4>
                       <p className="text-[11px] text-gray-500 font-medium truncate">
                         {poi.category}
                       </p>
                     </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLikedPoi(poi.id);
                    }}
                    className="p-2 transition-colors text-gray-500 hover:text-red-400 rounded-lg group-hover:bg-red-500/10"
                    title="Remove from Liked"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          ((viewMode === 'archived' ? archivedTrips : trips).length === 0) ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <div className="bg-white/5 p-3 rounded-full mb-3">
                <Route size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-400 mb-1 font-medium text-[13px]">
                {viewMode === 'archived' ? "No archived trips." : "No trips planned yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {(viewMode === 'archived' ? archivedTrips : trips).map((trip) => (
                <div 
                  key={trip.id} 
                  className="group py-4 flex items-center justify-between cursor-pointer border-b border-white/5 hover:bg-white/5 -mx-6 px-6 transition-colors"
                  onClick={() => viewMode !== 'archived' && onOpenTripDetails(trip.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-white mb-0.5 truncate">{trip.name}</h4>
                    <p className="text-[12px] text-gray-500 font-medium">
                      {trip.start} — {trip.end}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {viewMode === 'archived' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestoreTrip?.(trip.id);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                        title="Restore"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(viewMode === 'archived' ? 'Permanently delete this trip?' : 'Archive this trip?')) {
                          onDeleteTrip(trip.id);
                        }
                      }}
                      className={`p-2 transition-colors ${viewMode === 'archived' ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-400'} rounded-lg`}
                    >
                      <Trash2 size={16} />
                    </button>
                    {viewMode !== 'archived' && <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />}
                  </div>
                </div>
              ))}
            </div>
          )
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
