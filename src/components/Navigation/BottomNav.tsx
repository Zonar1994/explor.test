import React from 'react';
import { Map, Layers, User, Users } from 'lucide-react';
import { ViewState } from '../../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export function BottomNav({ currentView, onChangeView }: BottomNavProps) {
  const navItems = [
    { id: 'swipe', icon: Layers, label: 'Discover' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'profile', icon: User, label: 'Profile' }
  ] as const;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#1E1E1E]/90 backdrop-blur-md border-t border-[#333333] px-6 py-4 pb-8 z-30">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Icon size={24} className={isActive ? 'fill-blue-500/20' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
