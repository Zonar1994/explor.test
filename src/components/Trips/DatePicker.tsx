import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, startOfWeek, endOfMonth, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, isValid } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  name: string;
  align?: 'left' | 'right' | 'center';
  isOpen?: boolean;
  onToggle?: () => void;
}

export function DatePicker({ value, onChange, placeholder, name, align = 'center', isOpen: externalIsOpen, onToggle }: DatePickerProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(val);
    }
  };
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = value ? parseISO(value) : new Date();
    return isValid(d) ? d : new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : null;

  const renderDays = () => {
    const dateFormat = "cccccc"; // e.g. "Mo", "Tu"
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-gray-500 font-bold text-[10px] uppercase tracking-wider text-center pb-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        days.push(
          <button
            type="button"
            key={day.toString()}
            disabled={!isCurrentMonth}
            onClick={(e) => {
              e.stopPropagation();
              onChange(format(cloneDay, 'yyyy-MM-dd'));
              if (onToggle) {
                // Let the parent know we're done here
                // We don't call anything here, parent's onChange will handle it
              } else {
                setInternalIsOpen(false);
              }
            }}
            className={`w-full aspect-square max-w-[32px] mx-auto flex justify-center items-center text-[13px] font-bold rounded-full transition-all ${
              !isCurrentMonth ? "text-gray-700 opacity-50" :
              isSelected ? "bg-[#3B82F6] text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]" : 
              "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-y-1 mb-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#2A2A2A] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/10 border border-white/5 transition-all text-left flex items-center justify-between group h-[48px]"
      >
        <span className={value ? "text-gray-100 font-medium text-[14px]" : "text-gray-500 font-medium text-[14px]"}>
          {value && isValid(parseISO(value)) ? format(parseISO(value), "MMM d, yyyy") : placeholder}
        </span>
        <CalendarIcon size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
      </button>

      {isOpen && (
        <div className={`absolute z-[3000] mt-3 p-4 bg-[#1F1F1F] border border-white/10 rounded-[28px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] w-[290px] xs:w-[320px] sm:w-[350px] animate-in fade-in zoom-in-95 duration-200 ${
          align === 'left' ? 'left-0 origin-top-left' :
          align === 'right' ? 'right-0 origin-top-right' :
          'left-1/2 -translate-x-1/2 origin-top'
        }`}>
          <div className="flex justify-between items-center mb-4 px-1">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/10 bg-[#2A2A2A] border border-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft size={14} />
            </button>
            <h2 className="font-bold text-white text-[15px] tracking-tight">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/10 bg-[#2A2A2A] border border-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
}
