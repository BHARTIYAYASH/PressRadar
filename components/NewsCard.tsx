import React from 'react';
import { NewsResult } from '../types';

interface NewsCardProps {
  result: NewsResult;
}

export const NewsCard: React.FC<NewsCardProps> = ({ result }) => {
  return (
    <div className="relative group mx-2 my-4">
      {/* Shadow Element to simulate paper lift */}
      <div className="absolute inset-0 bg-black/20 transform translate-x-2 translate-y-2 rotate-1 blur-sm rounded-sm"></div>
      
      {/* Main Clipping */}
      <div className="relative bg-[#FDFBF7] p-1 jagged-edge transition-transform duration-300 group-hover:-translate-y-1">
        
        <div className="border-2 border-vintage-ink p-6 border-double h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          
          {/* Metadata Stamp */}
          <div className="flex justify-between items-center border-b border-vintage-ink pb-2 mb-4">
            <span className="font-typewriter text-xs text-vintage-red font-bold tracking-widest">
              VOL. {new Date().getFullYear()}
            </span>
            <div className="flex flex-col items-end">
               <span className="font-typewriter text-xs text-vintage-ink uppercase">
                 {result.language} EDITION
               </span>
               <span className="font-typewriter text-[0.6rem] text-gray-500">
                 {result.timestamp.toLocaleDateString()} • {result.timestamp.toLocaleTimeString()}
               </span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-headline text-3xl md:text-4xl font-bold leading-none text-vintage-ink mb-4 uppercase text-center">
            {result.topic}
          </h3>

          <div className="w-16 h-1 bg-vintage-ink mx-auto mb-6"></div>

          {/* Body Text */}
          <div className="font-body text-vintage-ink leading-relaxed text-justify text-sm md:text-base columns-1 md:columns-2 gap-6 border-b border-vintage-ink pb-6 mb-4">
             <p className="first-letter:text-5xl first-letter:font-headline first-letter:float-left first-letter:mr-2 first-letter:mt-[-5px]">
               {result.summary}
             </p>
          </div>

          {/* Sources / References */}
          <div className="bg-[#EAE6DA] p-4 border border-dashed border-vintage-ink relative">
            <div className="absolute -top-3 left-4 bg-[#FDFBF7] px-2 font-typewriter text-xs font-bold text-vintage-brown">
              REFERENCED SOURCES
            </div>
            {result.sources.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {result.sources.map((source, idx) => (
                  <li key={idx} className="font-typewriter text-xs truncate">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-vintage-ink hover:text-vintage-red hover:underline decoration-wavy transition-colors"
                    >
                      {source.title.toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="font-typewriter text-xs text-gray-500 italic">No direct e-paper links found.</span>
            )}
            
            <div className="mt-2 pt-2 border-t border-vintage-ink/30 text-[0.6rem] font-sans text-right text-gray-500">
              *Scanned from daily web & e-paper indices
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};