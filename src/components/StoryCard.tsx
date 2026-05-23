import { motion } from "motion/react";
import { Ghost, Skull, Flame, Moon, Eye, Wind, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    category: string;
    icon: string;
  };
  onClick: () => void;
  index: number;
}

export function StoryCard({ story, onClick, index }: StoryCardProps) {
  const Icon = getIconComponent(story.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-zinc-950/50 border border-white/5 rounded-sm p-5 cursor-pointer group relative transition-colors hover:bg-white/5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-8">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-red-900 transition-colors">
          {story.category}
        </span>
        <div className="text-zinc-800 group-hover:text-red-950 transition-colors">
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-auto">
        <h3 className="font-serif text-xl text-zinc-100 group-hover:text-white transition-colors leading-tight mb-2">
          {story.title}
        </h3>
        <div className="h-px w-0 group-hover:w-full bg-red-900 transition-all duration-500" />
      </div>

      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={14} className="text-red-900" />
      </div>
    </motion.div>
  );
}

function getIconComponent(name: string) {
  switch (name) {
    case "ghost": return Ghost;
    case "skull": return Skull;
    case "flame": return Flame;
    case "moon": return Moon;
    case "eye": return Eye;
    case "wind": return Wind;
    default: return Ghost;
  }
}
