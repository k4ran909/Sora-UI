
export interface RegistryEntry {
  name: string;
  slug: string;
  category: string;
  description: string;
  codePath: string;
}

export const registry: Record<string, RegistryEntry> = {
  "music-player": {
    name: "Skeuomorphic Music Player",
    slug: "music-player",
    category: "Media",
    description: "A skeuomorphic CD player featuring an animated rotating vinyl/CD, custom audio seeking, animated sound waves, and a morphing fullscreen track-transition animation.",
    codePath: "registry/music-player.tsx",
  },
};


