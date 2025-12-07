import React from 'react';
import { NewsResult } from '../types';

interface NewsCardProps {
  result: NewsResult;
}

export const NewsCard: React.FC<NewsCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden mb-6">
      <div className="bg-news-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-news-900">
            {result.topic}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Generated in {result.language} • {result.timestamp.toLocaleTimeString()} {result.timestamp.toLocaleDateString()}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          LIVE SEARCH
        </div>
      </div>
      
      <div className="p-6">
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
           {/* Simple markdown parser yahan aa sakta hai, abhi ke liye whitespace handling use kar rahe hain */}
           {result.summary}
        </div>
        
        {/* Agar sources available hain toh unhe list kar rahe hain */}
        {result.sources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Verified Sources
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.sources.map((source, idx) => (
                <li key={idx}>
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="truncate">{source.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Agar koi direct source link nahi mila search engine se */}
        {result.sources.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
            Note: Specific source links fetch nahi ho paye, but summary general knowledge base se generate hui hai.
          </div>
        )}
      </div>
    </div>
  );
};