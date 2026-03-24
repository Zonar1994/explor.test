import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Coffee, BedDouble, Ticket, Save, ChevronRight, SlidersHorizontal } from 'lucide-react';

export interface UserPreferences {
  breakStyle: string;
  accommodationType: string;
  entertainmentStyle: string;
  hasSeenOnboarding: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  breakStyle: 'Coffee Shops & Casual',
  accommodationType: 'Boutique Hotels',
  entertainmentStyle: 'Live Music & Arts',
  hasSeenOnboarding: false
};

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prefs: UserPreferences) => void;
  initialPrefs: UserPreferences;
  isOnboarding?: boolean;
}

export function ProfileSettings({ isOpen, onClose, onSave, initialPrefs, isOnboarding }: ProfileSettingsProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(initialPrefs);

  // Sync state if initialPrefs change while open
  useEffect(() => {
    setPrefs(initialPrefs);
  }, [initialPrefs, isOpen]);

  const handleSave = () => {
    onSave({ ...prefs, hasSeenOnboarding: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-sm flex items-end justify-center sm:items-center"
      >
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="w-full h-[95dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-[#121212] sm:rounded-3xl rounded-t-[32px] border-t sm:border border-white/10 flex flex-col relative overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10 bg-[#121212]/90 backdrop-blur-md">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {isOnboarding ? 'Welcome to Explor' : 'Profile & Preferences'}
                {!isOnboarding && <SlidersHorizontal size={18} className="text-blue-400" />}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isOnboarding ? 'Set up your default travel style.' : 'Customize your event defaults.'}
              </p>
            </div>
            {!isOnboarding && (
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
            {/* Event Type Defaults */}
            <div className="space-y-6">
              
              {/* Breaks */}
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Coffee size={100} />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2 bg-yellow-400/20 text-yellow-400 rounded-xl">
                    <Coffee size={20} />
                  </div>
                  <h3 className="text-white font-bold text-lg">Break Style</h3>
                </div>
                <div className="relative z-10 space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Preferred places</label>
                  <select 
                    value={prefs.breakStyle}
                    onChange={(e) => setPrefs({ ...prefs, breakStyle: e.target.value })}
                    className="w-full bg-[#2A2A2A] text-white p-3.5 rounded-xl border border-white/5 focus:border-blue-500/50 outline-none appearance-none cursor-pointer"
                  >
                    <option>Coffee Shops & Casual</option>
                    <option>Parks & Nature</option>
                    <option>Quick Fast Food</option>
                    <option>Scenic Viewpoints</option>
                  </select>
                </div>
              </div>

              {/* Entertainment */}
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Ticket size={100} />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2 bg-pink-400/20 text-pink-400 rounded-xl">
                    <Ticket size={20} />
                  </div>
                  <h3 className="text-white font-bold text-lg">Entertainment</h3>
                </div>
                <div className="relative z-10 space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Favorite activities</label>
                  <select 
                    value={prefs.entertainmentStyle}
                    onChange={(e) => setPrefs({ ...prefs, entertainmentStyle: e.target.value })}
                    className="w-full bg-[#2A2A2A] text-white p-3.5 rounded-xl border border-white/5 focus:border-blue-500/50 outline-none appearance-none cursor-pointer"
                  >
                    <option>Live Music & Arts</option>
                    <option>Museums & Culture</option>
                    <option>Active Tours & Sports</option>
                    <option>Nightlife & Clubbing</option>
                    <option>Family Friendly</option>
                  </select>
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <BedDouble size={100} />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2 bg-indigo-400/20 text-indigo-400 rounded-xl">
                    <BedDouble size={20} />
                  </div>
                  <h3 className="text-white font-bold text-lg">Accommodation</h3>
                </div>
                <div className="relative z-10 space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Preferred Stay Type</label>
                  <select 
                    value={prefs.accommodationType}
                    onChange={(e) => setPrefs({ ...prefs, accommodationType: e.target.value })}
                    className="w-full bg-[#2A2A2A] text-white p-3.5 rounded-xl border border-white/5 focus:border-blue-500/50 outline-none appearance-none cursor-pointer"
                  >
                    <option>Boutique Hotels</option>
                    <option>Budget Hostels</option>
                    <option>Luxury Resorts</option>
                    <option>Camping & Outdoor</option>
                    <option>Private Rentals</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div className="p-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent relative z-20">
            <button 
              onClick={handleSave}
              className="w-full py-4 bg-white hover:bg-gray-100 text-black font-black rounded-2xl transition-all shadow-xl shadow-white/10 active:scale-[0.98] text-[16px] flex items-center justify-center gap-2 border border-white/10"
            >
              {isOnboarding ? 'Complete Setup' : 'Save Preferences'}
              <ChevronRight size={18} className="text-[#3B82F6]" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
