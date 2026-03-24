import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ChevronRight, Navigation, Clock, Coffee, BedDouble, Ticket as TicketIcon, X } from 'lucide-react';
import { Trip, POI, TripItem, TripEventType } from '../../types';
import { fetchWeather, WeatherData } from '../../utils/weather';
import { RichPoiCardContent, WeatherForecastModal } from './PoiCard';

interface PoiDetailsProps {
  poi: POI;
  trips: Trip[];
  activeTripId?: string | null;
  allPois?: POI[];
  hideAddButton?: boolean;
  onClose: () => void;
  onAddToTrip: (tripId: string, poiId: string) => void;
  onAddCustomEvent?: (type: TripEventType) => void;
  onViewOnMap: () => void;
}

export function PoiDetails({ poi, trips, activeTripId, allPois, hideAddButton, onClose, onAddToTrip, onAddCustomEvent }: PoiDetailsProps) {
  const activeTrip = activeTripId ? trips.find(t => t.id === activeTripId) : null;
  const [hasAdded, setHasAdded] = useState(false);
  
  // If we are viewing within a trip, we setup a gallery of that trip's items
  const timelineItems = activeTrip ? activeTrip.items : [{ id: 'solo', type: 'poi', poiId: poi.id } as TripItem];
  
  const initialIndex = timelineItems.findIndex(i => i.type === 'poi' && i.poiId === poi.id);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});

  const currentItem = timelineItems[currentIndex];
  // If it's a POI, resolve it. If it's a generic event, activeItemPoi is null.
  const activeItemPoi = currentItem?.type === 'poi' ? (allPois?.find(p => p.id === currentItem.poiId) || poi) : null;

  useEffect(() => {
    if (activeItemPoi && !weatherMap[activeItemPoi.id]) {
      fetchWeather(activeItemPoi.lat, activeItemPoi.lng).then(weather => {
        setWeatherMap(prev => ({ ...prev, [activeItemPoi.id]: weather }));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItemPoi?.id]);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 80;
    if (info.offset.x > threshold && currentIndex > 0) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold && currentIndex < timelineItems.length - 1) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex(prev => dir === 'left' ? prev + 1 : prev - 1);
      setDirection(null);
      x.set(0);
    }, 150);
  }, []);

  if (!currentItem) return null;

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white overflow-hidden relative">
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-white/5 bg-[#121212] z-50">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-[15px] font-bold text-white leading-tight">
            {activeTrip ? activeTrip.name : 'Place Details'}
          </h2>
          {activeTrip && (
            <p className="text-[#3B82F6] text-[10px] font-bold tracking-widest uppercase">
              Stop {currentIndex + 1} of {timelineItems.length}
            </p>
          )}
        </div>
        <div className="w-10" />
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center p-2.5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentItem.id}
            style={{ x, opacity, scale }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            initial={{ 
              opacity: 0, 
              x: direction === 'left' ? 300 : direction === 'right' ? -300 : 0,
              scale: 0.9 
            }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ 
              opacity: 0, 
              x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
              scale: 0.9,
              transition: { duration: 0.15 }
            }}
            className="absolute inset-x-2.5 inset-y-2.5 bg-[#1A1A1A] rounded-[32px] overflow-hidden flex flex-col border border-white/5"
          >
            {currentItem.type === 'poi' && activeItemPoi ? (
              <RichPoiCardContent 
                poi={activeItemPoi} 
                isTop={true} 
                currentWeather={weatherMap[activeItemPoi.id]}
                onShowWeather={() => setShowWeatherModal(true)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-900/20 to-purple-900/10 h-full">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                  <Navigation size={32} className="text-blue-400" />
                </div>
                <h2 className="text-[24px] font-bold text-white mb-2 tracking-tight uppercase">{currentItem.type}</h2>
                <h3 className="text-gray-400 font-medium mb-8">{currentItem.name || `Scheduled ${currentItem.type}`}</h3>
                {currentItem.duration && (
                  <div className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-sm font-bold text-blue-400 flex items-center gap-2">
                    <Clock size={16} /> {currentItem.duration}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!hideAddButton && !activeTrip && activeItemPoi && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pt-12 z-[1000]">
          <AnimatePresence mode="wait">
            {!hasAdded ? (
              <motion.button 
                key="add-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => {
                  setHasAdded(true);
                  onAddToTrip(trips[0]?.id, activeItemPoi.id);
                }}
                className="w-full py-4 bg-white text-black font-black rounded-2xl transition-all shadow-2xl shadow-black/40 active:scale-[0.98] text-[16px] flex items-center justify-center gap-3 border border-white/10"
              >
                Add to your trip
                <ChevronRight size={18} />
              </motion.button>
            ) : (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-[#1A1A1A] rounded-3xl border border-white/10 p-5 shadow-2xl"
              >
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { type: 'break', icon: Coffee, color: 'text-yellow-400', label: 'Break' },
                    { type: 'accommodation', icon: BedDouble, color: 'text-indigo-400', label: 'Stay' },
                    { type: 'entertainment', icon: TicketIcon, color: 'text-pink-400', label: 'Fun' }
                  ].map(({ type, icon: Icon, color, label }) => (
                    <button
                      key={type}
                      onClick={() => {
                        onAddCustomEvent?.(type as TripEventType);
                        setHasAdded(false);
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/5"
                    >
                      <Icon size={20} className={color} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{label}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setHasAdded(false)}
                  className="w-full py-2 text-gray-500 hover:text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <X size={12} /> Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {activeItemPoi && showWeatherModal && (
        <WeatherForecastModal 
          poi={activeItemPoi} 
          isOpen={showWeatherModal} 
          onClose={() => setShowWeatherModal(false)} 
        />
      )}
    </div>
  );
}
