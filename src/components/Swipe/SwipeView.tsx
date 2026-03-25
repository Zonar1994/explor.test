import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { POI } from '../../types';
import { fetchWeather, WeatherData } from '../../utils/weather';
import { WeatherForecastModal } from '../Trips/PoiCard';
import { MapPin, Clock, Undo2, Star, CheckCircle2, Ticket, Thermometer, Heart, X, ChevronRight } from 'lucide-react';

interface SwipeViewProps {
  pois: Array<POI>;
  onSave: (poiId: string) => void;
  onSkip: (poiId: string) => void;
  onFinish?: (poiIds: string[]) => void;
  onViewPoiChange?: (poiId: string) => void;
  activeFilter?: string;
  onClearFilter?: () => void;
  hideActions?: boolean;
}

export function SwipeView({ pois, onSave, onSkip, onFinish, onViewPoiChange, activeFilter, onClearFilter, hideActions }: SwipeViewProps) {
  const filteredPois = activeFilter 
    ? pois.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase())
    : pois;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [likedPois, setLikedPois] = useState<string[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  
  const activePoi = filteredPois[currentIndex];

  useEffect(() => {
    setCurrentImageIndex(0); // Reset image when POI changes
  }, [currentIndex]);

  useEffect(() => {
    if (activePoi) {
      fetchWeather(activePoi.lat, activePoi.lng).then(setCurrentWeather);
    }
  }, [activePoi]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const skipOpacity = useTransform(x, [-50, -150], [0, 1]);
  const badgeScale = useTransform(x, (v) => Math.abs(v) > 20 ? 1 : 0.8);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const velocityThreshold = 300;
    
    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    
    // If liked, add to local collection instead of immediate save
    if (dir === 'right') {
      const poiId = filteredPois[currentIndex].id;
      if (!likedPois.includes(poiId)) {
        setLikedPois(prev => [...prev, poiId]);
      }
    }
    
    // We delay the slide change slightly to let the animation play
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      x.set(0); 
    }, 150);
  }, [currentIndex, filteredPois, likedPois, x]);

  useEffect(() => {
    if (activePoi && onViewPoiChange) {
      onViewPoiChange(activePoi.id);
    }
  }, [activePoi, onViewPoiChange]);

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

  if (currentIndex >= filteredPois.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#121212]">
        <div className="w-24 h-24 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6 border border-white/5 relative">
          <MapPin size={40} className="text-blue-500" />
          {likedPois.length > 0 && (
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-4 border-[#121212] text-[12px] font-black text-white">
              {likedPois.length}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-sans tracking-tight">
          {likedPois.length > 0 ? 'Ready to plan?' : "You're all caught up!"}
        </h2>
        <p className="text-gray-400 max-w-[240px] leading-relaxed mb-8">
          {likedPois.length > 0 
            ? `You've liked ${likedPois.length} places. Add them to your trip to see your updated itinerary.` 
            : "No new places found. Explore the map to find more inspiration."}
        </p>
        
        {likedPois.length > 0 ? (
          <button 
            onClick={() => onFinish?.(likedPois)}
            className="w-full py-4 bg-white text-black font-black rounded-2xl transition-all shadow-2xl shadow-blue-500/20 active:scale-95 text-[16px] flex items-center justify-center gap-2"
          >
            Add {likedPois.length} Places to Trip <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            onClick={() => onFinish?.([])}
            className="w-full py-4 bg-[#2A2A2A] text-white font-black rounded-2xl transition-all active:scale-95 text-[16px]"
          >
            Back to Trip
          </button>
        )}
      </div>
    );
  }

  // Show only up to 2 cards at a time (current and next)
  const stack = filteredPois.slice(currentIndex, currentIndex + 2);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2.5 pb-20 overflow-hidden bg-[#121212]">
      {activeFilter && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-6 py-2 bg-[#3B82F6]/20 border border-[#3B82F6]/40 backdrop-blur-xl rounded-full flex items-center gap-3 shadow-2xl shadow-blue-500/30 pointer-events-auto"
          >
            <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse" />
            <span className="text-[11px] font-black text-[#3B82F6] uppercase tracking-[0.2em]">Discover: {activeFilter}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onClearFilter?.(); }}
              className="p-1 hover:bg-white/10 rounded-full transition-colors ml-1"
            >
              <X size={10} className="text-[#3B82F6]" />
            </button>
          </motion.div>
        </div>
      )}
      <div className="relative w-full h-full max-h-[85dvh]">
        <AnimatePresence mode="popLayout">
          {stack.map((poi, index) => {
            const isTop = index === 0;
            return (
              <motion.div
                key={poi.id}
                style={isTop ? { x, rotate, opacity, zIndex: 10 } : { zIndex: 5 }}
                drag={isTop && !hideActions ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                dragDirectionLock
                dragTransition={{ bounceStiffness: 600, bounceDamping: 35 }}
                onDragEnd={handleDragEnd}
                initial={{ 
                  scale: isTop ? 1 : 0.94, 
                  opacity: 0, 
                  y: isTop ? 0 : 10
                }}
                animate={{ 
                  scale: isTop ? 1 : 0.94, 
                  opacity: 1, 
                  y: isTop ? 0 : 10,
                  x: isTop && direction === 'left' ? -1000 : isTop && direction === 'right' ? 1000 : 0,
                  rotate: isTop && direction === 'left' ? -35 : isTop && direction === 'right' ? 35 : 0
                }}
                exit={{ 
                  x: direction === 'left' ? -1000 : direction === 'right' ? 1000 : 0,
                  opacity: 0, 
                  scale: 0.95,
                  rotate: direction === 'left' ? -45 : direction === 'right' ? 45 : 0,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                whileTap={{ cursor: 'grabbing', scale: 0.98 }}
                className="absolute inset-x-0 inset-y-0 w-full h-full bg-[#1A1A1A] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/5 cursor-grab origin-bottom touch-pan-y"
              >
                {/* Image Section - Tap and Interaction-friendly */}
                <div className="relative h-[45%] w-full shrink-0 overflow-hidden group/gallery bg-[#111]">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={`${poi.id}-${currentImageIndex}`}
                      src={[poi.image, ...poi.moreImages][currentImageIndex]} 
                      alt={`${poi.name}`} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </AnimatePresence>

                  {/* Badges (Visible only when dragging) */}
                  {isTop && (
                    <>
                      <motion.div 
                        style={{ opacity: likeOpacity, scale: badgeScale }}
                        className="absolute top-10 left-6 z-50 border-4 border-green-500 rounded-lg px-6 py-2 -rotate-[15deg] pointer-events-none"
                      >
                        <span className="text-green-500 text-3xl font-black uppercase tracking-widest">SAVE</span>
                      </motion.div>
                      <motion.div 
                        style={{ opacity: skipOpacity, scale: badgeScale }}
                        className="absolute top-10 right-6 z-50 border-4 border-red-500 rounded-lg px-6 py-2 rotate-[15deg] pointer-events-none"
                      >
                        <span className="text-red-500 text-3xl font-black uppercase tracking-widest">SKIP</span>
                      </motion.div>
                    </>
                  )}

                  {/* Tap regions for image switching */}
                  <div className="absolute inset-x-0 inset-y-0 flex animate-in fade-in duration-500">
                    <div 
                      className="w-1/3 h-full cursor-w-resize" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => Math.max(0, prev - 1));
                      }}
                    />
                    <div className="w-1/3 h-full" /> {/* Buffer for central swipe */}
                    <div 
                      className="w-1/3 h-full cursor-e-resize" 
                      onClick={(e) => {
                        e.stopPropagation();
                        const max = [poi.image, ...poi.moreImages].length;
                        setCurrentImageIndex(prev => Math.min(max - 1, prev + 1));
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent pointer-events-none" />
                  
                  {/* Indicators (Simplified for tap) */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                    {[poi.image, ...poi.moreImages].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/30'}`} />
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
                    {poi.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-black/60 backdrop-blur-md text-white text-[12px] px-4 py-1.5 rounded-2xl font-bold border border-white/10 tracking-tight whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Weather Badge */}
                  <button 
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    onTouchStartCapture={(e) => e.stopPropagation()}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (isTop) setShowWeatherModal(true); 
                    }}
                    className={`absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2 transition-all ${isTop ? 'cursor-pointer pointer-events-auto hover:bg-white/20 active:scale-95' : 'pointer-events-none'}`}
                  >
                    <Thermometer size={14} className="text-blue-400" />
                    <span className="text-white font-bold text-[14px]">{(isTop ? currentWeather?.temp : poi.weather.temp) || 15}°</span>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">{(isTop ? currentWeather?.condition : poi.weather.condition) || 'Sunny'}</span>
                  </button>
                </div>

                {/* Content Section */}
                <div className="px-5 pt-1 pb-16 flex-1 flex flex-col justify-start -mt-5 relative z-10 overflow-y-auto custom-scrollbar">
                  <h2 className="text-[20px] font-bold text-white leading-tight mb-2 tracking-tight">{poi.name}</h2>

                  <div className="flex flex-wrap items-center gap-3 mb-4 font-bold uppercase tracking-wider text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-100 text-[12px]">{poi.rating}</span>
                      <span className="opacity-60 text-gray-400">({poi.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                      <Clock size={13} className="text-blue-400" />
                      <span className="text-gray-300 text-[11px] uppercase">{poi.hours}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {poi.keyHighlights.map((hl, i) => (
                      <div key={i} className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-500/20">
                        {hl}
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-gray-500 uppercase tracking-widest text-[10px] font-black mb-3">About</h3>
                    <p className="text-gray-300 text-[14px] leading-relaxed font-medium">
                      {poi.description}
                    </p>
                  </div>

                  {/* Requirements & Tickets */}
                  {(poi.requirements || poi.ticketInfo) && (
                    <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                       <h3 className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Know before you go</h3>
                       <div className="grid grid-cols-1 gap-4">
                          {poi.requirements && (
                            <div className="space-y-2">
                               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                  <CheckCircle2 size={12} className="text-blue-400" /> Requirements
                               </span>
                               <div className="flex flex-wrap gap-2">
                                  {poi.requirements.map((req, i) => (
                                    <span key={i} className="text-[12px] text-gray-200 bg-white/5 px-3 py-1 rounded-lg border border-white/5">{req}</span>
                                  ))}
                               </div>
                            </div>
                          )}
                          {poi.ticketInfo && (
                            <div className="space-y-2">
                               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                  <Ticket size={12} className="text-blue-400" /> Ticket Info
                               </span>
                               <p className="text-[13px] text-gray-300 leading-snug">{poi.ticketInfo}</p>
                            </div>
                          )}
                       </div>
                    </div>
                  )}

                  {/* Reviews Section */}
                  <div className="mt-2 border-t border-white/5 pt-4 mb-4">
                    <h3 className="text-gray-500 uppercase tracking-widest text-[9px] font-black mb-3">Recent Reviews</h3>
                    <div className="space-y-4">
                      {poi.userReviews.length > 0 ? poi.userReviews.map((rev, i) => (
                        <div key={i} className="flex gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                          <img src={rev.avatar} className="w-8 h-8 rounded-full border border-white/10 shrink-0" alt={rev.user} />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-white font-bold text-[12px]">{rev.user}</span>
                              <span className="text-gray-500 text-[9px]">{rev.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-1.5">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} size={8} className={j < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                              ))}
                            </div>
                            <p className="text-gray-300 text-[12px] leading-relaxed italic">"{rev.comment}"</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-600 text-[11px] italic">No reviews yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons with Gradient Shading */}
      {!hideActions && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent pointer-events-none z-30" />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-40 pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); handleUndo(); }}
              disabled={currentIndex === 0}
              className={`w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-white/10 transition-all text-yellow-500 pointer-events-auto group ${
                currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-[#333333] hover:scale-110 active:scale-95"
              }`}
              title="Undo last swipe"
            >
              <Undo2 size={18} className={currentIndex > 0 ? "group-hover:-rotate-45 transition-transform" : ""} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleSwipe('left'); }}
              className="w-12 h-12 bg-[#262626] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-white/10 hover:bg-[#333333] hover:scale-110 active:scale-95 transition-all text-gray-400 pointer-events-auto group"
              title="Skip"
            >
              <X size={20} className="group-hover:text-red-400 transition-colors" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleSwipe('right'); }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_12px_30px_rgba(255,255,255,0.08)] hover:bg-white hover:scale-110 active:scale-95 transition-all text-black pointer-events-auto group"
              title="Save"
            >
              <Heart size={20} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
            </button>
          </div>
        </>
      )}

      <WeatherForecastModal 
        poi={activePoi} 
        isOpen={showWeatherModal} 
        onClose={() => setShowWeatherModal(false)} 
      />
    </div>
  );
}
