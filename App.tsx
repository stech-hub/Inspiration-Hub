
import React, { useState, useEffect, useMemo } from 'react';
import { QuoteCard } from './components/QuoteCard';
import { AiMotivator } from './components/AiMotivator';
import { INITIAL_QUOTES } from './constants';
import { QuoteCategory, Quote, User, Collection } from './types';

const App: React.FC = () => {
  // --- States ---
  const [activeCategory, setActiveCategory] = useState<QuoteCategory | 'All' | 'Favorites'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Auth & User States
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  
  // Collection States
  const [showCollectionModal, setShowCollectionModal] = useState<Quote | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const savedUser = localStorage.getItem('inspirehub_current_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Derived Data ---
  const quoteOfTheDay = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    return INITIAL_QUOTES[seed % INITIAL_QUOTES.length];
  }, []);

  const filteredQuotes = useMemo(() => {
    return INITIAL_QUOTES.filter(q => {
      let matchesCategory = true;
      if (activeCategory === 'Favorites') {
        matchesCategory = user?.favorites.includes(q.id) || false;
      } else if (activeCategory !== 'All') {
        matchesCategory = q.category === activeCategory;
      }
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = q.text.toLowerCase().includes(searchLower) || 
                            q.author.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, user]);

  // --- Actions ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    let targetUser: User;
    const usersJson = localStorage.getItem('inspirehub_users') || '[]';
    const users: User[] = JSON.parse(usersJson);

    if (authMode === 'register') {
      if (users.find(u => u.username === usernameInput)) {
        alert("User already exists");
        return;
      }
      targetUser = { username: usernameInput, favorites: [], collections: [] };
      users.push(targetUser);
      localStorage.setItem('inspirehub_users', JSON.stringify(users));
    } else {
      const found = users.find(u => u.username === usernameInput);
      if (!found) {
        alert("User not found");
        return;
      }
      targetUser = found;
    }

    setUser(targetUser);
    localStorage.setItem('inspirehub_current_user', JSON.stringify(targetUser));
    setShowAuthModal(false);
    setUsernameInput('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('inspirehub_current_user');
  };

  const toggleFavorite = (quoteId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const newFavorites = user.favorites.includes(quoteId)
      ? user.favorites.filter(id => id !== quoteId)
      : [...user.favorites, quoteId];
    
    const updatedUser = { ...user, favorites: newFavorites };
    updateUserData(updatedUser);
  };

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('inspirehub_current_user', JSON.stringify(updatedUser));
    const users: User[] = JSON.parse(localStorage.getItem('inspirehub_users') || '[]');
    const idx = users.findIndex(u => u.username === updatedUser.username);
    if (idx !== -1) {
      users[idx] = updatedUser;
      localStorage.setItem('inspirehub_users', JSON.stringify(users));
    }
  };

  const createCollection = () => {
    if (!user || !newCollectionName.trim() || !showCollectionModal) return;
    const newColl: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCollectionName,
      quoteIds: [showCollectionModal.id]
    };
    updateUserData({ ...user, collections: [...user.collections, newColl] });
    setNewCollectionName('');
    setShowCollectionModal(null);
  };

  const addToExistingCollection = (collId: string) => {
    if (!user || !showCollectionModal) return;
    const newColls = user.collections.map(c => 
      c.id === collId && !c.quoteIds.includes(showCollectionModal.id) 
        ? { ...c, quoteIds: [...c.quoteIds, showCollectionModal.id] }
        : c
    );
    updateUserData({ ...user, collections: newColls });
    setShowCollectionModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">I</div>
            <h1 className="text-xl font-extrabold tracking-tighter text-indigo-900">INSPIREHUB</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#quotes" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Quotes</a>
            <a href="#ai-motivator" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">AI Generator</a>
            <a href="#about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Developer</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">Hello, {user.username}</span>
                <button onClick={handleLogout} className="text-sm text-red-500 font-bold hover:underline">Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] mb-4 text-sm">Fuel Your Ambition | 2026</p>
            <h2 className="serif-font text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 italic">
              Words that echo in the <span className="text-indigo-600">hallways</span> of greatness.
            </h2>
            
            {/* Quote of the Day Feature */}
            <div className="bg-white/40 backdrop-blur-md border border-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 items-center mb-10 max-w-2xl animate-in fade-in slide-in-from-left duration-700">
               <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl">
                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
               </div>
               <div>
                 <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Quote of the Day</h4>
                 <p className="serif-font text-lg text-slate-800 italic leading-snug">"{quoteOfTheDay.text}"</p>
                 <p className="text-xs font-bold text-slate-400 mt-2">— {quoteOfTheDay.author}</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#quotes" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-100">
                Explore Library
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <section id="quotes" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h3 className="serif-font text-3xl md:text-4xl font-bold text-slate-900 italic mb-2">The Wisdom Vault</h3>
                <p className="text-slate-500">Filter by category or search Akin's curated database.</p>
              </div>
              
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search keywords..."
                  className="w-full md:w-80 pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
              {['All', 'Favorites', ...Object.values(QuoteCategory)].map((cat) => (
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
                  <QuoteCard 
                    key={quote.id} 
                    quote={quote} 
                    isFavorite={user?.favorites.includes(quote.id) || false}
                    onToggleFavorite={() => toggleFavorite(quote.id)}
                    onAddToCollection={() => setShowCollectionModal(quote)}
                    showActions={!!user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="max-w-xs mx-auto">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p className="text-slate-400 text-lg font-medium">No inspiration found here. Try another term or clear filters!</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <AiMotivator />
      </main>

      {/* Modals */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="serif-font text-2xl font-bold text-indigo-900 mb-2 italic">
              {authMode === 'login' ? 'Welcome Back' : 'Join InspireHub'}
            </h3>
            <p className="text-slate-500 mb-6 text-sm">Enter your username to access your collections and favorites.</p>
            <form onSubmit={handleAuth}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
                <input 
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. akin_s_sokpah"
                />
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mb-4">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <div className="text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-sm text-indigo-600 font-bold hover:underline"
              >
                {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => setShowAuthModal(false)} className="text-slate-400 text-xs font-bold uppercase hover:text-slate-600">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCollectionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="serif-font text-2xl font-bold text-indigo-900 mb-6 italic text-center">Add to Collection</h3>
            <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2">
              {user?.collections.map(coll => (
                <button 
                  key={coll.id}
                  onClick={() => addToExistingCollection(coll.id)}
                  className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-semibold flex justify-between items-center"
                >
                  {coll.name}
                  <span className="text-xs bg-white px-2 py-1 rounded-md text-slate-400">{coll.quoteIds.length} quotes</span>
                </button>
              ))}
              {user?.collections.length === 0 && <p className="text-center text-slate-400 text-sm">No collections yet.</p>}
            </div>
            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Create New Collection</p>
              <div className="flex gap-2">
                <input 
                  className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="Collection Name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <button onClick={createCollection} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowCollectionModal(null)}
              className="w-full mt-6 py-3 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Developer Section */}
      <section id="about" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-64 h-64 flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform"></div>
              <img src="https://picsum.photos/seed/akin/400/400" alt="Akin S. Sokpah" className="w-full h-full object-cover rounded-2xl relative z-10 grayscale hover:grayscale-0 transition-all" />
            </div>
            <div className="flex-1">
              <h2 className="serif-font text-4xl md:text-5xl font-bold mb-6 italic">Meet the Visionary</h2>
              <p className="text-slate-400 text-xl leading-relaxed mb-8">
                InspireHub was founded by <span className="text-white font-bold">Akin S. Sokpah</span>, a senior software engineer from <span className="text-white font-bold">Liberia</span>. 
                In 2026, Akin scaled this platform to empower millions with the combination of human wisdom and AI-driven personalized motivation.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">Base of Operations</h4>
                  <p className="text-lg">Monrovia, Liberia</p>
                </div>
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">Build Year</h4>
                  <p className="text-lg">2026 Edition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-500 border-t border-slate-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">I</div>
            <span className="text-white font-bold tracking-tighter uppercase">InspireHub</span>
          </div>
          <p className="text-sm">
            &copy; 2026 Developed by <span className="text-indigo-400">Akin S. Sokpah</span> (Liberia).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
