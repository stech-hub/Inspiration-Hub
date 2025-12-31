
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { AiResponse } from '../types';

export const AiMotivator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const data = await geminiService.generateMotivation(topic);
      setResult(data);
    } catch (err) {
      alert("Failed to spark motivation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-motivator" className="py-20 bg-indigo-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="serif-font text-4xl md:text-5xl font-bold mb-6 italic">AI Personal Motivator</h2>
          <p className="text-indigo-200 text-lg mb-10">
            Tell us what you're facing today, and Akin's AI engine will craft a speech just for you.
          </p>

          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 mb-12">
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Starting a new business, overcoming fear, fitness goals..."
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Crafting...
                </>
              ) : 'Ignite My Fire'}
            </button>
          </form>

          {result && (
            <div className="bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="serif-font text-2xl md:text-3xl font-bold mb-6 text-indigo-900 italic">
                {result.title}
              </h3>
              <div className="prose prose-lg text-slate-700 whitespace-pre-wrap">
                {result.speech}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Akin S. Sokpah Motivation Engine</span>
                <button 
                  onClick={() => setResult(null)} 
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
