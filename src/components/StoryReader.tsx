import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, Languages, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer.tsx";

import { pcmToWavUrl } from "../lib/audioUtils.ts";
import { AdPlaceholder } from "./AdPlaceholder.tsx";
import { getFallbackStory } from "../lib/fallbackStories.ts";

interface StoryReaderProps {
  story: {
    id: string;
    title: string;
    category: string;
  } | null;
  onClose: () => void;
}

export function StoryReader({ story, onClose }: StoryReaderProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);

  useEffect(() => {
    if (story) {
      fetchContent();
      // Reset audio and alerts when story changes
      setAudioUrl(null);
      setAudioMessage(null);
    }
  }, [story, lang]);

  const fetchContent = async () => {
    if (!story) return;
    setLoading(true);
    try {
      const res = await fetch("/api/story/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: story.id, title: story.title, language: lang }),
      });
      if (!res.ok) {
        throw new Error("Backend offline");
      }
      const data = await res.json();
      setContent(data.content);
    } catch (err) {
      console.warn("Express backend offline. Loading local immersive story.");
      setContent(getFallbackStory(story.title, lang));
    } finally {
      setLoading(false);
    }
  };

  const generateAudio = async () => {
    if (!content || generatingAudio) return;
    setGeneratingAudio(true);
    setAudioMessage(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, language: lang }),
      });
      if (!res.ok) {
        throw new Error("Express backend offline or audio quota exceeded");
      }
      const data = await res.json();
      if (data.audio) {
        let url = "";
        if (data.mimeType?.includes("pcm")) {
          const rateMatch = data.mimeType.match(/rate=(\d+)/);
          const rate = rateMatch ? parseInt(rateMatch[1]) : 24000;
          url = pcmToWavUrl(data.audio, rate);
        } else {
          url = `data:${data.mimeType || "audio/mp3"};base64,${data.audio}`;
        }
        setAudioUrl(url);
      }
    } catch (err) {
      console.warn("TTS generation requires active Node.js server:", err);
      setAudioMessage("AI Narrator requires a running server. Static hosting (like Netlify) only serves the front-end layout! Deploy on Google Cloud Run to experience AI audio narration.");
    } finally {
      setGeneratingAudio(false);
    }
  };

  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden relative flex flex-col z-10"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/60 backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-mono text-red-800 uppercase tracking-[0.4em] mb-2">{story.category}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-zinc-100 italic">{story.title}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-500 hover:text-white"
            >
              <Languages size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{lang === 'en' ? 'HINDI' : 'ENGLISH'}</span>
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-500 hover:text-red-800 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 md:p-16 scary-scroll relative bg-zinc-950/20">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 space-y-6"
              >
                <div className="w-12 h-12 rounded-full border border-red-900 animate-spin border-t-transparent" />
                <p className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase">Translating echoes...</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="markdown-body max-w-2xl mx-auto"
              >
                <ReactMarkdown>{content}</ReactMarkdown>
                
                {/* Ad placement after story */}
                <AdPlaceholder type="sidebar" className="mt-20 border-white/5 bg-zinc-950/40" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Audio Controls */}
        <div className="min-h-24 py-6 bg-zinc-950 border-t border-white/10 px-10 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-red-900/10"></div>
          
          {audioMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] uppercase text-center max-w-md flex items-center gap-2 font-mono border border-red-950/50 bg-red-950/10 rounded-sm p-3 text-red-400"
            >
              <AlertCircle size={14} className="shrink-0 text-red-800" />
              <span>{audioMessage}</span>
            </motion.div>
          )}
          
          {!audioUrl ? (
            <button
              disabled={generatingAudio || loading}
              onClick={generateAudio}
              className="flex items-center gap-4 px-10 py-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-all disabled:opacity-30 group shadow-[0_0_20px_rgba(153,27,27,0.3)]"
            >
              {generatingAudio ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Conjuring Voice...</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  <span className="font-mono text-xs font-bold tracking-widest uppercase">SUMMON AI NARRATOR</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full max-w-2xl">
              <AudioPlayer src={audioUrl} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
