/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ghost, Search, BookOpen, Skull, Info } from "lucide-react";
import { StoryCard } from "./components/StoryCard.tsx";
import { StoryReader } from "./components/StoryReader.tsx";
import { AdPlaceholder } from "./components/AdPlaceholder.tsx";

interface Story {
  id: string;
  title: string;
  category: string;
  icon: string;
}

export default function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories");
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-red-900 selection:text-white bg-black flex flex-col">
      <div className="atmosphere">
        <div className="spectral-glow-1" />
        <div className="spectral-glow-2" />
      </div>

      {/* Top Nav */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <span className="horror-title text-2xl">Mritvani</span>
          <div className="h-4 w-px bg-zinc-800 mx-2"></div>
          <span className="text-[10px] tracking-widest uppercase opacity-50 font-mono">The Voice of the Dead</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            <span className="text-[10px] tracking-tighter opacity-80 font-mono">{stories.length} STORIES ACTIVE</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        
        <header className="mb-16 flex flex-col items-center text-center max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif text-white italic mb-8"
          >
            Unveil <span className="text-red-800">The Darkness</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full relative group"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-700 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Query the shadows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-zinc-950 border border-white/5 rounded-full focus:outline-none focus:ring-1 focus:ring-red-900/40 focus:border-red-900/40 transition-all font-mono text-sm text-zinc-300 placeholder:text-zinc-700"
            />
          </motion.div>
        </header>

        {/* Top Banner Ad */}
        {!loading && <AdPlaceholder type="banner" />}

        {/* Stories Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="w-12 h-12 rounded-full border border-red-900/40 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <Skull size={20} className="text-zinc-600" />
              </div>
            </div>
            <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Communing with spirits...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, i) => (
                <React.Fragment key={story.id}>
                  <StoryCard
                    story={story}
                    index={i}
                    onClick={() => setSelectedStory(story)}
                  />
                  {/* Inject ad card every 8 stories */}
                  {(i + 1) % 8 === 0 && (
                    <AdPlaceholder type="card" />
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredStories.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-zinc-600 text-xs uppercase tracking-[0.3em]">No echoes found in the void.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-32 pb-12 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12"></div>
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.5em]">
            © {new Date().getFullYear()} MRITVANI | SOMETHING IS WATCHING YOU
          </p>
        </footer>
      </main>

      {/* Reader Overlay */}
      <AnimatePresence>
        {selectedStory && (
          <StoryReader
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

