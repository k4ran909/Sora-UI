"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  title: string;
  code: string;
}

function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-hairline">
        <span className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">{title}</span>
        <button
          onClick={copy}
          className="p-1.5 rounded hover:bg-surface-3 text-ink-subtle hover:text-ink transition-all cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="p-4 font-mono text-xs text-ink-muted bg-background overflow-x-auto leading-relaxed select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const PROPS_TABLE = [
  { name: "spotifyToken", type: "string", default: "—", description: "Spotify Bearer token for dynamic metadata loading." },
  { name: "trackIds", type: "string[]", default: "—", description: "Array of Spotify Track ID strings to load into the playlist." },
  { name: "timelineColor", type: "string", default: '"#3f3f46"', description: "Active track highlight container border color (hex)." },
  { name: "componentColor", type: "string", default: '"#000000"', description: "Outer pill container background color (hex)." },
  { name: "defaultVolume", type: "number", default: "80", description: "Initial player volume on render (0 to 100)." },
  { name: "initialTrackIndex", type: "number", default: "2", description: "Initial track to load and center (0-indexed)." },
  { name: "playbackSpeed", type: "number", default: "1.0", description: "Playback speed multiplier (0.5, 1.0, 1.5, 2.0)." },
  { name: "loop", type: "boolean", default: "true", description: "Loops playlist playback continuously." },
  { name: "titleOverride", type: "string", default: "—", description: "Override text for the active track name." },
  { name: "artistOverride", type: "string", default: "—", description: "Override text for the active track artist." },
];

const EXAMPLE_BASIC = `import { MusicPlayer } from "@/components/ui/dark-player";

export default function Demo() {
  return <MusicPlayer />;
}`;

const EXAMPLE_SPOTIFY = `import { MusicPlayer } from "@/components/ui/dark-player";

const SPOTIFY_TOKEN = "your_spotify_token_here";
const TRACK_IDS = ["0V3wPSX3ygHQwZ21K47gOO", "7qiZRhU7tZ2XG6xBvDUz6r"];

export default function App() {
  return (
    <MusicPlayer
      spotifyToken={SPOTIFY_TOKEN}
      trackIds={TRACK_IDS}
      initialTrackIndex={0}
    />
  );
}`;

export function DarkPlayerDocs() {
  return (
    <div className="space-y-16 font-sans">
      {/* ─── Section 1: API Reference ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">API Reference</h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Detailed customization details for the Dark Pill Music Player. Adjust sizes, colors, playlists, volume, and playback speed via props.
        </p>

        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-2/60 border-b border-hairline">
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Prop</th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Default</th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {PROPS_TABLE.map((prop, i) => (
                <tr
                  key={prop.name}
                  className={`border-b border-hairline/50 ${
                    i % 2 === 0 ? "bg-surface-1/40" : "bg-transparent"
                  } hover:bg-surface-2/30 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <code className="text-primary text-xs font-mono bg-primary/8 px-1.5 py-0.5 rounded">{prop.name}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-ink-subtle text-xs font-mono">{prop.type}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-ink-subtle text-xs font-mono">{prop.default}</code>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted leading-relaxed max-w-md">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Section 2: Code Examples ─── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Basic Setup</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Default player with built-in copyright-free tracks and volume control.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_BASIC} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Spotify Powered</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Loads custom track titles, cover images, and preview streams dynamically from Spotify.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_SPOTIFY} />
          </div>
        </div>
      </section>
    </div>
  );
}
