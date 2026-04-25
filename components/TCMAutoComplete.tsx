import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TCM_SUGGESTIONS } from '../constants/tcmSuggestions';

interface Props {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (values: string[]) => void;
  // Make sure it allows specific keys of TCM_SUGGESTIONS
  category: keyof typeof TCM_SUGGESTIONS;
  maxPilihions?: number;
}

const TCMAutoComplete: React.FC<Props> = ({ label, placeholder, value, onChange, category, maxPilihions = 8 }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const availableItems = TCM_SUGGESTIONS[category] || [];
    const filtered = availableItems.filter(item =>
      item.toLowerCase().includes(input.toLowerCase()) && !value.includes(item)
    );
    setSuggestions(filtered.slice(0, 12));
  }, [input, value, category]);

  const addItem = (item: string) => {
    if (value.length >= maxPilihions) return;
    onChange([...value, item]);
    setInput('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      e.preventDefault();
      const match = suggestions.find(s => s.toLowerCase() === input.trim().toLowerCase());
      if (match) {
        addItem(match);
      } else {
        // Option to add custom item not in suggestion list? Let's just add it
        addItem(input.trim());
      }
    }
  };

  const removeItem = (item: string) => {
    onChange(value.filter(i => i !== item));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-black uppercase tracking-widest text-purple-700 mb-2">{label}</label>

      {/* Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-5 py-4 bg-purple-50/50 border border-purple-200 rounded-3xl focus:border-purple-400 focus:bg-white transition-all focus:outline-none text-sm text-purple-900"
        />
      </div>

      {/* Chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 p-2 bg-purple-50 rounded-2xl border border-purple-100">
          {value.map((item, i) => (
            <div key={i} className="bg-white border border-purple-200 text-purple-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm animate-fade-in">
              {item}
              <button 
                onClick={() => removeItem(item)}
                className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-purple-200 rounded-3xl shadow-2xl max-h-60 overflow-auto py-2 divide-y divide-purple-50">
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              onClick={() => addItem(suggestion)}
              className="px-6 py-3 hover:bg-purple-50 cursor-pointer text-purple-800 text-sm font-medium transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TCMAutoComplete;
