import React from 'react';
import { PREDEFINED_SOURCES } from '../types';

interface SourceSelectorProps {
  selectedSources: string[];
  onChange: (sources: string[]) => void;
  includeEPapers: boolean;
  onEPaperChange: (checked: boolean) => void;
}

export const SourceSelector: React.FC<SourceSelectorProps> = ({ 
  selectedSources, 
  onChange,
  includeEPapers,
  onEPaperChange
}) => {
  
  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      onChange(selectedSources.filter(s => s !== source));
    } else {
      onChange([...selectedSources, source]);
    }
  };

  return (
    <div className="p-4 border border-dashed border-vintage-ink/50 dark:border-noir-ink/30 bg-vintage-paper-light/50 dark:bg-noir-paper-light/50 rounded-sm mb-6">
      <h3 className="font-headline font-bold text-sm mb-3 uppercase tracking-wider text-vintage-ink dark:text-noir-ink border-b border-vintage-ink/20 pb-1">
        The Newsstand (Source Filter)
      </h3>
      
      {/* Newspaper Checklist */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {PREDEFINED_SOURCES.map((source) => (
          <label key={source} className="flex items-center space-x-2 cursor-pointer group">
            <div className={`
              w-4 h-4 border-2 flex items-center justify-center transition-colors
              ${selectedSources.includes(source) 
                ? 'bg-vintage-red border-vintage-red dark:bg-noir-red dark:border-noir-red' 
                : 'border-vintage-ink dark:border-noir-ink-muted'}
            `}>
              {selectedSources.includes(source) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`font-typewriter text-xs ${selectedSources.includes(source) ? 'text-vintage-ink font-bold dark:text-noir-ink' : 'text-gray-500 dark:text-gray-500'}`}>
              {source}
            </span>
          </label>
        ))}
      </div>

      {/* E-Paper Toggle */}
      <div className="flex items-center space-x-3 pt-3 border-t border-vintage-ink/10 dark:border-white/10">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={includeEPapers} 
              onChange={(e) => onEPaperChange(e.target.checked)} 
            />
            <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${includeEPapers ? 'bg-vintage-gold dark:bg-noir-gold' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow transition-transform ${includeEPapers ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
          <span className="ml-2 font-headline text-xs font-bold text-vintage-brown dark:text-noir-ink">
            Find E-Paper / PDF Links (tradingref etc.)
          </span>
        </label>
      </div>
    </div>
  );
};