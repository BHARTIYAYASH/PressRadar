
import React, { useState, useCallback, useEffect } from 'react';
import { Language, NewsResult, TrackerState, TrackedTopic, UserProfile } from './types';
import { trackNewsTopic, runWatchlistScan } from './services/geminiService';
import { LanguageSelector } from './components/LanguageSelector';
import { NewsCard } from './components/NewsCard';
import { NewspaperBackground } from './components/NewspaperBackground';
import { SourceSelector } from './components/SourceSelector';
import { PressRegistration } from './components/PressRegistration';
import { WatchlistPanel } from './components/WatchlistPanel';

const HISTORY_KEY = 'pressradar_history';
const WATCHLIST_KEY = 'pressradar_watchlist';
const PROFILE_KEY = 'pressradar_profile';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'live' | 'archives' | 'watchlist'>('live');

  // Persistence State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<NewsResult[]>([]);
  const [watchlist, setWatchlist] = useState<TrackedTopic[]>([]);
  
  const [state, setState] = useState<TrackerState>({
    isLoading: false,
    error: null,
    results: []
  });

  const [scanProgress, setScanProgress] = useState<{current: number, total: number} | null>(null);

  // Load Data on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY);
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  // Save Helpers
  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [profile, history, watchlist]);

  const handleRegister = (newProfile: UserProfile) => setProfile(newProfile);

  const handleAddTopic = (newTopic: Partial<TrackedTopic>) => {
    const topicItem: TrackedTopic = {
      id: crypto.randomUUID(),
      keyword: newTopic.keyword || '',
      context: newTopic.context || '',
      language: newTopic.language || Language.ENGLISH,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setWatchlist([topicItem, ...watchlist]);
  };

  const handleToggleTopic = (id: string) => {
    setWatchlist(watchlist.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const handleDeleteTopic = (id: string) => {
    setWatchlist(watchlist.filter(t => t.id !== id));
  };

  const runDailyDispatch = async () => {
    const activeTopics = watchlist.filter(t => t.isActive);
    if (activeTopics.length === 0) return;

    setViewMode('live');
    setState(prev => ({ ...prev, isLoading: true, error: null, results: [] }));
    setScanProgress({ current: 0, total: activeTopics.length });

    try {
      // We run them one by one to show progress
      const reports: NewsResult[] = [];
      for (let i = 0; i < activeTopics.length; i++) {
        setScanProgress({ current: i + 1, total: activeTopics.length });
        const res = await trackNewsTopic({
          topic: activeTopics[i].keyword,
          language: activeTopics[i].language,
          selectedSources: [],
          includeEPapers: false,
          context: activeTopics[i].context
        });
        reports.push(res);
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: reports
      }));
      
      setHistory([...reports, ...history].slice(0, 50));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: "Morning dispatch failed: Wire line cut." }));
    } finally {
      setScanProgress(null);
    }
  };

  const handleTrack = useCallback(async (e?: React.FormEvent, overrideTopic?: string, isWire: boolean = false) => {
    if (e) e.preventDefault();
    const searchTopic = overrideTopic || topic;
    if (!isWire && !searchTopic.trim()) return;

    setViewMode('live');
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await trackNewsTopic({
        topic: searchTopic,
        language,
        selectedSources: [],
        includeEPapers: false,
        isWireRequest: isWire
      });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: [result, ...prev.results] 
      }));
      
      setHistory([result, ...history].slice(0, 50));

    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, [topic, language, history]);

  const loadFromArchive = (result: NewsResult) => {
    setViewMode('live');
    setState(prev => ({ ...prev, results: [result], error: null }));
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-full`}>
      {/* Registration Overlay */}
      {!profile && <PressRegistration onRegister={handleRegister} />}

      <div className="relative h-screen w-full flex overflow-hidden font-body bg-vintage-paper dark:bg-noir-bg transition-colors duration-500">
        <NewspaperBackground />

        <aside className={`relative z-50 flex flex-col border-r-2 transition-all duration-300 ease-in-out shadow-depth bg-vintage-paper-light border-vintage-ink dark:bg-noir-paper dark:border-noir-paper-light ${isSidebarOpen ? 'w-80' : 'w-20'}`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-20 pointer-events-none dark:opacity-5"></div>
          
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-10 w-8 h-12 flex items-center justify-center shadow-md z-50 rounded-r-md border-y border-r bg-vintage-red text-white dark:bg-noir-red">
             {isSidebarOpen ? '‹' : '›'}
          </button>

          <div className="p-6 border-b-4 border-double border-vintage-ink dark:border-noir-paper-light">
            {isSidebarOpen ? (
              <div className="text-center">
                 <h1 className="text-4xl font-headline font-black text-vintage-ink dark:text-noir-ink">PRESS<br/>RADAR</h1>
                 <p className="font-typewriter text-[0.6rem] text-vintage-brown dark:text-noir-ink-muted">EST. 2025 • AGENT: {profile?.name.toUpperCase() || 'UNKNOWN'}</p>
              </div>
            ) : <div className="text-center font-headline font-bold text-2xl dark:text-noir-ink">P</div>}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             <nav className="space-y-1">
               <div onClick={() => setViewMode('live')} className={`cursor-pointer p-3 border-b border-vintage-ink/10 dark:border-white/5 font-headline uppercase tracking-wider text-sm hover:bg-vintage-ink/5 dark:hover:bg-white/5 ${viewMode === 'live' ? 'text-vintage-red font-bold' : 'dark:text-noir-ink'}`}>The Desk</div>
               <div onClick={() => setViewMode('watchlist')} className={`cursor-pointer p-3 border-b border-vintage-ink/10 dark:border-white/5 font-headline uppercase tracking-wider text-sm hover:bg-vintage-ink/5 dark:hover:bg-white/5 flex justify-between items-center ${viewMode === 'watchlist' ? 'text-vintage-red font-bold' : 'dark:text-noir-ink'}`}>
                 Watchlist
                 {watchlist.length > 0 && <span className="text-[0.6rem] bg-vintage-red text-white px-1.5 py-0.5 rounded-full">{watchlist.length}</span>}
               </div>
               <div onClick={() => setViewMode('archives')} className={`cursor-pointer p-3 border-b border-vintage-ink/10 dark:border-white/5 font-headline uppercase tracking-wider text-sm hover:bg-vintage-ink/5 dark:hover:bg-white/5 ${viewMode === 'archives' ? 'text-vintage-red font-bold' : 'dark:text-noir-ink'}`}>Archives</div>
             </nav>

             {isSidebarOpen && (
               <div className="pt-4">
                 <button 
                  onClick={runDailyDispatch}
                  disabled={watchlist.length === 0 || state.isLoading}
                  className="w-full bg-vintage-ink text-white py-3 font-headline font-bold uppercase text-xs tracking-tighter hover:bg-vintage-red disabled:opacity-30 transition-all dark:bg-noir-red dark:text-noir-bg"
                 >
                   Run Daily Dispatch
                 </button>
                 <div onClick={() => setIsDarkMode(!isDarkMode)} className="mt-4 p-3 flex justify-between items-center bg-black/5 dark:bg-white/5 cursor-pointer">
                    <span className="font-typewriter text-xs dark:text-noir-ink">{isDarkMode ? 'Noir' : 'Paper'} Mode</span>
                    <span className="text-lg">{isDarkMode ? '🌑' : '☀️'}</span>
                 </div>
               </div>
             )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {scanProgress && (
              <div className="mb-8 p-6 border-4 border-double border-vintage-ink bg-white dark:bg-noir-paper dark:border-noir-red animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-headline font-bold uppercase dark:text-noir-ink">Scanning News Grids...</span>
                  <span className="font-typewriter text-sm dark:text-noir-ink">{scanProgress.current} / {scanProgress.total}</span>
                </div>
                <div className="w-full h-4 bg-vintage-ink/10 dark:bg-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-vintage-red transition-all duration-500" style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}></div>
                </div>
              </div>
            )}

            {viewMode === 'live' && (
              <>
                <div className="p-8 border-2 shadow-paper mb-12 bg-vintage-paper-light dark:bg-noir-paper dark:border-noir-paper-light">
                  <h3 className="font-headline font-bold text-lg mb-4 dark:text-noir-ink">Ad-Hoc Search</h3>
                  <form onSubmit={handleTrack} className="flex gap-4">
                    <input 
                      className="flex-1 bg-transparent border-b-2 border-vintage-ink p-2 font-typewriter focus:outline-none dark:text-noir-ink dark:border-noir-ink-muted" 
                      placeholder="Enter subject for instant track..."
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                    />
                    <button type="submit" className="bg-vintage-ink text-white px-8 font-headline font-bold uppercase dark:bg-noir-ink dark:text-noir-bg">Dispatch</button>
                  </form>
                </div>
                <div className="space-y-12">
                  {state.isLoading && !scanProgress && <div className="text-center font-typewriter py-20 animate-bounce dark:text-noir-ink">TRANSMITTING...</div>}
                  {state.results.map(r => <NewsCard key={r.id} result={r} />)}
                  {state.results.length === 0 && !state.isLoading && (
                    <div className="text-center py-20 opacity-30">
                      <p className="font-headline text-2xl uppercase dark:text-noir-ink">Bureau is Silent</p>
                      <p className="font-typewriter text-sm mt-2 dark:text-noir-ink">Waiting for orders.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {viewMode === 'watchlist' && (
              <WatchlistPanel 
                watchlist={watchlist} 
                onAdd={handleAddTopic} 
                onDelete={handleDeleteTopic} 
                onToggle={handleToggleTopic}
                isDarkMode={isDarkMode}
              />
            )}

            {viewMode === 'archives' && (
              <div className="space-y-4">
                <h2 className="font-headline text-3xl font-black uppercase mb-8 border-b-2 border-vintage-ink dark:text-noir-ink dark:border-noir-ink-muted">Historical Files</h2>
                {history.map((h, i) => (
                  <div key={i} onClick={() => loadFromArchive(h)} className="p-4 border border-vintage-ink/20 dark:border-white/5 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-all">
                    <div className="flex justify-between">
                      <span className="font-headline font-bold dark:text-noir-ink">{h.topic}</span>
                      <span className="font-typewriter text-[0.6rem] text-gray-500">{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
