import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selected: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="relative w-full">
      <label className="block font-headline font-bold text-lg mb-2 text-vintage-ink dark:text-noir-ink">
        Edition Language
      </label>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value as Language)}
          className="appearance-none w-full p-3 border-b-2 font-typewriter text-lg focus:outline-none cursor-pointer transition-colors
            bg-vintage-paper border-vintage-ink text-vintage-ink focus:bg-white
            dark:bg-noir-bg dark:border-noir-ink-muted dark:text-noir-ink dark:focus:bg-noir-paper-light"
        >
          {Object.values(Language).map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-vintage-ink dark:text-noir-ink">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};