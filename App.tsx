import React, { useState, useCallback, useEffect } from 'react';
import { Language, NewsResult, TrackerState } from './types';
import { trackNewsTopic } from './services/geminiService';
import { LanguageSelector } from './components/LanguageSelector';
import { NewsCard } from './components/NewsCard';
import { NewspaperBackground } from './components/NewspaperBackground';
import { SourceSelector } from './components/SourceSelector';

const STORAGE_KEY = 'pressradar_history';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // New State for Features
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [includeEPapers, setIncludeEPapers] = useState(false);
  const [history, setHistory] = useState<NewsResult[]>([]);
  const [viewMode, setViewMode] = useState<'live' | 'archives'>('live');

  // Default to false (Vintage Light), user can toggle to True (Noir Dark)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [state, setState] = useState<TrackerState>({
    isLoading: false,
    error: null,
    results: []
  });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load archives");
      }
    }
  }, []);

  // Save to history helper
  const addToHistory = (result: NewsResult) => {
    const updated = [result, ...history].slice(0, 50); // Keep last 50
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleTrack = useCallback(async (e?: React.FormEvent, overrideTopic?: string, isWire: boolean = false) => {
    if (e) e.preventDefault();
    const searchTopic = overrideTopic || topic;
    
    // If not wire and no topic, do nothing
    if (!isWire && !searchTopic.trim()) return;

    setViewMode('live');
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await trackNewsTopic({
        topic: searchTopic,
        language,
        selectedSources,
        includeEPapers,
        isWireRequest: isWire
      });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: [result, ...prev.results] 
      }));
      
      addToHistory(result);

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Telegraph line down. Could not fetch news."
      }));
    }
  }, [topic, language, selectedSources, includeEPapers, history]);

  // Load a result from archives
  const loadFromArchive = (result: NewsResult) => {
    setViewMode('live');
    setState(prev => ({
      ...prev,
      results: [result],
      error: null
    }));
    // On mobile, close sidebar
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-full`}>
      <div className="relative h-screen w-full flex overflow-hidden font-body bg-vintage-paper dark:bg-noir-bg transition-colors duration-500">
        
        {/* Background Component */}
        <NewspaperBackground />

        {/* Sidebar Navigation */}
        <aside 
          className={`
            relative z-50 flex flex-col border-r-2 transition-all duration-300 ease-in-out shadow-depth
            bg-vintage-paper-light border-vintage-ink 
            dark:bg-noir-paper dark:border-noir-paper-light
            ${isSidebarOpen ? 'w-80' : 'w-20'}
          `}
        >
          {/* Sidebar Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-20 pointer-events-none dark:opacity-5"></div>

          {/* Toggle Button for Sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-4 top-10 w-8 h-12 flex items-center justify-center shadow-md z-50 rounded-r-md border-y border-r transition-colors
              bg-vintage-red text-vintage-paper-light border-vintage-ink/50 hover:bg-[#600202]
              dark:bg-noir-red dark:text-noir-bg dark:border-none dark:hover:bg-red-500"
          >
             {isSidebarOpen ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
             ) : (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             )}
          </button>

          {/* Sidebar Header */}
          <div className="p-6 border-b-4 border-double border-vintage-ink dark:border-noir-paper-light transition-colors">
            {isSidebarOpen ? (
              <div className="text-center">
                 <h1 className="text-4xl font-headline font-black tracking-tight text-vintage-ink dark:text-noir-ink">PRESS<br/>RADAR</h1>
                 <div className="w-16 h-1 bg-vintage-red dark:bg-noir-red mx-auto my-2"></div>
                 <p className="font-typewriter text-xs text-vintage-brown dark:text-noir-ink-muted">EST. 2025 • DAILY EDITION</p>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <div className="w-12 h-12 flex items-center justify-center font-headline text-2xl font-bold rounded-full border-2 
                  bg-vintage-ink text-vintage-paper-light border-vintage-paper-light
                  dark:bg-noir-paper-light dark:text-noir-ink dark:border-noir-ink">
                  P
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {/* Navigation Links */}
             <nav className="space-y-2">
               <div 
                  onClick={() => setViewMode('live')}
                  className={`cursor-pointer border-b py-3 transition-colors ${viewMode === 'live' ? 'font-bold text-vintage-red dark:text-noir-red' : 'text-vintage-ink dark:text-noir-ink'} border-vintage-ink/20 hover:bg-vintage-ink/5 dark:border-noir-ink/10 dark:hover:bg-white/5 ${!isSidebarOpen ? 'flex justify-center' : 'px-2'}`}
               >
                  {isSidebarOpen ? <span className="font-headline text-lg uppercase tracking-wider">The Desk</span> : <span className="font-headline text-xl">D</span>}
               </div>

               <div 
                  onClick={() => setViewMode('archives')}
                  className={`cursor-pointer border-b py-3 transition-colors ${viewMode === 'archives' ? 'font-bold text-vintage-red dark:text-noir-red' : 'text-vintage-ink dark:text-noir-ink'} border-vintage-ink/20 hover:bg-vintage-ink/5 dark:border-noir-ink/10 dark:hover:bg-white/5 ${!isSidebarOpen ? 'flex justify-center' : 'px-2'}`}
               >
                  {isSidebarOpen ? <span className="font-headline text-lg uppercase tracking-wider">Archives</span> : <span className="font-headline text-xl">A</span>}
               </div>

               <div 
                  onClick={() => handleTrack(undefined, undefined, true)}
                  className={`cursor-pointer border-b py-3 transition-colors text-vintage-ink dark:text-noir-ink border-vintage-ink/20 hover:bg-vintage-red hover:text-white dark:border-noir-ink/10 dark:hover:bg-noir-red ${!isSidebarOpen ? 'flex justify-center' : 'px-2'}`}
               >
                  {isSidebarOpen ? (
                     <div className="flex justify-between items-center w-full">
                       <span className="font-headline text-lg uppercase tracking-wider">Wire Service</span>
                       <span className="text-[0.6rem] font-bold bg-vintage-ink text-white px-1 rounded">LIVE</span>
                     </div>
                  ) : <span className="font-headline text-xl">W</span>}
               </div>
             </nav>

             {/* Dark Mode Toggle */}
             {isSidebarOpen && (
               <div className="pt-2">
                 <div 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex items-center justify-between cursor-pointer group bg-black/5 dark:bg-white/5 p-3 rounded border border-transparent hover:border-vintage-ink/30 dark:hover:border-noir-ink/30"
                 >
                    <div className="flex items-center">
                       <span className="text-xl mr-3">{isDarkMode ? '🌑' : '☀️'}</span>
                       <span className="font-typewriter text-sm font-bold uppercase text-vintage-ink dark:text-noir-ink">
                         {isDarkMode ? 'Noir Mode' : 'Daylight'}
                       </span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-noir-red' : 'bg-vintage-ink/30'}`}>
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                    </div>
                 </div>
               </div>
             )}

             {/* Recent History / Archives Preview */}
             {isSidebarOpen && viewMode === 'live' && (
               <div className="mt-8">
                 <h3 className="font-typewriter text-xs font-bold uppercase mb-3 border-b pb-1 text-vintage-brown border-vintage-brown dark:text-noir-ink-muted dark:border-noir-ink-muted">
                   Recent Ledgers
                 </h3>
                 {history.length === 0 ? (
                   <p className="text-xs italic font-body text-gray-500 dark:text-gray-400">Archive is empty.</p>
                 ) : (
                   <ul className="space-y-2">
                     {history.slice(0, 5).map((h, idx) => (
                       <li key={idx} className="flex items-center group cursor-pointer" onClick={() => loadFromArchive(h)}>
                         <span className="w-2 h-2 rounded-full mr-2 transition-transform group-hover:scale-125 bg-vintage-red dark:bg-noir-red"></span>
                         <span className="font-typewriter text-sm truncate group-hover:underline text-vintage-ink decoration-vintage-red dark:text-noir-ink dark:decoration-noir-red">
                           {h.topic}
                         </span>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
             )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative z-10 overflow-y-auto h-full p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-8 text-center border-b-4 border-double pb-6 relative border-vintage-ink dark:border-noir-ink-muted">
              <span className="absolute top-0 left-0 font-typewriter text-xs hidden md:block text-vintage-brown dark:text-noir-ink-muted">VOL. DCCXXV</span>
              <span className="absolute top-0 right-0 font-typewriter text-xs hidden md:block text-vintage-brown dark:text-noir-ink-muted">
                {viewMode === 'live' ? 'LIVE WIRE' : 'ARCHIVES'}
              </span>
              
              <h2 className="text-5xl md:text-7xl font-headline font-black uppercase leading-none mb-2 text-vintage-ink dark:text-noir-ink">
                The Daily <span className="text-vintage-red dark:text-noir-red">Briefing</span>
              </h2>
            </div>

            {/* LIVE MODE: Search & Results */}
            {viewMode === 'live' && (
              <>
                {/* Search/Input Panel */}
                <div className="p-6 border-2 shadow-paper mb-10 relative transition-colors
                  bg-vintage-paper-light border-vintage-ink
                  dark:bg-noir-paper dark:border-noir-paper-light dark:shadow-none">
                  
                  <div className="absolute -top-3 left-6 px-3 py-1 font-typewriter text-xs tracking-widest uppercase
                    bg-vintage-ink text-vintage-paper-light
                    dark:bg-noir-red dark:text-noir-bg dark:font-bold">
                     Request New Report
                  </div>
                  
                  <form onSubmit={(e) => handleTrack(e)} className="space-y-6 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8">
                         <label htmlFor="topic" className="block font-headline font-bold text-lg mb-2 text-vintage-ink dark:text-noir-ink">
                            Subject Matter
                         </label>
                         <div className="relative">
                           <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. 'Tata Motors', 'Monsoon Update'..."
                            className="w-full p-3 border-b-2 font-typewriter text-lg focus:outline-none transition-colors placeholder:text-gray-500/50
                              bg-vintage-paper border-vintage-ink text-vintage-ink focus:bg-white
                              dark:bg-noir-bg dark:border-noir-ink-muted dark:text-noir-ink dark:focus:bg-noir-paper-light dark:placeholder:text-gray-600"
                           />
                         </div>
                      </div>
                      
                      <div className="md:col-span-4">
                        <LanguageSelector selected={language} onChange={setLanguage} />
                      </div>
                    </div>

                    {/* SOURCE SELECTOR COMPONENT */}
                    <SourceSelector 
                      selectedSources={selectedSources}
                      onChange={setSelectedSources}
                      includeEPapers={includeEPapers}
                      onEPaperChange={setIncludeEPapers}
                    />

                    <div className="flex justify-between items-center pt-4 border-t border-dashed border-vintage-ink/20 dark:border-noir-ink/20">
                      <span className="text-[0.6rem] font-typewriter w-1/3 text-gray-500 dark:text-gray-400">
                         *System searches daily e-papers and web indices.
                      </span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleTrack(undefined, undefined, true)}
                          className="px-4 py-2 font-headline font-bold text-sm uppercase border border-vintage-ink text-vintage-ink hover:bg-vintage-ink hover:text-white dark:border-noir-ink dark:text-noir-ink dark:hover:bg-noir-ink dark:hover:text-noir-bg transition-colors"
                        >
                          Fetch Wire
                        </button>
                        <button
                          type="submit"
                          disabled={state.isLoading || !topic}
                          className={`
                            px-6 py-2 font-headline font-bold text-lg uppercase tracking-wider border border-transparent transition-all shadow-paper active:translate-y-1
                            bg-vintage-ink text-vintage-paper-light hover:bg-vintage-red
                            dark:bg-noir-ink dark:text-noir-bg dark:hover:bg-noir-red dark:hover:text-white dark:shadow-none
                            ${state.isLoading ? 'opacity-80 cursor-wait' : ''}
                          `}
                        >
                          {state.isLoading ? 'FETCHING...' : 'DISPATCH'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Error Message */}
                {state.error && (
                  <div className="mb-8 p-4 flex items-center font-typewriter border-2
                    bg-[#F8d7da] border-vintage-red text-vintage-red
                    dark:bg-noir-paper dark:border-noir-red dark:text-noir-red">
                    <span className="text-2xl mr-4">⚠</span>
                    <p>{state.error}</p>
                  </div>
                )}

                {/* Results Feed */}
                <div className="space-y-12 pb-12">
                  {state.results.length === 0 && !state.isLoading && !state.error && (
                    <div className="flex flex-col items-center justify-center p-12 opacity-60">
                       <div className="w-16 h-16 border-4 rounded-full flex items-center justify-center mb-4
                         border-vintage-ink text-vintage-ink
                         dark:border-noir-ink-muted dark:text-noir-ink-muted">
                          <span className="font-headline text-3xl">?</span>
                       </div>
                       <p className="font-typewriter text-center text-vintage-ink dark:text-noir-ink-muted">
                         The desk is clear.<br/>Enter a topic or fetch the wire.
                       </p>
                    </div>
                  )}
                  
                  {state.results.map((result) => (
                    <NewsCard key={result.id} result={result} />
                  ))}
                </div>
              </>
            )}

            {/* ARCHIVES MODE: List of saved history */}
            {viewMode === 'archives' && (
               <div className="space-y-6">
                 <h3 className="font-headline text-2xl font-bold mb-4 text-vintage-ink dark:text-noir-ink border-b pb-2 border-vintage-ink">
                   Filing Cabinet (History)
                 </h3>
                 {history.length === 0 ? (
                   <p className="font-typewriter text-gray-500">No records found.</p>
                 ) : (
                   history.map((h, i) => (
                     <div 
                        key={i} 
                        onClick={() => loadFromArchive(h)}
                        className="p-4 border-2 border-vintage-ink/30 dark:border-noir-ink/20 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors group"
                     >
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-headline font-bold text-xl text-vintage-ink dark:text-noir-ink group-hover:text-vintage-red dark:group-hover:text-noir-red">
                             {h.topic}
                           </span>
                           <span className="font-typewriter text-xs text-gray-500">
                             {new Date(h.timestamp).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="font-body text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {h.summary}
                        </p>
                     </div>
                   ))
                 )}
               </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;