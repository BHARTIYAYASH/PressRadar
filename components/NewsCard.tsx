import React from 'react';
import { NewsResult } from '../types';

interface NewsCardProps {
  result: NewsResult;
}

export const NewsCard: React.FC<NewsCardProps> = ({ result }) => {
  const dateObj = new Date(result.timestamp);

  // Helper function to parse bold text (**text**) and render it properly
  const renderFormattedText = (text: string) => {
    // Split by newlines first to handle paragraph breaks
    const paragraphs = text.split('\n');
    
    return paragraphs.map((paragraph, pIdx) => {
      if (!paragraph.trim()) return <br key={pIdx} />;

      // Check for bullet points (starting with * or -)
      const isBullet = /^[*-]\s/.test(paragraph);
      const cleanLine = paragraph.replace(/^[*-]\s/, '');

      // Split the line by bold markers **
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      const content = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-vintage-ink dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });

      if (isBullet) {
        return (
          <div key={pIdx} className="flex items-start mb-2 ml-2">
            <span className="mr-2 text-vintage-red dark:text-noir-red">•</span>
            <span>{content}</span>
          </div>
        );
      }

      return <p key={pIdx} className="mb-3">{content}</p>;
    });
  };

  // --- WIRE SERVICE LAYOUT (Telegram Style) ---
  if (result.isWire) {
    return (
      <div className="relative mx-2 my-6 max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
        {/* Telegram Header Strip */}
        <div className="bg-[#E6C685] dark:bg-[#4A3C23] border-b-2 border-dashed border-vintage-ink/50 p-2 flex justify-between items-center rounded-t-sm">
          <span className="font-typewriter font-bold text-sm tracking-widest text-vintage-ink/80 dark:text-white/80">
            URGENT CABLE // PRESS WIRE
          </span>
          <span className="font-mono text-xs text-vintage-ink/80 dark:text-white/80">
            ID: {result.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Telegram Body (Yellow Paper) */}
        <div className="bg-[#FFF8DC] dark:bg-[#2C2720] p-6 shadow-lg border-x-4 border-b-4 border-[#E6C685] dark:border-[#4A3C23] relative overflow-hidden">
          
          {/* Watermark/Background Text */}
          <div className="absolute top-10 right-10 text-6xl font-black opacity-5 pointer-events-none rotate-[-15deg]">
            PRIORITY
          </div>

          <div className="font-typewriter text-vintage-ink dark:text-gray-200">
            {/* Meta Header */}
            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-vintage-ink/20 pb-4 text-xs font-bold uppercase">
              <div>
                <span className="text-gray-500 block">ORIGIN:</span>
                GLOBAL NEWS DESK
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">TIMESTAMP:</span>
                {dateObj.toLocaleString()}
              </div>
            </div>

            {/* Content */}
            <div className="text-sm md:text-base leading-relaxed tracking-wide">
              {renderFormattedText(result.summary)}
            </div>

            {/* Footer Signature */}
            <div className="mt-8 pt-4 border-t border-vintage-ink/20 flex justify-end">
               <div className="text-center">
                 <div className="font-script text-xl text-vintage-red dark:text-noir-red opacity-80" style={{ fontFamily: 'cursive' }}>
                   System Dispatch
                 </div>
                 <span className="text-[0.6rem] uppercase tracking-widest text-gray-500">Authorized</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STANDARD NEWSPAPER CLIP LAYOUT ---
  return (
    <div className="relative group mx-2 my-8">
      {/* Shadow Element */}
      <div className="absolute inset-0 transform translate-x-3 translate-y-3 rotate-1 blur-sm rounded-sm bg-black/20 dark:bg-black/50"></div>
      
      {/* Main Clipping */}
      <div className="relative p-1 jagged-edge transition-transform duration-300 group-hover:-translate-y-1 bg-[#FDFBF7] dark:bg-[#252525]">
        
        <div className="border-2 p-6 md:p-8 border-double h-full
          border-vintage-ink bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]
          dark:border-noir-paper-light dark:bg-noir-paper dark:bg-none">
          
          {/* Metadata Stamp */}
          <div className="flex justify-between items-center border-b pb-2 mb-6 border-vintage-ink dark:border-gray-600">
            <span className="font-typewriter text-xs font-bold tracking-widest text-vintage-red dark:text-noir-red">
              VOL. {dateObj.getFullYear()}
            </span>
            <div className="flex flex-col items-end">
               <span className="font-typewriter text-xs uppercase text-vintage-ink dark:text-noir-ink-muted">
                 {result.language} EDITION
               </span>
               <span className="font-typewriter text-[0.6rem] text-gray-500">
                 {dateObj.toLocaleDateString()}
               </span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-headline text-3xl md:text-5xl font-bold leading-[0.9] mb-6 uppercase text-center text-vintage-ink dark:text-noir-ink">
            {result.topic}
          </h3>

          <div className="w-24 h-1 mx-auto mb-8 bg-vintage-ink dark:bg-noir-ink-muted"></div>

          {/* Body Text */}
          <div className="font-body leading-7 text-justify text-sm md:text-base columns-1 md:columns-2 gap-8 border-b pb-6 mb-4
            text-vintage-ink border-vintage-ink
            dark:text-noir-ink dark:border-gray-600">
             {renderFormattedText(result.summary)}
          </div>

          {/* Sources / References */}
          <div className="p-4 border border-dashed relative transition-colors mt-4
            bg-[#EAE6DA] border-vintage-ink
            dark:bg-noir-paper-light dark:border-gray-600">
            
            <div className="absolute -top-3 left-4 px-2 font-typewriter text-xs font-bold
              bg-[#FDFBF7] text-vintage-brown
              dark:bg-noir-paper dark:text-noir-gold">
              REFERENCED SOURCES
            </div>
            {result.sources.length > 0 ? (
              <ul className="list-none pl-2 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {result.sources.map((source, idx) => (
                  <li key={idx} className="font-typewriter text-xs truncate text-vintage-ink dark:text-noir-ink-muted flex items-center">
                    <span className="mr-2 text-vintage-red">›</span>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="transition-colors decoration-wavy hover:text-vintage-red hover:underline dark:hover:text-noir-red dark:text-noir-ink"
                    >
                      {source.title.toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="font-typewriter text-xs text-gray-500 italic">No direct e-paper links found.</span>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};