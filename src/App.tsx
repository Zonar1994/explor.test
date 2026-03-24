import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, X, Maximize2, Minimize2 } from 'lucide-react';
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

  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
  }, [trips]);

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenTrips = () => setActiveModal('trips');
  const handleCloseModal = () => {
    setActiveModal('none');
    setIsExpanded(false);
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
    const targetTrip = trips.find(t => t.id === selectedTripId) || trips[0];
    if (targetTrip) {
      setTrips(trips.map(t => 
        t.id === targetTrip.id ? { ...t, pois: [...new Set([...t.pois, poiId])] } : t
      ));
      toast.success(`Saved ${poi?.name} to ${targetTrip.name}`);
    } else {
      toast.error("Create a trip first to save places!");
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#121212] overflow-hidden font-sans text-white flex">
      <div className="absolute inset-0 h-full w-full">
        <MapView 
          pois={mockPois} 
          onPoiClick={handlePoiClick} 
          selectedPoiId={selectedPoiId}
          isModalOpen={activeModal !== 'none' && !isExpanded}
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
                isExpanded ? 'fixed inset-0 w-full h-full rounded-none' : 
                'w-full max-w-[500px] h-[57vh] rounded-[24px] max-h-[600px] relative'
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
                  isMapSplit={false}
                  onToggleExpand={handleToggleExpand}
                  onToggleMapSplit={() => {}}
                  onClose={handleCloseModal}
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
