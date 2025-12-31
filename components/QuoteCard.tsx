
import React from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  isFavorite: boolean;
  onToggleFavorite?: () => void;
  onAddToCollection?: () => void;
  showActions: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  isFavorite, 
  onToggleFavorite, 
  onAddToCollection,
  showActions 
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V5C14.017 4.44772 14.4647 4 15.017 4H19.017C20.6738 4 22.017 5.34315 22.017 7V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.9124 16 4.01697 16H7.01697C7.56925 16 8.01697 15.5523 8.01697 15V9C8.01697 8.44772 7.56925 8 7.01697 8H3.01697C2.46468 8 2.01697 7.55228 2.01697 7V5C2.01697 4.44772 2.46468 4 3.01697 4H7.01697C8.67383 4 10.017 5.34315 10.017 7V15C10.017 18.3137 7.33068 21 4.01697 21H2.01697Z" />
        </svg>
      </div>

      <div className="flex justify-between items-start mb-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full">
          {quote.category}
        </span>
        {showActions && (
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-red-500'}`}
              title="Favorite"
            >
              <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={onAddToCollection}
              className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Add to Collection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <p className="serif-font text-xl leading-relaxed text-slate-800 mb-6 italic flex-grow">
        "{quote.text}"
      </p>
      
      <div className="mt-auto flex items-center gap-3">
        <div className="h-[2px] w-8 bg-indigo-600"></div>
        <p className="font-bold text-slate-900 uppercase tracking-widest text-xs">
          {quote.author}
        </p>
      </div>
    </div>
  );
};
