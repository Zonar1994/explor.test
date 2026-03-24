import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, X, Maximize2, Minimize2, Layers, SlidersHorizontal } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { MapView } from './components/Map/MapView';
import { TripsList } from './components/Trips/TripsList';
import { TripDetails } from './components/Trips/TripDetails';
import { PoiDetails } from './components/Trips/PoiDetails';
import { NewTripForm } from './components/Trips/NewTripForm';
import { SwipeView } from './components/Swipe/SwipeView';
import { ProfileSettings, UserPreferences } from './components/ProfileSettings';
import { initialTrips, mockPois } from './data/mockData';
import { Trip, POI, ModalState, TripEventType } from './types';

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalState>('trips');
  const [modalHeight, setModalHeight] = useState<number>(62); // height in vh
  const [mapType, setMapType] = useState<'voyager' | 'light' | 'dark' | 'satellite' | 'hybrid'>('voyager');
  
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('explor_prefs');
    return saved ? JSON.parse(saved) : { breakStyle: 'Coffee Shops & Casual', accommodationType: 'Boutique Hotels', entertainmentStyle: 'Live Music & Arts', hasSeenOnboarding: false };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(!userPrefs.hasSeenOnboarding);

  const toggleMapType = () => {
    const types: ('voyager' | 'light' | 'dark' | 'satellite' | 'hybrid')[] = ['voyager', 'light', 'dark', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    setMapType(types[(currentIndex + 1) % types.length]);
  };
  
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('explor_trips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: convert old { pois: string[] } to new { items: TripItem[] }
        return parsed.map((t: any) => ({
          ...t,
          items: t.items || (t.pois || []).map((id: string) => ({
            id: Math.random().toString(36).substring(7),
            type: 'poi',
            poiId: id
          }))
        }));
      } catch (e) {
        return initialTrips;
      }
    }
    return initialTrips;
  });
  const [archivedTrips, setArchivedTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('explor_archived_trips');
    return saved ? JSON.parse(saved) : [];
  });
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [swipeCategoryFilter, setSwipeCategoryFilter] = useState<string | null>(null);
  const [swipeTargetType, setSwipeTargetType] = useState<TripEventType | null>(null);

  useEffect(() => {
    localStorage.setItem('explor_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('explor_archived_trips', JSON.stringify(archivedTrips));
  }, [archivedTrips]);

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTripsExpanded, setIsTripsExpanded] = useState(true); // Added for the new UI element

  const handleOpenTrips = () => setActiveModal('trips');
  const handleCloseModal = () => {
    setActiveModal('none');
    setIsExpanded(false);
    setSwipeCategoryFilter(null);
    setSwipeTargetType(null);
  };
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleOpenNewTrip = () => setActiveModal('new-trip');
  
  const handleCreateTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setActiveModal('trips');
    toast.success('Trip created successfully!');
  };

  const handleDeleteTrip = (id: string) => {
    if (isArchiveView) {
      setArchivedTrips(prev => prev.filter(t => t.id !== id));
      toast.success("Trip permanently deleted");
    } else {
      const tripToArchive = trips.find(t => t.id === id);
      if (tripToArchive) {
        setArchivedTrips(prev => [...prev, tripToArchive]);
        setTrips(prev => prev.filter(t => t.id !== id));
        toast.success("Trip archived successfully");
      }
    }
    if (selectedTripId === id) {
      setSelectedTripId(null);
      setActiveModal('trips');
    }
  };

  const handleRestoreTrip = (id: string) => {
    const tripToRestore = archivedTrips.find(t => t.id === id);
    if (tripToRestore) {
      setTrips(prev => [...prev, tripToRestore]);
      setArchivedTrips(prev => prev.filter(t => t.id !== id));
      toast.success("Trip restored successfully");
    }
  };

  const handleOpenTripDetails = (id: string) => {
    setSelectedTripId(id);
    setActiveModal('trip-details');
  };

  const handlePoiClick = (id: string) => {
    if (id === 'swipe') {
      setIsExpanded(false);
      setModalHeight(75);
      setActiveModal('swipe');
    } else {
      setSelectedPoiId(id);
      setModalHeight(75);
      setActiveModal('poi-details');
    }
  };

  const handleAddPoiToTrip = (tripId: string, poiId: string) => {
    const poi = mockPois.find(p => p.id === poiId);
    setTrips(trips.map(t => {
      if (t.id !== tripId) return t;
      if (t.items.some(item => item.poiId === poiId)) return t;
      return { 
        ...t, 
        items: [...t.items, { 
          id: Math.random().toString(36).substring(7), 
          type: 'poi', 
          poiId,
          name: poi?.name || 'Place'
        }] 
      };
    }));
    toast.success(`Added ${poi?.name} to your trip`);
    setActiveModal('trip-details');
    setSelectedTripId(tripId);
  };

  const handleRemovePoiFromTrip = (tripId: string, poiId: string) => {
    setTrips(trips.map(t => 
      t.id === tripId ? { ...t, items: t.items.filter(item => item.poiId !== poiId) } : t
    ));
    toast.success('Place removed from trip');
  };

  const handleSwipeSave = (poiId: string) => {
    const poi = mockPois.find(p => p.id === poiId);
    const targetTrip = trips.find(t => t.id === selectedTripId) || trips[0];
    if (targetTrip) {
      setTrips(trips.map(t => {
        if (t.id !== targetTrip.id) return t;
        return { 
          ...t, 
          items: [...t.items, { 
            id: Math.random().toString(36).substring(7), 
            type: swipeTargetType || 'poi', 
            poiId,
            name: poi?.name || 'Unknown'
          }] 
        };
      }));
      toast.success(`Saved to ${targetTrip.name}`);
      
      if (swipeTargetType) {
        setSwipeCategoryFilter(null);
        setSwipeTargetType(null);
        setActiveModal('trip-details');
      }
    }
  };

  const handleAddCustomEvent = (tripId: string, type: TripEventType) => {
    if (type === 'break' || type === 'accommodation' || type === 'entertainment') {
      const categoryMap: Record<string, string> = {
        'break': 'Food',
        'accommodation': 'Stay',
        'entertainment': 'Fun'
      };
      setSwipeCategoryFilter(categoryMap[type]);
      setSwipeTargetType(type);
      setActiveModal('swipe');
      return;
    }

    setTrips(trips.map(t => {
      if (t.id !== tripId) return t;
      return { 
        ...t, 
        items: [...t.items, { 
          id: Math.random().toString(36).substring(7), 
          type, 
          name: `Scheduled ${type}`,
          duration: '1 hr'
        }] 
      };
    }));
    toast.success(`${type} added to trip`);
  };

  const handleSavePrefs = (prefs: UserPreferences) => {
    setUserPrefs(prefs);
    localStorage.setItem('explor_prefs', JSON.stringify(prefs));
  };

  const currentTrip = trips.find(t => t.id === selectedTripId);
  const tripPois = currentTrip ? currentTrip.items.filter(i => i.type === 'poi').map(item => mockPois.find(p => p.id === item.poiId)).filter(Boolean) as POI[] : [];

  return (
    <div className="relative w-full h-screen bg-[#121212] overflow-hidden font-sans text-white flex">
      <div className="absolute inset-0 h-full w-full">
        <MapView 
          pois={mockPois} 
          tripPois={tripPois}
          onPoiClick={handlePoiClick} 
          selectedPoiId={selectedPoiId}
          isModalOpen={activeModal !== 'none' && !isExpanded}
          isDiscoverOpen={activeModal === 'swipe' && !isExpanded}
          offsetYOverride={modalHeight}
          mapType={mapType}
        />
      </div>

      <AnimatePresence>
        {activeModal === 'none' && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpenTrips}
            className="absolute bottom-6 left-6 bg-[#3B82F6] p-4 rounded-full shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all z-[1000] flex items-center justify-center border border-white/20 active:scale-95 group"
          >
            <Route size={24} className="text-white group-hover:scale-110 transition-transform" />
          </motion.button>
        )}

        {/* Global Settings Modal / Onboarding */}
        <ProfileSettings 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onSave={handleSavePrefs} 
          initialPrefs={userPrefs} 
          isOnboarding={!userPrefs.hasSeenOnboarding} 
        />
      </AnimatePresence>

      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[2000] flex items-end justify-center pointer-events-none px-2 pb-3`}
          >
            <motion.div 
              layout
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className={`bg-[#1A1A1A] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto border border-white/10 ${
                isExpanded ? 'fixed inset-0 w-full h-[100dvh] rounded-none z-[3000]' : 
                'w-full max-w-[500px] rounded-t-[32px] md:rounded-[24px] relative self-end md:self-center'
              }`}
              style={!isExpanded ? { height: `${modalHeight}dvh` } : {}}
            >
              {/* Drag Handle */}
              {!isExpanded && (
                <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center z-[4000] cursor-ns-resize">
                  <motion.div 
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0}
                    onDrag={(_, info) => {
                      const deltaVH = (info.delta.y / window.innerHeight) * 100;
                      setModalHeight(prev => {
                        const next = prev - deltaVH;
                        return Math.min(Math.max(next, 25), 95);
                      });
                    }}
                    className="w-12 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                  />
                </div>
              )}

              {activeModal === 'trips' && (
                <TripsList 
                  trips={trips}
                  isExpanded={isExpanded}
                  onToggleExpand={handleToggleExpand}
                  onClose={handleCloseModal}
                  onOpenNewTrip={handleOpenNewTrip}
                  onOpenTripDetails={handleOpenTripDetails}
                  onDeleteTrip={handleDeleteTrip}
                  onRestoreTrip={handleRestoreTrip}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  isArchiveView={isArchiveView}
                  onToggleArchiveView={() => setIsArchiveView(!isArchiveView)}
                  archivedTrips={archivedTrips}
                  mapType={mapType}
                  setMapType={setMapType}
                  onMapTypeToggle={toggleMapType}
                />
              )}

              {activeModal === 'new-trip' && (
                <NewTripForm 
                  onClose={() => setActiveModal('trips')}
                  onCreate={handleCreateTrip}
                />
              )}

              {activeModal === 'trip-details' && selectedTripId && (
                <TripDetails 
                  trip={trips.find(t => t.id === selectedTripId)!}
                  allPois={mockPois}
                  isExpanded={isExpanded}
                  isMapSplit={false}
                  onToggleExpand={handleToggleExpand}
                  onToggleMapSplit={() => {}}
                  onClose={handleCloseModal}
                  onPoiClick={handlePoiClick}
                  onRemovePoi={(poiId) => handleRemovePoiFromTrip(selectedTripId, poiId)}
                  onAddCustomEvent={(type) => handleAddCustomEvent(selectedTripId, type)}
                  mapType={mapType}
                  setMapType={setMapType}
                  onMapTypeToggle={toggleMapType}
                />
              )}

              {activeModal === 'poi-details' && selectedPoiId && (
                <PoiDetails 
                  poi={mockPois.find(p => p.id === selectedPoiId)!}
                  trips={trips}
                  activeTripId={selectedTripId}
                  allPois={mockPois}
                  hideAddButton={selectedTripId ? trips.find(t => t.id === selectedTripId)?.items.some(i => i.poiId === selectedPoiId) : false}
                  onClose={() => setActiveModal(selectedTripId ? 'trip-details' : 'none')}
                  onAddToTrip={handleAddPoiToTrip}
                  onAddCustomEvent={(type) => handleAddCustomEvent(selectedTripId || trips[0]?.id, type)}
                  onViewOnMap={() => setActiveModal('none')}
                />
              )}

              {activeModal === 'swipe' && (
                <div className="relative w-full h-full flex flex-col bg-[#121212]">
                    <div className="flex justify-between items-center px-4 py-2.5 border-b border-white/5">
                      <div>
                        <h2 className="text-[15px] font-bold text-white leading-tight">Discover Places</h2>
                        {selectedTripId && (
                          <p className="text-[#3B82F6] text-[10px] font-bold tracking-widest uppercase">
                            Refining: {trips.find(t => t.id === selectedTripId)?.name}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        {!isExpanded && (
                          <button 
                            onClick={toggleMapType}
                            className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5"
                            title="Toggle Map Style"
                          >
                            <Layers size={14} className="text-[#3B82F6]" />
                          </button>
                        )}
                        <button 
                          onClick={handleToggleExpand}
                          className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5"
                        >
                          {isExpanded ? <Minimize2 size={14} className="text-gray-300" /> : <Maximize2 size={14} className="text-gray-300" />}
                        </button>
                        <button onClick={() => setActiveModal(selectedTripId ? 'trip-details' : 'trips')} className="p-1.5 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5 shadow-xl group">
                          <X size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <SwipeView 
                        pois={mockPois}
                        onSave={handleSwipeSave}
                        onSkip={() => {}}
                        onViewPoiChange={setSelectedPoiId}
                        activeFilter={swipeCategoryFilter || undefined}
                        onClearFilter={() => setSwipeCategoryFilter(null)}
                      />
                    </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-center" expand={false} richColors />
    </div>
  );
}
