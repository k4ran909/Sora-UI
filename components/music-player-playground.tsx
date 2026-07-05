"use client";

import React, { useState } from "react";
import { MusicPlayer } from "@/registry/music-player";
import { ComponentViewer } from "./component-viewer";
import { AlertTriangle, Info } from "lucide-react";

interface MusicPlayerPlaygroundProps {
  componentCode: string;
}

export function MusicPlayerPlayground({ componentCode }: MusicPlayerPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  
  // Let's store all the customization values the developer changes in the playground
  const [spotifyToken, setSpotifyToken] = useState("");
  const [trackIdsInput, setTrackIdsInput] = useState(
    "0V3wPSX3ygHQwZ21K47gOO, 7qiZRhU7tZ2XG6xBvDUz6r, 5PjdY0CKDHMDzPyvl44df6"
  );
  const [timelineColor, setTimelineColor] = useState("#5e6ad2");
  const [componentColor, setComponentColor] = useState("#0f1011");
  const [titleOverride, setTitleOverride] = useState("");
  const [artistOverride, setArtistOverride] = useState("");
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [loop, setLoop] = useState(true);

  const trackIds = trackIdsInput
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  // Here we construct a clean, copy-pasteable React code block showing exactly how to invoke the component with the selected props
  const generateCode = () => {
    const props = [];
    if (spotifyToken) props.push(`spotifyToken="${spotifyToken}"`);
    if (trackIdsInput !== "0V3wPSX3ygHQwZ21K47gOO, 7qiZRhU7tZ2XG6xBvDUz6r, 5PjdY0CKDHMDzPyvl44df6") {
      props.push(`trackIds={${JSON.stringify(trackIds)}}`);
    }
    if (timelineColor !== "#5e6ad2") props.push(`timelineColor="${timelineColor}"`);
    if (componentColor !== "#0f1011") props.push(`componentColor="${componentColor}"`);
    if (titleOverride) props.push(`titleOverride="${titleOverride}"`);
    if (artistOverride) props.push(`artistOverride="${artistOverride}"`);
    if (volume !== 80) props.push(`defaultVolume={${volume}}`);
    if (playbackSpeed !== 1.0) props.push(`playbackSpeed={${playbackSpeed}}`);
    if (!loop) props.push(`loop={false}`);

    const propsString = props.length > 0 ? "\n  " + props.join("\n  ") + "\n" : "";
    
    return `import { MusicPlayer } from "@/components/ui/music-player";

export default function Example() {
  return (
    <MusicPlayer${propsString}/>
  );
}`;
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full max-w-6xl mx-auto select-none font-mono">
      {/* Left Column: Component Viewer */}
      <div className="flex-1 min-w-0">
        <ComponentViewer code={componentCode} usageCode={generateCode()}>
          <div className="flex justify-center py-4">
            <MusicPlayer
              spotifyToken={spotifyToken || undefined}
              trackIds={trackIds.length > 0 ? trackIds : undefined}
              timelineColor={timelineColor}
              componentColor={componentColor}
              titleOverride={titleOverride || undefined}
              artistOverride={artistOverride || undefined}
              defaultVolume={volume}
              playbackSpeed={playbackSpeed}
              loop={loop}
            />
          </div>
        </ComponentViewer>
      </div>

      {/* Right Column: Customization Form */}
      <div className="w-full lg:w-[320px] shrink-0 linear-card border border-hairline p-6 rounded-xl flex flex-col space-y-4 max-h-[520px] overflow-y-auto">
        <h3 className="text-sm font-bold text-ink tracking-tight border-b border-hairline pb-2 mb-2">
          Playground Config
        </h3>

        {/* Info Note */}
        <div className="p-3 rounded-lg border border-hairline bg-surface-2 text-[10px] text-ink-subtle flex gap-2">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            This playground passes values directly as props to the player, making the component pure, clean, and copy-paste friendly for <strong>v0.app</strong>.
          </span>
        </div>

        {/* Spotify Token */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
            Spotify Access Token
          </label>
          <input
            type="text"
            placeholder="Paste Bearer Token"
            value={spotifyToken}
            onChange={(e) => setSpotifyToken(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded border border-hairline bg-surface-2 text-ink outline-none focus:border-primary"
          />
          <span className="text-[9px] text-ink-subtle block leading-normal">
            Get a temporary token from the{" "}
            <a
              href="https://developer.spotify.com/documentation/web-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Spotify Web Console
            </a>.
          </span>
        </div>

        {/* Track IDs */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
            Spotify Track IDs
          </label>
          <textarea
            value={trackIdsInput}
            onChange={(e) => setTrackIdsInput(e.target.value)}
            className="w-full h-16 px-3 py-1.5 text-xs rounded border border-hairline bg-surface-2 text-ink outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Timeline Color */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">Timeline Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={timelineColor}
              onChange={(e) => setTimelineColor(e.target.value)}
              className="w-6 h-6 border-0 p-0 cursor-pointer rounded overflow-hidden"
            />
            <span className="text-[10px] text-ink-subtle">{timelineColor}</span>
          </div>
        </div>

        {/* Component Color */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">Component BG</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={componentColor}
              onChange={(e) => setComponentColor(e.target.value)}
              className="w-6 h-6 border-0 p-0 cursor-pointer rounded overflow-hidden"
            />
            <span className="text-[10px] text-ink-subtle">{componentColor}</span>
          </div>
        </div>

        {/* Custom Override Title */}
        <div className="space-y-2 pt-2 border-t border-hairline">
          <label className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
            Display Overrides
          </label>
          <input
            type="text"
            placeholder="Custom Song Title"
            value={titleOverride}
            onChange={(e) => setTitleOverride(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded border border-hairline bg-surface-2 text-ink outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Custom Artist Name"
            value={artistOverride}
            onChange={(e) => setArtistOverride(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded border border-hairline bg-surface-2 text-ink outline-none focus:border-primary"
          />
        </div>

        {/* Audio settings */}
        <div className="space-y-3 pt-2 border-t border-hairline">
          <label className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
            Playback Default Controls
          </label>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Volume</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] text-ink-subtle w-6 text-right">{volume}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Speed</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-2 py-1 text-xs rounded border border-hairline bg-surface-2 text-ink outline-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={1.0}>1.0x (Normal)</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2.0x</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Loop Playlist</span>
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
              className="rounded border-hairline bg-surface-2 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
