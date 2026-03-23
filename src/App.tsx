import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, X, Navigation } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { MapView } from './components/Map/MapView';
import { TripsList } from './components/Trips/TripsList';
import { TripDetails } from './components/Trips/TripDetails';
import { PoiDetails } from './components/Trips/PoiDetails';
import { NewTripForm } from './components/Trips/NewTripForm';
import { SwipeView } from './components/Swipe/SwipeView';
import { initialTrips, mockPois } from './data/mockData';
import { Trip, ModalState } from './types';

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalState>('trips');
  
  // Load trips from localStorage or use initialTrips
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('travel_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialTrips;
      }
    }
    return initialTrips;
  });

  // Save trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
  }, [trips]);

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMapSplit, setIsMapSplit] = useState(false);

  // --- Handlers ---
  const handleOpenTrips = () => setActiveModal('trips');
  const handleCloseModal = () => {
    setActiveModal('none');
    setIsExpanded(false);
    setIsMapSplit(false);
  };
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) setIsMapSplit(false); // Can't be split and full screen at once
  };

  const handleToggleMapSplit = () => {
    setIsMapSplit(!isMapSplit);
    if (!isMapSplit) setIsExpanded(false); // Can't be split and full screen at once
  };
  
  const handleOpenNewTrip = () => setActiveModal('new-trip');
  
  const handleCreateTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setActiveModal('trips');
    toast.success('Trip created successfully!');
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    toast.success("Trip deleted successfully");
    if (selectedTripId === id) {
      setSelectedTripId(null);
      setActiveModal('trips');
    }
  };

  const handleOpenTripDetails = (id: string) => {
    setSelectedTripId(id);
    setActiveModal('trip-details');
  };

  const handlePoiClick = (id: string) => {
    if (id === 'swipe') {
      setIsExpanded(true);
      setActiveModal('swipe');
    } else {
      setSelectedPoiId(id);
      setActiveModal('poi-details');
    }
  };

  const handleAddPoiToTrip = (tripId: string, poiId: string) => {
    const poi = mockPois.find(p => p.id === poiId);
    setTrips(trips.map(t => 
      t.id === tripId ? { ...t, pois: [...new Set([...t.pois, poiId])] } : t
    ));
    toast.success(`Added ${poi?.name} to ${trips.find(t => t.id === tripId)?.name}`);
    setActiveModal('trip-details');
    setSelectedTripId(tripId);
  };

  const handleRemovePoiFromTrip = (tripId: string, poiId: string) => {
    setTrips(trips.map(t => 
      t.id === tripId ? { ...t, pois: t.pois.filter(id => id !== poiId) } : t
    ));
    toast.success('Place removed from trip');
  };

  const handleSwipeSave = (poiId: string) => {
    const poi = mockPois.find(p => p.id === poiId);
    const targetTrip = trips[0]; // Logic could be more sophisticated
    if (targetTrip) {
      setTrips(trips.map(t => 
        t.id === targetTrip.id ? { ...t, pois: [...new Set([...t.pois, poiId])] } : t
      ));
      toast.success(`Saved ${poi?.name} to ${targetTrip.name}`, {
        description: "You can find it in your trip details.",
        duration: 3000,
      });
    } else {
      toast.error("Create a trip first to save places!");
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#121212] overflow-hidden font-sans text-white flex">
      {/* Main Map View - Width changes in split mode */}
      <motion.div 
        animate={{ width: isMapSplit ? '25%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-full relative overflow-hidden"
      >
        <MapView 
          pois={mockPois} 
          onPoiClick={handlePoiClick} 
          selectedPoiId={selectedPoiId}
        />
      </motion.div>

      {/* Main Trigger Button (Bottom Left) - Hidden if modal is open */}
      <AnimatePresence>
        {activeModal === 'none' && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpenTrips}
            className="absolute bottom-10 left-10 bg-[#3B82F6] p-6 rounded-full shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all z-[1000] flex items-center justify-center border border-white/20 active:scale-95 group"
          >
            <Route size={36} className="text-white group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modals Overlay */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[2000] flex pointer-events-none ${
              isExpanded ? 'items-center justify-center' : 
              isMapSplit ? 'justify-end items-stretch' : 
              'items-end justify-start p-6 sm:p-10 pb-10'
            }`}
          >
            {/* Modal Container */}
            <motion.div 
              layout
              initial={{ x: isMapSplit ? 400 : 0, y: isMapSplit ? 0 : 50, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              exit={{ x: isMapSplit ? 400 : 0, y: isMapSplit ? 0 : 50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className={`bg-[#1A1A1A] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col pointer-events-auto border border-white/10 ${
                isExpanded ? 'w-full h-full max-w-none rounded-none border-0' : 
                isMapSplit ? 'w-3/4 h-full rounded-l-[40px] border-y-0 border-r-0' : 
                'w-[95%] sm:w-[500px] md:w-[600px] h-[58vh] rounded-[40px] max-h-[800px]'
              }`}
            >
              
              {activeModal === 'trips' && (
                <TripsList 
                  trips={trips}
                  isExpanded={isExpanded}
                  onToggleExpand={handleToggleExpand}
                  onClose={handleCloseModal}
                  onOpenNewTrip={handleOpenNewTrip}
                  onOpenTripDetails={handleOpenTripDetails}
                  onDeleteTrip={handleDeleteTrip}
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
                  isMapSplit={isMapSplit}
                  onToggleExpand={handleToggleExpand}
                  onToggleMapSplit={handleToggleMapSplit}
                  onClose={() => setActiveModal('trips')}
                  onPoiClick={handlePoiClick}
                  onRemovePoi={(poiId) => handleRemovePoiFromTrip(selectedTripId, poiId)}
                />
              )}

              {activeModal === 'poi-details' && selectedPoiId && (
                <PoiDetails 
                  poi={mockPois.find(p => p.id === selectedPoiId)!}
                  trips={trips}
                  onClose={() => setActiveModal(selectedTripId ? 'trip-details' : 'none')}
                  onAddToTrip={handleAddPoiToTrip}
                  onViewOnMap={() => setActiveModal('none')}
                />
              )}

              {activeModal === 'swipe' && (
                <div className="relative w-full h-full flex flex-col bg-[#121212]">
                  {/* Map Toggle "comes from the top" */}
                  <motion.button
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={handleToggleMapSplit}
                    className={`absolute top-0 left-1/2 -translate-x-1/2 z-[3000] px-6 py-2 rounded-b-2xl border-x border-b transition-all flex items-center gap-2 font-bold text-sm shadow-xl ${
                      isMapSplit 
                        ? 'bg-blue-600 border-blue-400 text-white' 
                        : 'bg-[#2A2A2A] border-white/10 text-gray-400 hover:text-white hover:bg-[#333333]'
                    }`}
                  >
                    <Navigation size={16} className={isMapSplit ? 'fill-white' : ''} />
                    {isMapSplit ? 'Close Map' : 'Split Map'}
                  </motion.button>

                  <div className="flex justify-between items-center p-8 pb-6 border-b border-white/5 pt-10">
                    <div>
                      <h2 className="text-[26px] font-bold text-white leading-tight">Discover Places</h2>
                      {selectedTripId && (
                        <p className="text-[#3B82F6] text-sm font-bold tracking-widest uppercase mt-1">
                          Refining: {trips.find(t => t.id === selectedTripId)?.name}
                        </p>
                      )}
                    </div>
                    <button onClick={() => setActiveModal(selectedTripId ? 'trip-details' : 'trips')} className="p-3 bg-[#2A2A2A] rounded-full hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5 shadow-xl group">
                      <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <SwipeView 
                      pois={mockPois}
                      onSave={handleSwipeSave}
                      onSkip={() => {}}
                    />
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
