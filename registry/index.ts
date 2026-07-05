
export interface RegistryEntry {
  name: string;
  slug: string;
  category: string;
  description: string;
  codePath: string;
  dependencies?: string[];
}

export const registry: Record<string, RegistryEntry> = {
  "music-player": {
    name: "Skeuomorphic Music Player",
    slug: "music-player",
    category: "Media",
    description: "A skeuomorphic CD player featuring an animated rotating vinyl/CD, custom audio seeking, animated sound waves, and a morphing fullscreen track-transition animation.",
    codePath: "registry/music-player.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
  },
  "dark-player": {
    name: "Dark Pill Music Player",
    slug: "dark-player",
    category: "Media",
    description: "A premium pill-shaped music player featuring vertical scroll-snapping track selection, scroll-snapping volume, and a rolling album disc.",
    codePath: "registry/dark-player.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
  },
  "bar-visualizer": {
    name: "Bar Visualizer",
    slug: "bar-visualizer",
    category: "Voice",
    description: "A real-time audio frequency visualizer with state-based animations for voice agents and audio interfaces.",
    codePath: "registry/bar-visualizer.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
  },
};


