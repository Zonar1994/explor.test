import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, X, ChevronRight, Clock, MapPin, Globe, Phone, Maximize2, Minimize2, Trash2, Navigation, Plus, Layers, Coffee, BedDouble, Ticket as TicketIcon, Compass } from 'lucide-react';
import { Trip, POI, TripEventType } from '../../types';

interface TripDetailsProps {
  trip: Trip;
  allPois: POI[];
  isExpanded: boolean;
  isMapSplit: boolean;
  selectedDayIndex: number;
  onDayChange: (index: number) => void;
  onToggleExpand: () => void;
  onToggleMapSplit: () => void;
  onClose: () => void;
  onPoiClick: (id: string) => void;
  onRemovePoi: (id: string) => void;
  onAddCustomEvent?: (type: TripEventType) => void;
  onWaypointSet?: (lat: number, lng: number) => void;
  mapType?: string;
  onMapTypeToggle?: () => void;
  setMapType?: (type: 'voyager' | 'light' | 'dark' | 'satellite' | 'hybrid') => void;
  onPoiHover?: (id: string | null) => void;
  selectedPoiId?: string | null;
  isDiscovering?: boolean;
}

export function TripDetails({
  trip,
  allPois,
  isExpanded,
  isMapSplit,
  onToggleExpand,
  onToggleMapSplit,
  onClose,
  onPoiClick,
  onRemovePoi,
  onAddCustomEvent,
  onWaypointSet,
  mapType,
  onMapTypeToggle,
  setMapType,
  selectedDayIndex,
  onDayChange,
  onPoiHover,
  selectedPoiId,
  isDiscovering
}: TripDetailsProps) {
  const [visualMode, setVisualMode] = React.useState<'detailed' | 'compact'>('detailed');
  const [showAddMenuIndex, setShowAddMenuIndex] = React.useState<number | null>(null);
  const [showBottomAddMenu, setShowBottomAddMenu] = React.useState(false);
  const [showMapMenu, setShowMapMenu] = React.useState(false);
  const timelineRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!isExpanded) return; // Only sync if expanded or maybe even if not? User said "when you scroll through it"

      const containerRect = container.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 3; // Focus on items near the top third

      let bestPoiId: string | null = null;
      let minDistance = Infinity;

      const poiElements = container.querySelectorAll('[data-poi-id]');
      poiElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - centerY);
        
        if (distance < minDistance && distance < 200) {
          minDistance = distance;
          bestPoiId = el.getAttribute('data-poi-id');
        }
      });

      if (bestPoiId) {
        onPoiHover?.(bestPoiId);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onPoiHover, isExpanded]);

  const handleDayTabClick = (idx: number) => {
    onDayChange(idx);
    const element = document.getElementById(`day-section-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const generateDateTabs = () => {
    if (!trip.start || trip.start === 'TBD') return ['Day 1'];
    const [year, month, day] = trip.start.split('-').map(Number);
    const start = new Date(year, month - 1, day);
    const tabs = [];
    for (let i = 0; i < (trip.days || 1); i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      tabs.push(current.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    }
    return tabs;
  };

  const dayTabs = generateDateTabs();

  const getTravelInfo = (index: number) => {
    const distances = ["12 km", "8 km", "15 km", "5 km"];
    const times = ["0:20", "0:15", "0:30", "0:10"];
    return { 
      distance: distances[index % distances.length], 
      time: times[index % times.length] 
    };
  };

  const renderAddMenu = (id: string | number) => {
    if (showAddMenuIndex !== id) return (
      <button 
        onClick={() => setShowAddMenuIndex(id as any)}
        className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors relative z-10"
      >
        <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6] transition-all">
          <Plus size={12} />
        </div>
        <div className="h-px bg-white/5 flex-1 w-24 group-hover:bg-white/10 transition-colors" />
      </button>
    );

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-4 shadow-2xl relative z-20"
      >
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { type: 'break', icon: Coffee, color: 'text-yellow-400', label: 'Break' },
            { type: 'entertainment', icon: TicketIcon, color: 'text-pink-400', label: 'Fun' },
            { type: 'accommodation', icon: BedDouble, color: 'text-indigo-400', label: 'Stay' }
          ].map(({ type, icon: Icon, color, label }) => (
            <button
              key={type}
              onClick={() => {
                onAddCustomEvent?.(type as TripEventType);
                setShowAddMenuIndex(null);
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/5"
            >
              <Icon size={20} className={color} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowAddMenuIndex(null)} className="w-full py-2 text-gray-500 hover:text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <X size={12} /> Cancel
        </button>
      </motion.div>
    );
  };

  const renderDaySection = (dayIdx: number, items: any[]) => {
    return (
      <div key={`day-section-${dayIdx}`} id={`day-section-${dayIdx}`} className="pt-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#3B82F6] p-2 rounded-xl">
            <Compass size={18} className="text-white" />
          </div>
          <div>
            <h4 className="text-white font-black text-[14px] uppercase tracking-widest">{dayTabs[dayIdx]}</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Start of Day</p>
          </div>
          <div className="h-px bg-white/5 flex-1 ml-2" />
        </div>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const travelInfo = getTravelInfo(index);
          const itemKey = `${item.id}-${index}`;

          // RENDER LOGIC FOR DIFFERENT TYPES
          if (item.type !== 'poi') {
            const eventStyles = {
              break: { color: 'text-yellow-400', border: 'border-yellow-500/30 bg-yellow-500/5', label: 'Break' },
              accommodation: { color: 'text-indigo-400', border: 'border-indigo-500/30 bg-indigo-500/5', label: 'Stay' },
              entertainment: { color: 'text-pink-400', border: 'border-pink-500/30 bg-pink-500/5', label: 'Fun' }
            }[item.type as string] || { color: 'text-blue-400', border: 'border-white/5', label: item.type };

            return (
              <div key={itemKey} className="relative pl-7 group">
                <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-white/10" />
                <div className={`absolute left-0 top-1 w-[16px] h-[16px] rounded-full border-[3px] border-[#1A1A1A] z-10 shadow-lg ${eventStyles.color.replace('text', 'bg')}`} />
                
                <div className="flex items-center justify-between mb-3 mt-0.5">
                  <span className={`font-black ${eventStyles.color} text-[10px] uppercase tracking-[0.2em]`}>{eventStyles.label}</span>
                  <div className="h-px bg-white/10 flex-1 mx-3" />
                </div>
                <div className={`bg-[#222] rounded-2xl p-4 border ${eventStyles.border} shadow-xl relative overflow-hidden group mb-6`}>
                   <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${eventStyles.border.replace('border', 'bg').replace('/30', '/5')}`} />
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-black tracking-tight text-[15px]">{item.name || `Scheduled ${eventStyles.label}`}</h4>
                        <button 
                          onClick={() => onRemovePoi(item.id)}
                          className="p-1.5 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg"><Clock size={12} className={eventStyles.color} /> {item.duration || '1 hr'}</span>
                      </div>
                   </div>
                </div>

                <div className="pb-8">{renderAddMenu(item.id)}</div>
              </div>
            );
          }

          const syntheticPoi: POI | null = allPois.find(p => p.id === item.poiId) || (item.name && item.lat && item.lng ? {
            id: (item.poiId || item.id) as string,
            name: item.name as string,
            image: item.image as string || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
            category: (item.group ? item.group.charAt(0).toUpperCase() + item.group.slice(1) : 'City') as any,
            lat: item.lat,
            lng: item.lng,
            tags: [item.group || 'Fun'],
            description: '',
            moreImages: [],
            rating: 5,
            reviews: 0,
            hours: 'N/A',
            keyHighlights: [],
            userReviews: [],
            weather: undefined,
          } : null);

          if (!syntheticPoi) return null;
          const poi = syntheticPoi;

          const groupStyles = {
            break: 'border-yellow-500/30 bg-yellow-500/5',
            accommodation: 'border-indigo-500/30 bg-indigo-500/5',
            entertainment: 'border-pink-500/30 bg-pink-500/5'
          }[item.group || ''] || 'border-white/5';

          const groupLabel = {
            break: 'Break',
            accommodation: 'Stay',
            entertainment: 'Fun'
          }[item.group || ''] || poi.category;

          const groupColor = {
            break: 'text-yellow-400',
            accommodation: 'text-indigo-400',
            entertainment: 'text-pink-400',
          }[item.group || ''] || 'text-[#FF6B6B]';

          return (
            <div key={itemKey} className="relative pl-7 group">
              <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-white/10" />
              <div className="absolute left-0 top-1 w-[16px] h-[16px] bg-[#FF6B6B] rounded-full border-[3px] border-[#1A1A1A] z-10 shadow-lg" />
              
              <div className="flex items-center justify-between mb-3 mt-0.5">
                <span className={`font-black text-[10px] uppercase tracking-[0.2em] ${groupColor}`}>{groupLabel}</span>
                <div className="h-px bg-white/10 flex-1 mx-3" />
              </div>

              <motion.div 
                layout 
                className="relative overflow-hidden pb-6"
                drag="x"
                dragDirectionLock
                dragConstraints={{ left: -100, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) {
                    onRemovePoi(item.id);
                  }
                }}
              >
                {/* Delete background */}
                <div className="absolute inset-y-0 right-0 w-24 bg-red-500/10 rounded-2xl flex items-center justify-center -z-10">
                   <Trash2 size={20} className="text-red-500" />
                </div>

                {visualMode === 'detailed' ? (
                  <div className="flex gap-3 mb-3 bg-[#1A1A1A]">
                    <div className={`w-1 rounded-full ${groupColor.replace('text', 'bg')}`} />
                    <div data-poi-id={poi.id} className={`flex-1 bg-[#222] rounded-2xl overflow-hidden border ${selectedPoiId === poi.id ? 'border-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.2)]' : groupStyles} relative shadow-xl transition-all duration-300`}>
                      <div className="relative h-48" onClick={() => onPoiClick(poi.id)}>
                        <img src={poi.image} alt={poi.name} className="w-full h-full object-cover select-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#222] via-transparent to-transparent opacity-80" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                          {poi.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-black/80 backdrop-blur-md text-white text-[12px] px-3 py-1 rounded-lg font-bold border border-white/10 tracking-tight">
                              {tag}
                            </span>
                          ))}
                          <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-white/10">
                            <Navigation size={10} className="fill-white" /> {travelInfo.distance}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 cursor-pointer" onClick={() => onPoiClick(poi.id)}>
                        <h4 className="text-[16px] font-bold text-white tracking-tight leading-snug hover:text-blue-400 transition-colors mb-4">{poi.name}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            <Globe size={16} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                            <MapPin size={16} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                          </div>
                          <button className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-red-400" onClick={(e) => { e.stopPropagation(); onRemovePoi(item.id); }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div data-poi-id={poi.id} className={`flex gap-3 mb-2 bg-[#222] p-4 rounded-xl border ${selectedPoiId === poi.id ? 'border-[#3B82F6]' : groupStyles} active:bg-[#2A2A2A] transition-colors relative`} onClick={() => onPoiClick(poi.id)}>
                    <div className="flex flex-1 items-center justify-between">
                      <h4 className="text-[14px] font-bold text-white hover:text-blue-400 transition-colors pointer-events-none">{poi.name}</h4>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemovePoi(item.id); }}
                        className="p-1.5 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <div className="pb-8">{renderAddMenu(item.id)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 relative z-[5000]">
        <div className="flex items-center gap-2">
          <div className="bg-[#3B82F6] p-1.5 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={15} className="text-white" />
          </div>
          <h2 className="text-[15px] font-bold tracking-tight">Trips</h2>
        </div>
        <div className="flex gap-1.5">
          <div className="flex bg-[#2A2A2A] rounded-full p-0.5 mr-1 border border-white/5">
            <button 
              onClick={() => setVisualMode('detailed')}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold transition-all ${visualMode === 'detailed' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Detailed
            </button>
            <button 
              onClick={() => setVisualMode('compact')}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold transition-all ${visualMode === 'compact' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Compact
            </button>
          </div>
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
          <button 
            onClick={onToggleExpand} 
            className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5"
          >
            {isExpanded ? <Minimize2 size={14} className="text-gray-300" /> : <Maximize2 size={14} className="text-gray-300" />}
          </button>
          <button onClick={onClose} className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5">
            <X size={14} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-16">
        <h3 className="text-[14px] font-bold text-white mb-2 ml-1 leading-tight">{trip.name}!!</h3>
        
        {/* Date Tabs (More compact) */}
        <div className="sticky top-0 z-40 bg-[#1A1A1A]/90 backdrop-blur-md pb-1 mb-4 border-b border-white/5 pt-1">
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {dayTabs.map((date, idx) => (
              <button 
                key={`${date}-${idx}`}
                onClick={() => handleDayTabClick(idx)}
                className={`font-semibold pb-2 transition-all text-[13px] relative whitespace-nowrap tracking-wide ${
                  selectedDayIndex === idx 
                    ? 'text-[#3B82F6]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {date}
                {selectedDayIndex === idx && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3B82F6]" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {trip.items.length === 0 ? (
            <div className="flex flex-col gap-3 py-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-[#222] p-3.5 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Set Start Point</h4>
                  {isDiscovering && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input 
                      type="text" 
                      placeholder="Search for a location..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[12px] font-bold text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                      onKeyDown={(e) => { if (e.key === 'Enter') onWaypointSet?.(51.5583, 5.0833); }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      onClick={() => { if (!isDiscovering) onWaypointSet?.(51.5583, 5.0833); }}
                      disabled={isDiscovering}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg ${isDiscovering ? 'bg-blue-600/50 text-white/50 animate-pulse' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20'}`}
                    >
                      <Navigation size={12} className="fill-current" />
                      <span>{isDiscovering ? 'Fetching...' : 'Current'}</span>
                    </button>
                    
                    <button 
                      onClick={() => onPoiClick('swipe')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                      <Compass size={12} />
                      <span>Discover</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-2.5">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-normal">
                  Tip: Right click (or long-press) on the map to set a start waypoint.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Start Point */}
              <div className="relative pl-7 pb-8">
                <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-white/5" />
                <div className="absolute left-0 top-1 w-[16px] h-[16px] bg-[#3B82F6] rounded-full border-[3px] border-[#1A1A1A] z-10 shadow-lg shadow-blue-500/20" />
                
                <div className="flex items-center justify-between mb-3 mt-0.5">
                  <span className="font-black text-[#3B82F6] text-[10px] uppercase tracking-[0.2em]">Departure</span>
                  <div className="h-px bg-white/10 flex-1 mx-3" />
                </div>

                <div className="flex gap-3">
                  <div className="w-1 rounded-full bg-[#3B82F6]" />
                  <div className="flex-1 bg-[#222] p-4 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold mb-1 uppercase tracking-widest">
                          Start point confirmed
                        </div>
                        <div className="text-white font-black text-[15px] leading-snug tracking-tight">
                          {trip.items[0]?.name || 'Initial Stop'}
                        </div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                        <MapPin size={16} className="text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plus button after start point */}
                <div className="mt-6 relative">
                  {showAddMenuIndex === -1 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-4 shadow-2xl relative z-20"
                    >
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {[
                          { type: 'break', icon: Coffee, color: 'text-yellow-400', label: 'Break' },
                          { type: 'entertainment', icon: TicketIcon, color: 'text-pink-400', label: 'Fun' },
                          { type: 'accommodation', icon: BedDouble, color: 'text-indigo-400', label: 'Stay' }
                        ].map(({ type, icon: Icon, color, label }) => (
                          <button
                            key={type}
                            onClick={() => {
                              onAddCustomEvent?.(type as TripEventType);
                              setShowAddMenuIndex(null);
                            }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/5"
                          >
                            <Icon size={20} className={color} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{label}</span>
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setShowAddMenuIndex(null)} className="w-full py-2 text-gray-500 hover:text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <X size={12} /> Cancel
                      </button>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setShowAddMenuIndex(-1)}
                      className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors relative z-10"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6] transition-all">
                        <Plus size={12} />
                      </div>
                      <div className="h-px bg-white/5 flex-1 w-24 group-hover:bg-white/10 transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {/* Timeline Items */}
              {(() => {
                const daySections: React.ReactNode[] = [];
                let currentDayItems: any[] = [];
                let lastDay = -1;

                // Group items into days or handle stay-based transitions
                const startPointId = trip.items[0]?.id;
                const sortedItems = [...trip.items].filter(i => i.id !== startPointId).sort((a, b) => (a.dayIndex || 0) - (b.dayIndex || 0));

                sortedItems.forEach((item, index) => {
                  const day = item.dayIndex || 0;
                  if (day !== lastDay) {
                    if (currentDayItems.length > 0) {
                      daySections.push(renderDaySection(lastDay, currentDayItems));
                    }
                    currentDayItems = [item];
                    lastDay = day;
                  } else {
                    currentDayItems.push(item);
                  }
                });
                
                if (currentDayItems.length > 0) {
                  daySections.push(renderDaySection(lastDay, currentDayItems));
                }

                return daySections;
              })()}
            </>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM BUTTONS */}
      {trip.items.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A] to-transparent pt-12 z-50 pointer-events-none">
          <AnimatePresence mode="wait">
            {!showBottomAddMenu ? (
              <motion.button 
                key="add-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBottomAddMenu(true);
                }}
                className="w-full flex py-4 bg-white text-black font-black rounded-2xl transition-all shadow-2xl shadow-black/40 active:scale-[0.98] text-[15px] items-center justify-center gap-2 border border-white/10 pointer-events-auto"
              >
                Add to Trip <ChevronRight size={18} />
              </motion.button>
            ) : (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-[#1A1A1A] rounded-3xl border border-white/10 p-5 shadow-2xl pointer-events-auto"
              >
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { type: 'break', icon: Coffee, color: 'text-yellow-400', label: 'Break' },
                      { type: 'entertainment', icon: TicketIcon, color: 'text-pink-400', label: 'Fun' },
                      { type: 'accommodation', icon: BedDouble, color: 'text-indigo-400', label: 'Stay' }
                    ].map(({ type, icon: Icon, color, label }) => (
                    <button
                      key={type}
                      onClick={() => {
                        onAddCustomEvent?.(type as TripEventType);
                        setShowBottomAddMenu(false);
                      }}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/5"
                    >
                      <Icon size={24} className={color} />
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">{label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => onPoiClick('swipe')}
                    className="flex-1 py-3 bg-blue-600/20 text-blue-400 font-bold rounded-xl text-[12px] uppercase tracking-widest border border-blue-500/20"
                  >
                    Discover POIs
                  </button>
                  <button 
                    onClick={() => setShowBottomAddMenu(false)}
                    className="p-3 bg-white/5 text-gray-500 rounded-xl hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
