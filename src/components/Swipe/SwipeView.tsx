import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, Navigation, Star, MapPin, Clock } from 'lucide-react';
import { POI } from '../../types';

interface SwipeViewProps {
  pois: POI[];
  onSave: (poiId: string) => void;
  onSkip: (poiId: string) => void;
}

export function SwipeView({ pois, onSave, onSkip }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

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
      // Reset position if not swiped far enough
      x.set(0);
    }
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      if (dir === 'right') {
        onSave(pois[currentIndex].id);
      } else {
        onSkip(pois[currentIndex].id);
      }
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      x.set(0); // Reset x for the next card
    }, 300);
  };

  if (currentIndex >= pois.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-24 h-24 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
          <MapPin size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">You're all caught up!</h2>
        <p className="text-gray-400">Check back later for more places to discover, or explore the map.</p>
      </div>
    );
  }

  const currentPoi = pois[currentIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentPoi.id}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
            rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md h-[70vh] bg-[#222222] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#333333] relative cursor-grab active:cursor-grabbing"
        >
          {/* Image Section */}
          <div className="relative h-2/3 w-full">
            <img 
              src={currentPoi.image} 
              alt={currentPoi.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-transparent to-transparent" />
            
            {/* Tags */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {currentPoi.tags.map(tag => (
                <span key={tag} className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col justify-end -mt-12 relative z-10">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-2xl font-bold text-white leading-tight">{currentPoi.name}</h2>
              <div className="bg-[#333333] px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
                <Navigation size={14} className="text-blue-400" />
                <span className="text-sm font-medium text-gray-200">{currentPoi.distance}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-200">{currentPoi.rating}</span>
                <span>({currentPoi.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{currentPoi.hours}</span>
              </div>
            </div>

            <p className="text-gray-300 text-sm line-clamp-3 mb-4">
              {currentPoi.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="absolute bottom-28 flex gap-6 z-20">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center shadow-xl border border-[#333333] hover:bg-[#333333] hover:scale-110 transition-all text-red-500"
        >
          <X size={32} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-xl hover:bg-blue-600 hover:scale-110 transition-all text-white"
        >
          <Heart size={32} className="fill-white" />
        </button>
      </div>
    </div>
  );
}
