
import React, { useState } from 'react';
import { TrackedTopic, Language } from '../types';

interface WatchlistPanelProps {
  watchlist: TrackedTopic[];
  onAdd: (topic: Partial<TrackedTopic>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isDarkMode: boolean;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ watchlist, onAdd, onDelete, onToggle, isDarkMode }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTopic, setNewTopic] = useState({ keyword: '', context: '', language: Language.ENGLISH });

  const handleAdd = () => {
    if (!newTopic.keyword) return;
    onAdd(newTopic);
    setNewTopic({ keyword: '', context: '', language: Language.ENGLISH });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b-2 border-vintage-ink pb-2 mb-6 dark:border-noir-ink-muted">
        <div>
          <h2 className="font-headline text-3xl font-black uppercase text-vintage-ink dark:text-noir-ink">Intelligence Ledger</h2>
          <p className="font-typewriter text-xs text-vintage-brown dark:text-noir-ink-muted">Your Daily Tracked Subjects</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-vintage-ink text-white px-4 py-1 font-headline text-sm uppercase hover:bg-vintage-red transition-colors dark:bg-noir-red dark:text-noir-bg"
        >
          {isAdding ? 'Close' : 'Add Subject'}
        </button>
      </div>

      {isAdding && (
        <div className="p-6 border-2 border-dashed border-vintage-ink bg-white/50 dark:bg-noir-paper-light dark:border-noir-ink/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-headline font-bold text-xs uppercase mb-1 dark:text-noir-ink">Primary Keyword</label>
              <input 
                className="w-full bg-transparent border-b-2 border-vintage-ink p-2 font-typewriter dark:text-noir-ink"
                placeholder="e.g. Reliance Power"
                value={newTopic.keyword}
                onChange={e => setNewTopic({...newTopic, keyword: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-headline font-bold text-xs uppercase mb-1 dark:text-noir-ink">Context / Instructions</label>
              <input 
                className="w-full bg-transparent border-b-2 border-vintage-ink p-2 font-typewriter dark:text-noir-ink"
                placeholder="Focus on debt updates..."
                value={newTopic.context}
                onChange={e => setNewTopic({...newTopic, context: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleAdd}
              className="bg-vintage-red text-white px-6 py-2 font-headline font-bold uppercase text-sm dark:bg-noir-ink dark:text-noir-bg"
            >
              Authorize Tracking
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {watchlist.length === 0 ? (
          <div className="text-center p-12 opacity-50 border-2 border-dashed border-vintage-ink/20 dark:border-noir-ink/10">
            <p className="font-typewriter">Ledger is empty. No subjects currently under surveillance.</p>
          </div>
        ) : (
          watchlist.map((item) => (
            <div key={item.id} className="group relative bg-[#FDFBF7] dark:bg-[#252525] border-2 border-vintage-ink p-4 flex justify-between items-center hover:shadow-paper transition-all">
              <div className={`${!item.isActive ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex items-center space-x-2">
                  <h4 className="font-headline font-bold text-xl uppercase text-vintage-ink dark:text-noir-ink">{item.keyword}</h4>
                  <span className="bg-vintage-ink/10 dark:bg-white/10 px-2 py-0.5 rounded text-[0.6rem] font-bold font-typewriter text-vintage-brown dark:text-noir-ink-muted">
                    {item.language.toUpperCase()}
                  </span>
                </div>
                <p className="font-typewriter text-xs text-gray-600 dark:text-gray-400 italic">"{item.context || 'General Surveillance'}"</p>
                <p className="text-[0.6rem] font-mono text-gray-400 mt-1 uppercase tracking-tighter">ID: {item.id.slice(0,8)} | CREATED: {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onToggle(item.id)}
                  className={`px-3 py-1 font-headline text-xs uppercase border-2 transition-colors ${item.isActive ? 'bg-vintage-ink text-white dark:bg-noir-ink dark:text-noir-bg' : 'border-vintage-ink/30 text-vintage-ink/30 dark:border-noir-ink/20 dark:text-noir-ink/20'}`}
                >
                  {item.isActive ? 'Active' : 'Halted'}
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-vintage-red hover:scale-110 transition-transform dark:text-noir-red"
                  title="Expunge Record"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
