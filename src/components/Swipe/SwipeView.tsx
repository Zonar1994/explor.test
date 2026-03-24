import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, Navigation, Star, MapPin, Clock, Undo2 } from 'lucide-react';
import { POI } from '../../types';

interface SwipeViewProps {
  pois: POI[];
  onSave: (poiId: string) => void;
  onSkip: (poiId: string) => void;
  onViewPoiChange?: (poiId: string) => void;
}

export function SwipeView({ pois, onSave, onSkip, onViewPoiChange }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (onViewPoiChange && pois[currentIndex]) {
      onViewPoiChange(pois[currentIndex].id);
    }
  }, [currentIndex, pois, onViewPoiChange]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    // Trigger action immediately or after a short delay for smooth transition
    if (dir === 'right') {
      onSave(pois[currentIndex].id);
    } else {
      onSkip(pois[currentIndex].id);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      x.set(0); 
    }, 200);
  }, [currentIndex, onSave, onSkip, pois, x]);

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'z') || (e.metaKey && e.key === 'z')) {
        handleUndo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe, handleUndo]);

  if (currentIndex >= pois.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#121212]">
        <div className="w-24 h-24 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6 border border-white/5">
          <MapPin size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-sans tracking-tight">You're all caught up!</h2>
        <p className="text-gray-400 max-w-[240px] leading-relaxed">Check back later for more places to discover, or explore the map.</p>
      </div>
    );
  }

  // Show only up to 2 cards at a time (current and next)
  const stack = pois.slice(currentIndex, currentIndex + 2);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden bg-[#121212]">
      <div className="relative w-full max-w-xl h-[80%] flex-1">
        <AnimatePresence>
          {stack.map((poi, index) => {
            const isTop = index === 0;
            return (
              <motion.div
                key={poi.id}
                style={isTop ? { x, rotate, opacity, zIndex: 10 } : { zIndex: 5 }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ 
                  scale: isTop ? 1 : 0.92, 
                  opacity: 0, 
                  y: isTop ? 0 : 15 
                }}
                animate={{ 
                  scale: isTop ? 1 : 0.92, 
                  opacity: 1, 
                  y: isTop ? 0 : 15,
                  x: isTop && direction === 'left' ? -500 : isTop && direction === 'right' ? 500 : 0,
                  rotate: isTop && direction === 'left' ? -30 : isTop && direction === 'right' ? 30 : 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30 
                }}
                className="absolute inset-0 w-full h-full bg-[#1A1A1A] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/5 cursor-grab active:cursor-grabbing origin-bottom"
              >
                {/* Image Section - Reduced ratio to 1/2 to give more room for info */}
                <div className="relative h-1/2 w-full shrink-0">
                  <img 
                    src={poi.image} 
                    alt={poi.name} 
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                  
                  {/* Tags */}
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                    {poi.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-black/60 backdrop-blur-md text-white text-[11px] px-4 py-2 rounded-2xl font-bold border border-white/10 tracking-tight">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Section - Increased space and information density */}
                <div className="p-8 pb-10 flex-1 flex flex-col justify-start -mt-8 relative z-10 overflow-hidden">
                  <h2 className="text-[28px] font-bold text-white leading-tight mb-3 tracking-tight">{poi.name}</h2>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 font-bold uppercase tracking-wider text-[11px]">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-100 text-[14px]">{poi.rating}</span>
                      <span className="opacity-60">({poi.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                      <Clock size={18} className="text-blue-400" />
                      <span className="text-gray-200">{poi.hours}</span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-gray-400 text-[16px] leading-relaxed font-medium">
                      {poi.description}
                    </p>
                    {/* Additional simulated info to populate the larger space */}
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-gray-500 text-[13px]">
                        <MapPin size={16} />
                        <span className="truncate">Near Museum District, Downtown</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons with Gradient Shading */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent pointer-events-none z-30" />
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 z-40 pointer-events-none">
        <button 
          onClick={(e) => { e.stopPropagation(); handleUndo(); }}
          disabled={currentIndex === 0}
          className={`w-12 h-12 bg-[#2A2A2A] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 transition-all text-yellow-500 pointer-events-auto group ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#333333] hover:scale-110 active:scale-95"
          }`}
          title="Undo last swipe (ArrowUp or Ctrl+Z)"
        >
          <Undo2 size={24} className={currentIndex > 0 ? "group-hover:-rotate-45 transition-transform" : ""} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleSwipe('left'); }}
          className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 hover:bg-[#333333] hover:scale-110 active:scale-95 transition-all text-gray-400 pointer-events-auto group"
          title="Skip (ArrowLeft)"
        >
          <X size={32} className="group-hover:text-red-400 transition-colors" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleSwipe('right'); }}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-white hover:scale-110 active:scale-95 transition-all text-black pointer-events-auto group"
          title="Save (ArrowRight)"
        >
          <Heart size={32} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
        </button>
      </div>

    </div>
  );
}
