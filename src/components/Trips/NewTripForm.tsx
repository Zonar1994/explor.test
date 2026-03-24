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
      items: []
    };
    onCreate(newTrip);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-2 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Route size={18} className="text-white" />
          </div>
          <h2 className="text-[16px] font-bold tracking-tight">New Trip</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-[#2A2A2A] rounded-full hover:bg-[#333333] transition-colors flex items-center justify-center border border-white/5">
          <X size={16} className="text-gray-300" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-5 flex-1 overflow-visible">
        <div>
          <label className="block text-[12px] font-medium text-gray-500 mb-1.5 px-1">Trip Name</label>
          <input 
            name="name"
            type="text" 
            placeholder="All the way to Norway!" 
            className="w-full bg-[#2A2A2A] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/10 border border-white/5 transition-all text-[14px] font-medium placeholder:text-gray-600"
            required
          />
        </div>
        
        <div className="flex gap-4 relative z-[1000]">
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 px-1 text-gray-400 focus-within:text-blue-400 transition-colors">Start</label>
            <div className="rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50">
              <DatePicker 
                name="start"
                value={startDate}
                onChange={(v) => { 
                  setStartDate(v); 
                  setError(null);
                }}
                placeholder="Start Date"
                align="left"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 px-1 text-gray-400 focus-within:text-blue-400 transition-colors">End (optional)</label>
            <div className="rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50">
              <DatePicker 
                name="end"
                value={endDate}
                onChange={(v) => { 
                  setEndDate(v); 
                  setError(null);
                }}
                placeholder="End Date"
                align="right"
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-red-400 bg-red-400/10 px-3 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 border border-red-400/20">
            <X size={16} /> {error}
          </div>
        )}

        <div>
          <label className="block text-[12px] font-medium text-gray-500 mb-2 px-1">Members</label>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="m1" className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="m2" className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] object-cover" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="m3" className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] object-cover" />
              <div className="w-8 h-8 rounded-full bg-[#2A2A2A] border-2 border-[#1A1A1A] flex items-center justify-center text-[10px] font-bold text-gray-400">
                +2
              </div>
            </div>
            <button type="button" className="w-8 h-8 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all bg-[#1A1A1A]">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <button 
            type="submit"
            className="w-full py-3 bg-transparent hover:bg-white/[0.03] text-gray-200 hover:text-white font-bold rounded-xl transition-all border border-white/10 shadow-lg active:scale-[0.98] text-[14px]"
          >
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
}
