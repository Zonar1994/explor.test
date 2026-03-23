import React from 'react';
import { Route, X, Plus } from 'lucide-react';
import { Trip } from '../../types';

interface NewTripFormProps {
  onClose: () => void;
  onCreate: (trip: Trip) => void;
}

export function NewTripForm({ onClose, onCreate }: NewTripFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: formData.get('name') as string || 'New Trip',
      start: formData.get('start') as string || 'TBD',
      end: formData.get('end') as string || 'TBD',
      pois: []
    };
    onCreate(newTrip);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <Route size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">New Trip</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-[#333333] rounded-full hover:bg-gray-600 transition-colors">
          <X size={18} className="text-gray-300" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Trip Name</label>
          <input 
            name="name"
            type="text" 
            placeholder="All the way to Norway!" 
            className="w-full bg-[#333333] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Start</label>
            <input 
              name="start"
              type="text" 
              placeholder="DD-MM-YYYY" 
              className="w-full bg-[#333333] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">End (optional)</label>
            <input 
              name="end"
              type="text" 
              placeholder="DD-MM-YYYY" 
              className="w-full bg-[#333333] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Members</label>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#222222]" />
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#222222]" />
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#222222]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#333333] border-2 border-[#222222] flex items-center justify-center text-xs text-gray-300">
              +2
            </div>
            <button type="button" className="w-8 h-8 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors ml-2">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-3 mt-4 bg-[#2A2A2A] hover:bg-[#333333] text-gray-200 font-medium rounded-xl transition-colors border border-[#333333]"
        >
          Create Trip
        </button>
      </form>
    </>
  );
}
