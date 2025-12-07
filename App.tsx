import React, { useState, useCallback } from 'react';
import { Language, NewsResult, TrackerState } from './types';
import { trackNewsTopic } from './services/geminiService';
import { LanguageSelector } from './components/LanguageSelector';
import { NewsCard } from './components/NewsCard';

const App: React.FC = () => {
  // State variables define kar rahe hain topic, language aur results ke liye
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [state, setState] = useState<TrackerState>({
    isLoading: false,
    error: null,
    results: []
  });

  // Track button click hone par ye function chalega
  const handleTrack = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return; // Agar topic khali hai toh return kar do

    // Loading state set kar rahe hain taaki user ko spinner dikhe
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Service call karke news fetch kar rahe hain
      const result = await trackNewsTopic(topic, language);
      
      // Naya result existing results ke upar add kar rahe hain (prepend)
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: [result, ...prev.results] 
      }));
    } catch (err: any) {
      // Agar koi error aata hai toh state update kar rahe hain
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "News track karte waqt kuch unexpected error aaya."
      }));
    }
  }, [topic, language]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation section yahan hai */}
      <aside className="w-full md:w-64 bg-news-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            PressRadar
          </h1>
          <p className="text-xs text-gray-400 mt-2">Intelligent News Tracker</p>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            <a href="#" className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-md shadow-lg transition-transform transform hover:scale-105">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Live Tracker
            </a>
            {/* Abhi ye features disabled hain, baad mein implement karenge */}
            <div className="px-4 py-3 text-gray-400 cursor-not-allowed flex items-center opacity-50">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Stories
            </div>
            <div className="px-4 py-3 text-gray-400 cursor-not-allowed flex items-center opacity-50">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Settings
            </div>
          </div>
        </nav>
        
        <div className="p-6 mt-auto">
             <div className="bg-news-800 rounded p-4 text-xs text-gray-400">
                <p className="mb-2 font-semibold text-gray-300">Supported Sources:</p>
                <p>Global news aur e-papers jo Google index karta hai, unko monitor karta hai.</p>
             </div>
        </div>
      </aside>

      {/* Ye main content area hai jahan news dikhegi */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-news-900">Dashboard</h2>
            <p className="text-news-500 mt-2">
              Specific news topic enter karo taaki main newspapers aur e-papers scan kar sakun.
            </p>
          </div>

          {/* Input section jahan user topic enter karega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <form onSubmit={handleTrack} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                   <label htmlFor="topic" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Target News Topic
                   </label>
                   <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Tata Motors Share Price, Maharashtra Election Results..."
                    className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                </div>
                
                <div>
                  <LanguageSelector selected={language} onChange={setLanguage} />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={state.isLoading || !topic}
                  className={`
                    inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-all duration-200
                    ${state.isLoading ? 'opacity-75 cursor-wait' : ''}
                  `}
                >
                  {state.isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning Sources...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Track News
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message Section */}
          {state.error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results List display kar rahe hain */}
          <div className="space-y-6">
            {state.results.length === 0 && !state.isLoading && !state.error && (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tracking results yet</h3>
                <p className="mt-1 text-sm text-gray-500">Upar topic enter karo taaki scanning shuru ho sake.</p>
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