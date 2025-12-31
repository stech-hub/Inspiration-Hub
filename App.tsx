
import React, { useState, useEffect, useMemo } from 'react';
import { QuoteCard } from './components/QuoteCard';
import { AiMotivator } from './components/AiMotivator';
import { INITIAL_QUOTES } from './constants';
import { QuoteCategory, Quote } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<QuoteCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredQuotes = useMemo(() => {
    return INITIAL_QUOTES.filter(q => {
      const categoryMatch = activeCategory === 'All' || q.category === activeCategory;
      const searchMatch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.author.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">I</div>
            <h1 className="text-xl font-extrabold tracking-tighter text-indigo-900">INSPIREHUB</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#quotes" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Quotes</a>
            <a href="#ai-motivator" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">AI Motivator</a>
            <a href="#about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Developer</a>
          </div>
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Share Motivation
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] mb-4 text-sm">Fuel Your Ambition</p>
            <h2 className="serif-font text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 italic">
              Words that echo in the <span className="text-indigo-600">hallways</span> of greatness.
            </h2>
            <p className="text-slate-600 text-xl leading-relaxed mb-10 max-w-2xl">
              Curated wisdom for the modern achiever. From historical legends to the AI-driven future, find the spark you need to conquer your day.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#quotes" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-100">
                Explore Library
              </a>
              <a href="#ai-motivator" className="px-8 py-4 bg-white text-indigo-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all transform hover:-translate-y-1">
                AI Speech Generator
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Quote Grid Section */}
      <section id="quotes" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h3 className="serif-font text-3xl md:text-4xl font-bold text-slate-900 italic mb-2">The Wisdom Vault</h3>
              <p className="text-slate-500">Filter by category or search for your favorite orator.</p>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Search quotes..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {['All', ...Object.values(QuoteCategory)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredQuotes.map(quote => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-lg">No quotes found for your search. Try something else!</p>
            </div>
          )}
        </div>
      </section>

      {/* AI Section */}
      <AiMotivator />

      {/* About the Developer */}
      <section id="about" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-64 h-64 flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform"></div>
              <img 
                src="https://picsum.photos/seed/akin/400/400" 
                alt="Akin S. Sokpah" 
                className="w-full h-full object-cover rounded-2xl relative z-10 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="flex-1">
              <h2 className="serif-font text-4xl md:text-5xl font-bold mb-6 italic">Meet the Visionary</h2>
              <p className="text-slate-400 text-xl leading-relaxed mb-8">
                InspireHub was founded by <span className="text-white font-bold">Akin S. Sokpah</span>, a software engineer and visionary from <span className="text-white font-bold">Liberia</span>. 
                With a deep belief that "Greatness is a decision, not a destination," Akin built this platform in 2026 to bridge the gap between ancient wisdom and the technological leaps of the future.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">Location</h4>
                  <p className="text-lg">Monrovia, Liberia</p>
                </div>
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">Philosophy</h4>
                  <p className="text-lg">Digital Resilience</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">Follow Akin</button>
                <button className="px-6 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">View Portfolio</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-500 border-t border-slate-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">I</div>
              <span className="text-white font-bold tracking-tighter">INSPIREHUB</span>
            </div>
            <p className="text-sm">
              &copy; 2026 InspireHub. Developed with passion by <span className="text-indigo-400">Akin S. Sokpah</span> in Monrovia, Liberia.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
