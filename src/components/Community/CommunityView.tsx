import React from 'react';
import { Users, MessageSquare, Plus, Search, MapPin, Star } from 'lucide-react';

export function CommunityView() {
  const groups = [
    { id: '1', name: 'Berlin Explorers', members: 124, active: true, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=200&auto=format&fit=crop' },
    { id: '2', name: 'Weekend Hikers', members: 89, active: false, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=200&auto=format&fit=crop' },
    { id: '3', name: 'Vanlife Europe', members: 450, active: true, image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=200&auto=format&fit=crop' },
  ];

  return (
    <div className="w-full h-full bg-[#121212] overflow-y-auto pb-24">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-blue-600/20 to-[#121212]">
        <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
        <p className="text-gray-400">Connect with fellow travelers</p>
        
        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search groups, people, or places..." 
            className="w-full bg-[#222222] text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#333333]"
          />
        </div>
      </div>

      <div className="px-6">
        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
            <Users size={20} /> Find Groups
          </button>
          <button className="flex-1 bg-[#222222] hover:bg-[#333333] text-gray-200 font-medium py-3 rounded-xl transition-colors border border-[#333333] flex items-center justify-center gap-2">
            <Plus size={20} /> Create Group
          </button>
        </div>

        {/* Your Groups */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Groups</h3>
            <span className="text-xs font-medium text-gray-500 bg-[#222222] px-2 py-1 rounded-full">{groups.length}</span>
          </div>
          
          <div className="space-y-3">
            {groups.map(group => (
              <div key={group.id} className="flex items-center gap-4 p-3 bg-[#222222] rounded-xl border border-[#333333] hover:bg-[#2A2A2A] transition-colors cursor-pointer group">
                <div className="relative">
                  <img src={group.image} alt={group.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#121212]" />
                  {group.active && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#121212] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-100">{group.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Users size={12} /> {group.members} members
                  </p>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors bg-[#333333] rounded-full group-hover:bg-[#444444]">
                  <MessageSquare size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Suggested for you</h3>
          <div className="bg-[#222222] rounded-2xl p-6 border border-[#333333] text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-blue-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Find travel buddies</h4>
            <p className="text-sm text-gray-400 mb-6">
              Match with people heading to the same destinations or sharing similar interests.
            </p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
              Start Matching
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
