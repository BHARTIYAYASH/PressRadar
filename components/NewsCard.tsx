
import React from 'react';
import { NewsResult } from '../types';

interface NewsCardProps {
  result: NewsResult;
}

export const NewsCard: React.FC<NewsCardProps> = ({ result }) => {
  const dateObj = new Date(result.timestamp);

  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n');
    
    return paragraphs.map((paragraph, pIdx) => {
      if (!paragraph.trim()) return <br key={pIdx} />;

      const isBullet = /^[*-]\s/.test(paragraph);
      const isHeader = paragraph.startsWith('###');
      const cleanLine = paragraph.replace(/^[*-]\s/, '').replace(/^###\s?/, '');

      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      const content = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-vintage-ink dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });

      if (isHeader) {
        return <h4 key={pIdx} className="font-headline font-bold text-lg mt-6 mb-2 uppercase border-b border-vintage-ink/20 dark:border-white/10 dark:text-noir-ink">{content}</h4>;
      }

      if (isBullet) {
        return (
          <div key={pIdx} className="flex items-start mb-2 ml-4">
            <span className="mr-2 text-vintage-red dark:text-noir-red">■</span>
            <span>{content}</span>
          </div>
        );
      }

      return <p key={pIdx} className="mb-4 text-justify">{content}</p>;
    });
  };

  if (result.isWire) {
    return (
      <div className="relative mx-auto my-12 max-w-3xl transform hover:scale-[1.01] transition-transform duration-300">
        <div className="bg-[#E6C685] dark:bg-[#4A3C23] border-b-2 border-dashed border-vintage-ink/50 p-2 flex justify-between items-center rounded-t-sm">
          <span className="font-typewriter font-bold text-sm tracking-widest text-vintage-ink/80 dark:text-white/80 uppercase">
            PRIORITY TELEGRAM // BUREAU 09
          </span>
          <span className="font-mono text-xs text-vintage-ink/80 dark:text-white/80">
            SEC: {result.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="bg-[#FFF8DC] dark:bg-[#2C2720] p-8 shadow-2xl border-x-4 border-b-8 border-[#E6C685] dark:border-[#4A3C23] relative overflow-hidden">
          <div className="absolute top-10 right-10 text-8xl font-black opacity-5 pointer-events-none rotate-[-15deg]">
            URGENT
          </div>

          <div className="font-typewriter text-vintage-ink dark:text-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-8 border-b-2 border-vintage-ink/10 pb-4 text-xs font-bold uppercase">
              <div>
                <span className="text-gray-500 block">SENDER:</span>
                WIRE OPS / AI-CORE
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">TIME_RECV:</span>
                {dateObj.toLocaleString()}
              </div>
            </div>

            <div className="text-base md:text-lg leading-relaxed tracking-wide space-y-2">
              {renderFormattedText(result.summary)}
            </div>

            <div className="mt-12 pt-6 border-t border-vintage-ink/20 flex justify-between items-end">
               <div className="text-[0.6rem] uppercase tracking-tighter opacity-40 font-mono">
                 END OF TRANSMISSION
               </div>
               <div className="text-center">
                 <div className="font-script text-2xl text-vintage-red dark:text-noir-red opacity-80" style={{ fontFamily: 'cursive' }}>
                   The Editor
                 </div>
                 <span className="text-[0.5rem] uppercase tracking-widest text-gray-500 block -mt-1">Verified Signature</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group mx-auto my-16 max-w-4xl">
      <div className="absolute inset-0 transform translate-x-4 translate-y-4 rotate-1 blur-sm rounded-sm bg-black/10 dark:bg-black/40"></div>
      
      <div className="relative p-1 jagged-edge transition-all duration-300 group-hover:-translate-y-1 bg-[#FDFBF7] dark:bg-[#252525]">
        <div className="border-2 p-8 md:p-12 border-double h-full border-vintage-ink bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] dark:border-noir-paper-light dark:bg-noir-paper dark:bg-none">
          
          <div className="flex justify-between items-center border-b pb-4 mb-10 border-vintage-ink dark:border-gray-600">
            <span className="font-typewriter text-sm font-bold tracking-widest text-vintage-red dark:text-noir-red uppercase">
              SPECIAL EDITION Vol. {dateObj.getFullYear()}
            </span>
            <div className="flex flex-col items-end">
               <span className="font-typewriter text-xs uppercase font-bold text-vintage-ink dark:text-noir-ink-muted">
                 {result.language} CHRONICLE
               </span>
               <span className="font-typewriter text-[0.7rem] text-gray-500">
                 DATED: {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
               </span>
            </div>
          </div>

          <h3 className="font-headline text-4xl md:text-6xl font-black leading-tight mb-8 uppercase text-center text-vintage-ink dark:text-noir-ink tracking-tight">
            {result.topic}
          </h3>

          <div className="w-full h-[3px] bg-vintage-ink dark:bg-noir-ink-muted mb-1 flex justify-center items-center">
             <div className="bg-vintage-paper dark:bg-noir-paper px-4 font-typewriter text-[0.6rem] font-bold">LATEST DISPATCH</div>
          </div>
          <div className="w-full h-[1px] bg-vintage-ink/50 dark:bg-noir-ink-muted/50 mb-10"></div>

          <div className="font-body leading-relaxed text-sm md:text-lg text-vintage-ink dark:text-noir-ink mb-12">
             {renderFormattedText(result.summary)}
          </div>

          <div className="mt-auto pt-10 border-t-4 border-double border-vintage-ink dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-px flex-1 bg-vintage-ink/20 dark:bg-white/10"></div>
              <span className="font-headline font-bold text-xs uppercase tracking-widest text-vintage-brown dark:text-noir-gold">Press Credentials & Sources</span>
              <div className="h-px flex-1 bg-vintage-ink/20 dark:bg-white/10"></div>
            </div>

            {result.sources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-vintage-ink/10 bg-vintage-ink/5 hover:bg-vintage-red hover:text-white transition-all dark:bg-white/5 dark:border-white/10 dark:hover:bg-noir-red"
                  >
                    <span className="font-typewriter text-xs font-bold mr-3 opacity-50">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-[0.7rem] uppercase truncate mb-0.5">{source.title}</p>
                      <p className="font-mono text-[0.55rem] opacity-60 truncate">{source.uri}</p>
                    </div>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                ))}
              </div>
            ) : (
              <p className="font-typewriter text-xs text-gray-500 italic text-center py-4 border border-dashed border-vintage-ink/20">
                Verification pending. No external digital wire links captured for this specific transmission.
              </p>
            )}
            
            <div className="mt-8 flex justify-center opacity-30">
               <div className="border-2 border-vintage-ink p-1 rotate-[-2deg] dark:border-noir-ink">
                  <div className="border border-vintage-ink px-3 py-1 font-typewriter text-[0.5rem] uppercase font-bold dark:border-noir-ink">
                    CENSORED BY BUREAU 7
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
