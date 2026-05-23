import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.warn("Autoplay blocked or interrupted");
            setIsPlaying(false);
          });
      }
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    if (total) {
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="w-full flex items-center gap-8 py-2">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        muted={isMuted}
      />
      
      <div className="flex items-center gap-4 w-48 hidden md:flex">
        <div className="w-10 h-10 bg-red-900/10 rounded-md flex items-center justify-center border border-red-900/20">
          <div className="flex gap-0.5 items-end h-4">
            <div className={`w-0.5 bg-red-600 h-2 ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <div className={`w-0.5 bg-red-600 h-4 ${isPlaying ? 'animate-bounce' : ''}`}></div>
            <div className={`w-0.5 bg-red-600 h-1 ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <div className={`w-0.5 bg-red-600 h-3 ${isPlaying ? 'animate-bounce' : ''}`}></div>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-zinc-200 uppercase tracking-tighter">Narration Active</p>
          <p className="text-[9px] text-zinc-500 uppercase tracking-tighter font-mono">Atmospheric Echo</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="h-1 w-full bg-zinc-900 rounded-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-red-700 rounded-full shadow-[0_0_8px_rgba(185,28,28,0.6)] transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-600 font-mono tracking-widest">
           <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
           <span>{audioRef.current ? formatTime(audioRef.current.duration) : '00:00'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-all border border-white/5"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}

function formatTime(time: number) {
  if (isNaN(time)) return "00:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
