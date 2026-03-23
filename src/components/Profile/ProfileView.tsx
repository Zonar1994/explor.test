import React from 'react';
import { Settings, MapPin, Heart, Route, Award, ChevronRight, Navigation } from 'lucide-react';
import { mockPois } from '../../data/mockData';

export function ProfileView() {
  const savedPois = mockPois.slice(0, 2); // Mock saved POIs

  return (
    <div className="w-full h-full bg-[#121212] overflow-y-auto pb-24">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-b from-blue-600/20 to-[#121212]">
        <div className="absolute top-4 right-4 flex gap-3">
          <button className="p-2 bg-[#222222]/80 backdrop-blur-sm rounded-full hover:bg-[#333333] transition-colors border border-white/10">
            <Settings size={20} className="text-gray-300" />
          </button>
        </div>
        
        {/* Avatar & Info */}
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-[#121212] overflow-hidden bg-[#2A2A2A]">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-white">Alex Explorer</h1>
            <p className="text-blue-400 font-medium">@alex_travels</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-16 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#222222] p-4 rounded-2xl border border-[#333333] flex flex-col items-center justify-center text-center">
            <Award size={24} className="text-yellow-500 mb-2" />
            <div className="text-xl font-bold text-white">1,250</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Karma</div>
          </div>
          <div className="bg-[#222222] p-4 rounded-2xl border border-[#333333] flex flex-col items-center justify-center text-center">
            <MapPin size={24} className="text-blue-500 mb-2" />
            <div className="text-xl font-bold text-white">42</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Visited</div>
          </div>
          <div className="bg-[#222222] p-4 rounded-2xl border border-[#333333] flex flex-col items-center justify-center text-center">
            <Heart size={24} className="text-red-500 mb-2" />
            <div className="text-xl font-bold text-white">18</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Saved</div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">About</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Spontaneous explorer always looking for the next hidden gem. Love historical sites, hiking trails, and good coffee. Based in Berlin, traveling everywhere.
          </p>
        </div>

        {/* Saved Places */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Saved Places</h3>
            <button className="text-sm text-blue-500 font-medium hover:text-blue-400 transition-colors">View All</button>
          </div>
          
          <div className="space-y-3">
            {savedPois.map(poi => (
              <div key={poi.id} className="flex gap-4 p-3 bg-[#222222] rounded-xl border border-[#333333] hover:bg-[#2A2A2A] transition-colors cursor-pointer group">
                <img src={poi.image} alt={poi.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 py-1">
                  <h4 className="font-semibold text-gray-100 line-clamp-1">{poi.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{poi.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-blue-400 flex items-center gap-1">
                      <Navigation size={12} /> {poi.distance}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Heart size={12} className="fill-gray-500" /> Saved
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center px-2">
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
