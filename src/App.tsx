import React, { useState } from 'react';
import { Route } from 'lucide-react';
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
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Handlers ---
  const handleOpenTrips = () => setActiveModal('trips');
  const handleCloseModal = () => {
    setActiveModal('none');
    setIsExpanded(false);
  };
  
  const handleToggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleOpenNewTrip = () => setActiveModal('new-trip');
  
  const handleCreateTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setActiveModal('trips');
  };

  const handleOpenTripDetails = (id: string) => {
    setSelectedTripId(id);
    setActiveModal('trip-details');
  };

  const handlePoiClick = (id: string) => {
    if (id === 'swipe') {
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

  const handleSwipeSave = (poiId: string) => {
    const poi = mockPois.find(p => p.id === poiId);
    const targetTrip = trips[0];
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
    <div className="relative w-full h-screen bg-[#121212] overflow-hidden font-sans text-white">
      <Toaster position="top-center" theme="dark" closeButton richColors />
      {/* Main Map View */}
      <MapView 
        pois={mockPois} 
        onPoiClick={handlePoiClick} 
      />

      {/* Main Trigger Button (Bottom Left) - Hidden if modal is open */}
      {activeModal === 'none' && (
        <button 
          onClick={handleOpenTrips}
          className="absolute bottom-8 left-8 bg-blue-600 p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors z-[1000] flex items-center justify-center"
        >
          <Route size={28} className="text-white" />
        </button>
      )}

      {/* Modals Overlay */}
      {activeModal !== 'none' && (
        <div className={`absolute inset-0 z-[2000] flex items-center justify-center pointer-events-none ${isExpanded ? '' : 'p-4 sm:p-8'}`}>
          {/* Modal Container */}
          <div className={`bg-[#1A1A1A] w-full ${isExpanded ? 'max-w-none h-full rounded-none' : 'max-w-md h-[85vh] rounded-2xl'} shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-[#333333] transition-all duration-300 ease-in-out`}>
            
            {activeModal === 'trips' && (
              <TripsList 
                trips={trips}
                isExpanded={isExpanded}
                onToggleExpand={handleToggleExpand}
                onClose={handleCloseModal}
                onOpenNewTrip={handleOpenNewTrip}
                onOpenTripDetails={handleOpenTripDetails}
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
                onToggleExpand={handleToggleExpand}
                onClose={() => setActiveModal('trips')}
                onPoiClick={handlePoiClick}
              />
            )}

            {activeModal === 'poi-details' && selectedPoiId && (
              <PoiDetails 
                poi={mockPois.find(p => p.id === selectedPoiId)!}
                trips={trips}
                onClose={handleCloseModal}
                onAddToTrip={handleAddPoiToTrip}
              />
            )}

            {activeModal === 'swipe' && (
              <div className="relative w-full h-full flex flex-col bg-[#121212]">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                  <h2 className="text-2xl font-bold text-white">Discover</h2>
                  <button onClick={() => setActiveModal('trips')} className="p-2 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors border border-white/5">
                    <Route size={20} className="text-gray-300" />
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

          </div>
        </div>
      )}
    </div>
  );
}
