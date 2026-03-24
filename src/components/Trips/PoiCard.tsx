import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin, Navigation, ChevronRight, CheckCircle2, Ticket, Thermometer, ArrowLeft, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { POI } from '../../types';
import { fetchWeather, WeatherData, fetchForecast, ForecastPoint } from '../../utils/weather';

interface RichPoiCardProps {
  poi: POI;
  isTop?: boolean; // If true, it might be the active card handling gestures
  onMapClick?: () => void;
  // Let the parent manage drag if needed, or we just render the content.
  // Actually, parent will wrap this in a motion.div for dragging.
  // This component just renders the INSIDE of the card.
  currentWeather?: WeatherData | null;
  onShowWeather?: () => void;
}

export function RichPoiCardContent({ poi, currentWeather, onShowWeather }: RichPoiCardProps) {
  const allImages = [poi.image, ...(poi.moreImages || [])];

  return (
    <>
      {/* Image Section - Scrollable Gallery */}
      <div className="relative h-[40%] w-full shrink-0 overflow-hidden group/gallery pointer-events-auto">
        <div 
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide pointer-events-auto touch-pan-x"
          onPointerDownCapture={(e) => e.stopPropagation()}
          onTouchStartCapture={(e) => e.stopPropagation()}
        >
          {allImages.map((img, i) => (
            <div key={i} className="min-w-full h-full snap-center relative">
              <img 
                src={img} 
                alt={`${poi.name} ${i}`} 
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent pointer-events-none" />
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
          {allImages.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
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

        {/* Weather Badge - Clickable */}
        <button 
          onClick={(e) => { e.stopPropagation(); onShowWeather?.(); }}
          className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2 transition-all active:scale-95 cursor-pointer z-50 pointer-events-auto hover:bg-white/20"
        >
          <Thermometer size={14} className="text-blue-400" />
          <span className="text-white font-bold text-[14px]">{(currentWeather?.temp) || poi.weather.temp}°</span>
          <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">{(currentWeather?.condition) || poi.weather.condition}</span>
        </button>
      </div>

      {/* Content Section */}
      <div 
        className="px-5 pt-1 pb-16 flex-1 flex flex-col justify-start -mt-5 relative z-10 overflow-y-auto custom-scrollbar pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()} // Stop drag for scrolling text
      >
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
        {poi.keyHighlights && poi.keyHighlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {poi.keyHighlights.map((hl, i) => (
              <div key={i} className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-500/20">
                {hl}
              </div>
            ))}
          </div>
        )}

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
        {poi.userReviews && poi.userReviews.length > 0 && (
          <div className="mt-2 border-t border-white/5 pt-4 mb-4">
            <h3 className="text-gray-500 uppercase tracking-widest text-[9px] font-black mb-3">Recent Reviews</h3>
            <div className="space-y-4">
              {poi.userReviews.map((rev, i) => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function WeatherForecastModal({ poi, isOpen, onClose }: { poi: POI | null, isOpen: boolean, onClose: () => void }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  
  useEffect(() => {
    if (poi && isOpen) {
      fetchWeather(poi.lat, poi.lng).then(setWeather);
      fetchForecast(poi.lat, poi.lng).then(setForecast);
    }
  }, [poi, isOpen]);

  const getIcon = (name: string, size: number = 24) => {
    switch(name) {
      case 'Sun': return <Sun size={size} className="text-yellow-400" />;
      case 'CloudSun': return <Cloud size={size} className="text-gray-300" />;
      case 'Clouds': return <Cloud size={size} className="text-gray-400" />;
      case 'CloudRain': return <CloudRain size={size} className="text-blue-400" />;
      case 'CloudDrizzle': return <CloudRain size={size} className="text-blue-300" />;
      case 'CloudSnow': return <CloudSnow size={size} className="text-white" />;
      case 'CloudLightning': return <CloudLightning size={size} className="text-yellow-500" />;
      default: return <Sun size={size} className="text-yellow-400" />;
    }
  };

  if (!poi) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="absolute inset-x-0 bottom-0 top-0 z-[6000] bg-[#121212] flex flex-col p-6 rounded-t-[32px] md:rounded-none border-t border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onClose}
              className="p-3 bg-[#2A2A2A] rounded-2xl border border-white/5 hover:bg-[#333] transition-colors"
              title="Close Forecast"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-[15px] font-bold tracking-tight uppercase tracking-widest text-[#3B82F6] truncate px-4 max-w-[250px] text-center">
              {poi.name} Weather
            </h2>
            <div className="w-[46px]" />
          </div>

          {/* Compact Current Weather Row */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-3xl mb-8">
             <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3.5 rounded-2xl flex items-center justify-center">
                  {getIcon(weather?.icon || 'Sun', 32)}
                </div>
                <div>
                   <div className="text-[32px] font-black tracking-tighter leading-none mb-1">
                     {weather?.temp || 15}°
                   </div>
                   <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{weather?.condition || 'Sunny'}</div>
                </div>
             </div>
             
             <div className="flex flex-col items-end gap-1.5 border-l border-white/10 pl-5">
               <div className="flex items-center gap-1.5 text-[11px] font-bold">
                 <Thermometer size={12} className="text-red-400" />
                 <span className="text-white">H: {(weather?.temp || 15) + 3}°</span>
                 <span className="text-gray-500">L: {(weather?.temp || 15) - 4}°</span>
               </div>
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
                 <CloudRain size={12} />
                 <span>20% Rain</span>
               </div>
             </div>
          </div>

          {/* Graphs / Hourly */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
             <h3 className="text-gray-500 uppercase tracking-widest text-[10px] font-black mb-6 flex items-center gap-2">
               <Clock size={12} className="text-blue-400" /> 24-Hour Forecast
             </h3>
             
             {/* Hourly Graph (Line + Bars) */}
             <div className="relative h-32 w-full mb-8 pt-4">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {forecast.slice(0, 8).map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 z-10">
                      <span className="text-[10px] text-gray-400 font-bold">{f.time.split(':')[0]}</span>
                      <div className="h-16 w-1.5 bg-white/5 rounded-full relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-full transition-all duration-1000" 
                          style={{ height: `${Math.min(100, (f.temp / 40) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-white">{f.temp}°</span>
                    </div>
                  ))}
                </div>
                {/* Visual Line connecting tops could be an SVG here, but bars look clean. */}
             </div>

             {/* Weekly Graph (High/Low) - Mocked for visual richness as requested */}
             <h3 className="text-gray-500 uppercase tracking-widest text-[10px] font-black mb-6 flex items-center gap-2">
               <Sun size={12} className="text-blue-400" /> 7-Day Outlook
             </h3>
             <div className="space-y-4 mb-8">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex items-center gap-4 text-[13px] font-bold">
                     <span className="w-8 text-gray-400">{day}</span>
                     {getIcon(['Sun', 'Clouds', 'CloudRain', 'Sun', 'Sun', 'Clouds', 'CloudLightning'][i], 16)}
                     <div className="flex-1 flex items-center gap-2">
                        <span className="text-gray-500 w-6 text-right">{12 + i}°</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                           {/* Position the visual bar based on min/max */}
                           <div className="h-full bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full" style={{ marginLeft: `${20 + i*5}%`, width: '50%' }} />
                        </div>
                        <span className="text-white w-6">{20 + i}°</span>
                     </div>
                  </div>
               ))}
             </div>

             <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                    <CloudRain size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Rain</span>
                  </div>
                  <div className="text-[14px] font-bold">20%</div>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                    <Wind size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Wind</span>
                  </div>
                  <div className="text-[14px] font-bold">12 km/h</div>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                    <CheckCircle2 size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Humidity</span>
                  </div>
                  <div className="text-[14px] font-bold">64%</div>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
