/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Filter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

interface Game {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
}

export default function App() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-brand-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedGame(null); setActiveCategory('All'); setSearchQuery(''); }}>
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.4)]">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter uppercase italic">
              Nexus<span className="text-brand-primary">Games</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-brand-bg border border-brand-border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="text-brand-primary w-4 h-4 mr-2" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand-primary text-black border-brand-primary'
                  : 'bg-brand-surface text-white/60 border-brand-border hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedGame(game)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-brand-border game-card-hover bg-brand-surface">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="bg-brand-primary text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                    Play Now <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-brand-primary transition-colors">{game.title}</h3>
                  <p className="text-xs text-white/40 uppercase font-mono tracking-tighter">{game.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 italic">No games found matching your search.</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-6xl h-full flex flex-col bg-brand-surface rounded-2xl overflow-hidden border border-brand-border shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded flex items-center justify-center">
                    <Gamepad2 className="text-brand-primary w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">{selectedGame.title}</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
                      if (iframe?.requestFullscreen) iframe.requestFullscreen();
                    }}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/60 hover:text-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                <iframe
                  id="game-iframe"
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allowFullScreen
                  allow="autoplay; fullscreen; keyboard"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-brand-border flex justify-between items-center text-[10px] font-mono text-white/20">
                <span>NEXUS_SYSTEM_V1.0</span>
                <span>SECURE_CONNECTION_ESTABLISHED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-brand-border p-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-40 text-xs font-mono">
          <p>© 2024 NEXUS GAMES PORTAL</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-primary transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-brand-primary transition-colors">TERMS</a>
            <a href="#" className="hover:text-brand-primary transition-colors">DMCA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
