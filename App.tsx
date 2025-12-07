import React, { useState, useCallback } from 'react';
import { Language, NewsResult, TrackerState } from './types';
import { trackNewsTopic } from './services/geminiService';
import { LanguageSelector } from './components/LanguageSelector';
import { NewsCard } from './components/NewsCard';
import { NewspaperBackground } from './components/NewspaperBackground';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [state, setState] = useState<TrackerState>({
    isLoading: false,
    error: null,
    results: []
  });

  const handleTrack = useCallback(async (e?: React.FormEvent, overrideTopic?: string) => {
    if (e) e.preventDefault();
    const searchTopic = overrideTopic || topic;
    if (!searchTopic.trim()) return;

    if (!overrideTopic && !savedTopics.includes(searchTopic)) {
      setSavedTopics(prev => [searchTopic, ...prev]);
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await trackNewsTopic(searchTopic, language);
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: [result, ...prev.results] 
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Telegraph line down. Could not fetch news."
      }));
    }
  }, [topic, language, savedTopics]);

  return (
    <div className="relative h-screen w-full flex bg-[#E8E4D9] overflow-hidden font-body">
      
      {/* Vintage Background */}
      <NewspaperBackground />

      {/* Sidebar Navigation - The "Archive" */}
      <aside 
        className={`
          relative z-50 flex flex-col bg-[#F5F1E6] border-r-2 border-vintage-ink transition-all duration-300 ease-in-out shadow-depth
          ${isSidebarOpen ? 'w-80' : 'w-20'}
        `}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-20 pointer-events-none"></div>

        {/* Toggle Button (Bookmark style) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-10 w-8 h-12 bg-vintage-red text-[#F5F1E6] flex items-center justify-center hover:bg-[#600202] shadow-md z-50 rounded-r-md border-y border-r border-vintage-ink/50"
        >
           {isSidebarOpen ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
           ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
           )}
        </button>

        <div className={`p-6 border-b-4 border-double border-vintage-ink ${!isSidebarOpen && 'flex justify-center p-4'}`}>
          {isSidebarOpen ? (
            <div className="text-center">
               <h1 className="text-4xl font-headline font-black text-vintage-ink tracking-tight">PRESS<br/>RADAR</h1>
               <div className="w-16 h-1 bg-vintage-red mx-auto my-2"></div>
               <p className="font-typewriter text-xs text-vintage-brown">EST. 2025 • DAILY EDITION</p>
            </div>
          ) : (
            <div className="w-12 h-12 bg-vintage-ink text-[#F5F1E6] flex items-center justify-center font-headline text-2xl font-bold rounded-full border-2 border-[#F5F1E6]">
              P
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {/* Navigation Links */}
           <nav className="space-y-2">
             {['The Desk', 'Archives', 'Wire Service', 'Settings'].map((item, idx) => (
               <div 
                  key={item} 
                  className={`
                    cursor-pointer border-b border-vintage-ink/20 py-3 hover:bg-vintage-ink/5 transition-colors
                    ${idx === 0 ? 'font-bold text-vintage-red' : 'text-vintage-ink'}
                    ${!isSidebarOpen ? 'flex justify-center' : 'px-2'}
                  `}
               >
                  {isSidebarOpen ? (
                     <span className="font-headline text-lg uppercase tracking-wider">{item}</span>
                  ) : (
                     <span className="font-headline text-xl">{item[0]}</span>
                  )}
               </div>
             ))}
           </nav>

           {/* Saved Topics (Tracking) */}
           {isSidebarOpen && (
             <div className="mt-8">
               <h3 className="font-typewriter text-xs font-bold text-vintage-brown uppercase mb-3 border-b border-vintage-brown pb-1">
                 Tracking List
               </h3>
               {savedTopics.length === 0 ? (
                 <p className="text-xs italic text-gray-500 font-body">No keywords stored in ledger.</p>
               ) : (
                 <ul className="space-y-2">
                   {savedTopics.map((saved, idx) => (
                     <li key={idx} className="flex items-center group cursor-pointer" onClick={() => { setTopic(saved); handleTrack(undefined, saved); }}>
                       <span className="w-2 h-2 bg-vintage-red rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                       <span className="font-typewriter text-sm text-vintage-ink truncate decoration-vintage-red group-hover:underline">
                         {saved}
                       </span>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
           )}
        </div>
        
        {isSidebarOpen && (
          <div className="p-4 bg-[#EAE6DA] border-t-2 border-vintage-ink">
             <div className="flex items-center justify-between">
                <span className="font-typewriter text-[0.6rem] uppercase">System Status</span>
                <span className="w-2 h-2 bg-green-700 rounded-full animate-pulse"></span>
             </div>
             <p className="font-headline text-xs font-bold mt-1">TELETYPE ACTIVE</p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto h-full p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Title Block */}
          <div className="mb-8 text-center border-b-4 border-double border-vintage-ink pb-6 relative">
            <span className="absolute top-0 left-0 font-typewriter text-xs text-vintage-brown hidden md:block">VOL. DCCXXV</span>
            <span className="absolute top-0 right-0 font-typewriter text-xs text-vintage-brown hidden md:block">PRICE: 2 ANNAS</span>
            
            <h2 className="text-5xl md:text-7xl font-headline font-black uppercase leading-none text-vintage-ink mb-2">
              The Daily <span className="text-vintage-red">Briefing</span>
            </h2>
            <p className="font-typewriter text-sm md:text-base text-vintage-ink bg-[#F5F1E6] inline-block px-4 py-1 border border-vintage-ink transform -rotate-1 shadow-sm">
              YOUR PERSONAL NEWS AGGREGATOR & ARCHIVIST
            </p>
          </div>

          {/* Search/Input Panel */}
          <div className="bg-[#F5F1E6] p-6 border-2 border-vintage-ink shadow-paper mb-10 relative">
            <div className="absolute -top-3 left-6 bg-vintage-ink text-[#F5F1E6] px-3 py-1 font-typewriter text-xs tracking-widest uppercase">
               Request New Report
            </div>
            
            <form onSubmit={(e) => handleTrack(e)} className="space-y-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                   <label htmlFor="topic" className="block font-headline font-bold text-lg mb-2 text-vintage-ink">
                      Subject Matter
                   </label>
                   <div className="relative">
                     <input
                      id="topic"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. 'Tata Motors', 'Monsoon Update'..."
                      className="w-full p-3 bg-[#E8E4D9] border-b-2 border-vintage-ink font-typewriter text-lg focus:outline-none focus:bg-white transition-colors placeholder:text-gray-500/50 text-vintage-ink"
                     />
                     <div className="absolute bottom-0 right-0 mb-3 mr-3 text-vintage-red opacity-50">
                       ✎
                     </div>
                   </div>
                </div>
                
                <div className="md:col-span-4">
                  <LanguageSelector selected={language} onChange={setLanguage} />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-vintage-ink/20 border-dashed">
                <span className="text-[0.6rem] font-typewriter text-gray-500 w-1/2">
                   *System searches daily e-papers and web indices for mentions.
                </span>
                <button
                  type="submit"
                  disabled={state.isLoading || !topic}
                  className={`
                    px-6 py-2 bg-vintage-ink text-[#F5F1E6] font-headline font-bold text-lg uppercase tracking-wider border border-transparent
                    hover:bg-vintage-red transition-all shadow-paper active:translate-y-1
                    ${state.isLoading ? 'opacity-80 cursor-wait' : ''}
                  `}
                >
                  {state.isLoading ? 'FETCHING WIRE...' : 'DISPATCH'}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="mb-8 bg-[#F8d7da] border-2 border-vintage-red p-4 flex items-center text-vintage-red font-typewriter">
              <span className="text-2xl mr-4">⚠</span>
              <p>{state.error}</p>
            </div>
          )}

          {/* Results Feed */}
          <div className="space-y-12 pb-12">
            {state.results.length === 0 && !state.isLoading && !state.error && (
              <div className="flex flex-col items-center justify-center p-12 opacity-60">
                 <div className="w-16 h-16 border-4 border-vintage-ink rounded-full flex items-center justify-center mb-4">
                    <span className="font-headline text-3xl">?</span>
                 </div>
                 <p className="font-typewriter text-vintage-ink text-center">
                   The desk is clear.<br/>Enter a topic to receive the latest wire dispatch.
                 </p>
              </div>
            )}
            
            {state.results.map((result) => (
              <NewsCard key={result.id} result={result} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;