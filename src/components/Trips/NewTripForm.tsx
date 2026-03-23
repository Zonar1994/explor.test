import React, { useState } from 'react';
import { Route, X, Plus } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { Trip } from '../../types';

interface NewTripFormProps {
  onClose: () => void;
  onCreate: (trip: Trip) => void;
}

export function NewTripForm({ onClose, onCreate }: NewTripFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (startDate && endDate && endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }
    setError(null);
    const formData = new FormData(e.currentTarget);
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: formData.get('name') as string || 'New Trip',
      start: formData.get('start') as string || 'TBD',
      end: (formData.get('end') as string) || 'TBD',
      pois: []
    };
    onCreate(newTrip);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">New Trip</h2>
        </div>
        <button onClick={onClose} className="p-2.5 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5">
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-6 flex-1 overflow-visible">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 px-1">Trip Name</label>
          <input 
            name="name"
            type="text" 
            placeholder="All the way to Norway!" 
            className="w-full bg-[#2A2A2A] text-white rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-white/10 border border-white/5 transition-all text-lg font-medium placeholder:text-gray-600"
            required
          />
        </div>
        
        <div className="flex gap-4 relative z-[1000]">
          <div className="flex-1">
            <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Start</label>
            <DatePicker 
              name="start"
              value={startDate}
              onChange={(v) => { setStartDate(v); setError(null); }}
              placeholder="Start Date"
              align="left"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">End (optional)</label>
            <DatePicker 
              name="end"
              value={endDate}
              onChange={(v) => { setEndDate(v); setError(null); }}
              placeholder="End Date"
              align="right"
            />
          </div>
        </div>
        
        {error && (
          <div className="text-red-400 bg-red-400/10 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 border border-red-400/20">
            <X size={16} /> {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-3 px-1">Members</label>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="m1" className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="m2" className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="m3" className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover" />
              <div className="w-10 h-10 rounded-full bg-[#2A2A2A] border-2 border-[#1A1A1A] flex items-center justify-center text-xs font-bold text-gray-400">
                +2
              </div>
            </div>
            <button type="button" className="w-10 h-10 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all bg-[#1A1A1A]">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <button 
            type="submit"
            className="w-full py-4 bg-transparent hover:bg-white/[0.03] text-gray-200 hover:text-white font-bold rounded-2xl transition-all border border-white/10 shadow-lg active:scale-[0.98] text-lg"
          >
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
}
