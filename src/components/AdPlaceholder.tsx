import { motion } from "motion/react";

interface AdPlaceholderProps {
  type: "banner" | "card" | "sidebar";
  className?: string;
}

export function AdPlaceholder({ type, className }: AdPlaceholderProps) {
  const styles = {
    banner: "w-full h-24 sm:h-32 mb-12",
    card: "h-full min-h-[300px]",
    sidebar: "w-full h-64 mt-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`glass-card bg-zinc-950/30 border-dashed border-zinc-800 flex flex-col items-center justify-center p-4 relative overflow-hidden group ${styles[type]} ${className || ""}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em] mb-2 z-10">Advertisement</span>
      <div className="w-full h-full border border-zinc-900 flex items-center justify-center z-10">
        <p className="text-xs text-zinc-800 font-mono italic">Space for Ad</p>
      </div>
      <div className="absolute bottom-2 right-2 text-[8px] text-zinc-800 font-mono tracking-widest z-10">ADSENSE_PL_ID</div>
      
      {/* Decorative pulse */}
      <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
    </motion.div>
  );
}
