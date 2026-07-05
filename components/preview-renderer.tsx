"use client";

import React from "react";
import dynamic from "next/dynamic";

const componentsMap: Record<string, React.ComponentType<any>> = {
  "music-player": dynamic(() => import("@/registry/music-player").then((mod) => mod.MusicPlayer), {
    ssr: false,
    loading: () => <span className="text-zinc-500 text-xs">Loading player...</span>,
  }),
};

export function PreviewRenderer({ slug }: { slug: string }) {
  const Component = componentsMap[slug];
  if (!Component) {
    return <div className="text-xs text-red-500">Preview not found</div>;
  }
  return <Component />;
}
