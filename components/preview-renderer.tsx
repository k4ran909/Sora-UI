"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Interactive wrapper for previewing all states of the Bar Visualizer
const BarVisualizerPreview = dynamic(
  () =>
    import("@/registry/bar-visualizer").then((mod) => {
      const { BarVisualizer } = mod;
      return function Preview() {
        const [state, setState] = useState<any>("speaking");
        const [centerAlign, setCenterAlign] = useState(false);

        return (
          <div className="flex flex-col items-center gap-6">
            <BarVisualizer state={state} barCount={15} demo={true} centerAlign={centerAlign} />

            <div className="flex flex-wrap gap-2 justify-center bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80">
              {(["connecting", "initializing", "listening", "speaking", "thinking"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                    state === s
                      ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCenterAlign(!centerAlign)}
              className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-zinc-300 border border-zinc-800/80 rounded-md cursor-pointer"
            >
              Align: {centerAlign ? "Center" : "Bottom"}
            </button>
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => <span className="text-zinc-500 text-xs">Loading visualizer...</span>,
  }
);

const componentsMap: Record<string, React.ComponentType<any>> = {
  "music-player": dynamic(() => import("@/registry/music-player").then((mod) => mod.MusicPlayer), {
    ssr: false,
    loading: () => <span className="text-zinc-500 text-xs">Loading player...</span>,
  }),
  "dark-player": dynamic(() => import("@/registry/dark-player").then((mod) => mod.MusicPlayer), {
    ssr: false,
    loading: () => <span className="text-zinc-500 text-xs">Loading player...</span>,
  }),
  "bar-visualizer": BarVisualizerPreview,
  "date-selector": dynamic(() => import("@/registry/date-selector").then((mod) => mod.DateSelector), {
    ssr: false,
    loading: () => <span className="text-zinc-500 text-xs">Loading calendar...</span>,
  }),
  "dust-sphere": dynamic(() => import("@/registry/dust-sphere").then((mod) => mod.DustSphere), {
    ssr: false,
    loading: () => <span className="text-zinc-500 text-xs">Loading 3D globe...</span>,
  }),
  "transcript-viewer": dynamic(
    () => import("@/registry/transcript-viewer").then((mod) => {
      const {
        TranscriptViewerContainer,
        TranscriptViewerAudio,
        TranscriptViewerWords,
        TranscriptViewerPlayPauseButton,
        TranscriptViewerScrubBar
      } = mod;
      return function Preview() {
        return (
          <div className="w-full flex items-center justify-center p-4">
            <TranscriptViewerContainer 
              componentColor="var(--card)" 
              className="max-w-[580px] border border-white/5 dark:border-zinc-800/30"
            >
              <TranscriptViewerAudio />
              <TranscriptViewerWords highlightBg="var(--primary)" highlightText="var(--primary-foreground)" />
              <div className="flex items-center gap-3">
                <TranscriptViewerPlayPauseButton />
                <TranscriptViewerScrubBar />
              </div>
            </TranscriptViewerContainer>
          </div>
        );
      };
    }),
    { ssr: false, loading: () => <span className="text-zinc-500 text-xs">Loading transcript...</span> }
  ),
};

export function PreviewRenderer({ slug }: { slug: string }) {
  const Component = componentsMap[slug];
  if (!Component) {
    return <div className="text-xs text-red-500">Preview not found</div>;
  }
  return <Component />;
}
