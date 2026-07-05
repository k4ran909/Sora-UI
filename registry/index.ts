
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
  "date-selector": {
    name: "Date Selector",
    slug: "date-selector",
    category: "Forms",
    description: "A premium interactive date selector card featuring a sliding pointer, weekday headings, and height-expanding day capsules.",
    codePath: "registry/date-selector.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
  },
  "dust-sphere": {
    name: "Dust Particle Sphere 3D",
    slug: "dust-sphere",
    category: "Graphics",
    description: "A neomorphic glassmorphic display card rendering an interactive, voice-reactive Three.js 3D scattered point cloud sphere.",
    codePath: "registry/dust-sphere.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge", "three"],
  },
};


