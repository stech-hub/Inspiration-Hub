
import React from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V5C14.017 4.44772 14.4647 4 15.017 4H19.017C20.6738 4 22.017 5.34315 22.017 7V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.9124 16 4.01697 16H7.01697C7.56925 16 8.01697 15.5523 8.01697 15V9C8.01697 8.44772 7.56925 8 7.01697 8H3.01697C2.46468 8 2.01697 7.55228 2.01697 7V5C2.01697 4.44772 2.46468 4 3.01697 4H7.01697C8.67383 4 10.017 5.34315 10.017 7V15C10.017 18.3137 7.33068 21 4.01697 21H2.01697Z" />
        </svg>
      </div>
      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full mb-6">
        {quote.category}
      </span>
      <p className="serif-font text-xl md:text-2xl leading-relaxed text-slate-800 mb-6 italic">
        "{quote.text}"
      </p>
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-8 bg-indigo-600"></div>
        <p className="font-bold text-slate-900 uppercase tracking-widest text-sm">
          {quote.author}
        </p>
      </div>
    </div>
  );
};
