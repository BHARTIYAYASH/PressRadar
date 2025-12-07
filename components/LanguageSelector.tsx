import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selected: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="relative inline-block w-full md:w-48">
      {/* Language select karne ke liye dropdown */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Output Language
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Language)}
        className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
      >
        {Object.values(Language).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-6">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};