"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  title?: string;
}

function CodeBlock({ code, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-hairline bg-surface-1 overflow-hidden group">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-hairline bg-surface-2/50">
          <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider">
            {title}
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1 px-2 py-1 text-[10px] text-ink-subtle hover:text-ink bg-surface-1 border border-hairline rounded-md transition-all opacity-0 group-hover:opacity-100"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy
              </>
            )}
          </button>
        </div>
      )}
      <pre className="p-5 font-mono text-[13px] text-ink-muted bg-background overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface PropRow {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
}

const PROPS_TABLE: PropRow[] = [
  {
    name: "spotifyToken",
    type: "string",
    default: "—",
    description:
      "Spotify Web API Bearer Token. Used to fetch track metadata and album art. Get one from the Spotify Developer Dashboard.",
  },
  {
    name: "trackIds",
    type: "string[]",
    default: "—",
    description:
      "Array of Spotify Track IDs. Each track's name, artist, cover art, and 30s audio preview will be fetched. Falls back to built-in demo tracks when omitted.",
  },
  {
    name: "timelineColor",
    type: "string",
    default: '"#5e6ad2"',
    description:
      "Hex color for the progress bar fill. Changes the seek timeline accent to match your brand.",
  },
  {
    name: "componentColor",
    type: "string",
    default: '"#0f1011"',
    description:
      "Hex color for the player card background. Controls the overall body color of the skeuomorphic shell.",
  },
  {
    name: "titleOverride",
    type: "string",
    default: "—",
    description:
      "Override the displayed song title. When set, this text replaces the track name fetched from Spotify.",
  },
  {
    name: "artistOverride",
    type: "string",
    default: "—",
    description:
      "Override the displayed artist name. When set, this text replaces the artist fetched from Spotify.",
  },
  {
    name: "defaultVolume",
    type: "number",
    default: "80",
    description:
      "Initial audio volume from 0 to 100. Maps directly to HTMLAudioElement.volume.",
  },
  {
    name: "playbackSpeed",
    type: "number",
    default: "1.0",
    description:
      "Audio playback rate multiplier. Supports 0.5, 1.0, 1.5, and 2.0.",
  },
  {
    name: "loop",
    type: "boolean",
    default: "true",
    description:
      "When true, the playlist loops back to the first track after the last one ends. When false, playback stops after the final track.",
  },
];

/* ── Code Snippet Examples ── */

const EXAMPLE_BASIC = `import { MusicPlayer } from "@/components/ui/music-player";

export default function Demo() {
  return <MusicPlayer />;
}`;

const EXAMPLE_SPOTIFY = `import { MusicPlayer } from "@/components/ui/music-player";

// 1. Get your Spotify credentials:
//    → https://developer.spotify.com/dashboard
//    → Create an app → Copy Client ID & Secret
//
// 2. Exchange credentials for an Access Token
//    (use our included API route or your own backend):

const SPOTIFY_TOKEN = "BQDj7g0...your_token_here";

const MY_TRACKS = [
  "0V3wPSX3ygHQwZ21K47gOO",   // Shape of You
  "7qiZRhU7tZ2XG6xBvDUz6r",   // Blinding Lights
  "5PjdY0CKDHMDzPyvl44df6",    // Levitating
];

export default function SpotifyPlayer() {
  return (
    <MusicPlayer
      spotifyToken={SPOTIFY_TOKEN}
      trackIds={MY_TRACKS}
    />
  );
}`;

const EXAMPLE_TIMELINE_COLOR = `// Pink progress bar
<MusicPlayer timelineColor="#ec4899" />

// Green neon progress bar
<MusicPlayer timelineColor="#22c55e" />

// Orange warm progress bar
<MusicPlayer timelineColor="#f97316" />`;

const EXAMPLE_COMPONENT_COLOR = `// Deep navy shell
<MusicPlayer componentColor="#0a1628" />

// Warm charcoal
<MusicPlayer componentColor="#1c1917" />

// Transparent glass (pair with backdrop-blur)
<MusicPlayer componentColor="rgba(15, 16, 17, 0.6)" />`;

const EXAMPLE_PLAYLIST_LOOP = `// Loop mode — restarts playlist after last track
<MusicPlayer
  spotifyToken={token}
  trackIds={["id1", "id2", "id3"]}
  loop={true}
/>

// Static mode — stops after the last track finishes
<MusicPlayer
  spotifyToken={token}
  trackIds={["id1", "id2", "id3"]}
  loop={false}
/>`;

const EXAMPLE_VOLUME_SPEED = `// Quiet background music at half speed
<MusicPlayer
  defaultVolume={30}
  playbackSpeed={0.5}
/>

// Full volume, double speed
<MusicPlayer
  defaultVolume={100}
  playbackSpeed={2.0}
/>`;

const EXAMPLE_TITLE_OVERRIDE = `// Display a custom title and artist
<MusicPlayer
  titleOverride="My Custom Mix"
  artistOverride="DJ Sora"
/>`;

const EXAMPLE_FULL = `import { MusicPlayer } from "@/components/ui/music-player";

const TOKEN = "BQDj7g0...";

export default function FullCustom() {
  return (
    <MusicPlayer
      spotifyToken={TOKEN}
      trackIds={[
        "0V3wPSX3ygHQwZ21K47gOO",
        "7qiZRhU7tZ2XG6xBvDUz6r",
        "5PjdY0CKDHMDzPyvl44df6",
      ]}
      timelineColor="#a855f7"
      componentColor="#0c0a12"
      defaultVolume={60}
      playbackSpeed={1.0}
      loop={true}
    />
  );
}`;

const EXAMPLE_TOKEN_ROUTE = `// app/api/spotify/token/route.ts  (included in Sora UI)
//
// POST { clientId, clientSecret }
// Returns { access_token, expires_in }

async function getSpotifyToken() {
  const res = await fetch("/api/spotify/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: "YOUR_CLIENT_ID",
      clientSecret: "YOUR_CLIENT_SECRET",
    }),
  });
  const { access_token } = await res.json();
  return access_token;
}`;

export function MusicPlayerDocs() {
  return (
    <div className="space-y-16 font-sans">
      {/* ─── Section 1: API Reference ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">
          API Reference
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          All customization is done through standard React props. No internal
          state management, no context providers — just pass the props you need
          and the component handles the rest.
        </p>

        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-2/60 border-b border-hairline">
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                  Prop
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                  Default
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                  Description
                </th>
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
                    <code className="text-primary text-xs font-mono bg-primary/8 px-1.5 py-0.5 rounded">
                      {prop.name}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-ink-subtle text-xs font-mono">
                      {prop.type}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-ink-subtle text-xs font-mono">
                      {prop.default}
                    </code>
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

      {/* ─── Section 2: Spotify Setup ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">
          🎵 Spotify Integration
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          The player fetches <strong>track names</strong>,{" "}
          <strong>artist names</strong>, <strong>album cover art</strong> (used
          as the spinning CD banner), and <strong>30-second audio previews</strong>{" "}
          directly from the Spotify Web API.
        </p>

        {/* Step-by-step guide */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-hairline bg-surface-1">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              1
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Create a Spotify App
              </p>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Go to{" "}
                <a
                  href="https://developer.spotify.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  developer.spotify.com/dashboard
                </a>{" "}
                → Create App → Copy your <strong>Client ID</strong> and{" "}
                <strong>Client Secret</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-hairline bg-surface-1">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              2
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Get an Access Token
              </p>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Exchange your credentials for a Bearer token using the
                included server-side API route{" "}
                <code className="text-primary font-mono bg-surface-2 px-1 py-0.5 rounded text-[11px]">
                  /api/spotify/token
                </code>{" "}
                or your own backend. See the code example below.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-hairline bg-surface-1">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              3
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Pass the token and track IDs
              </p>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Pass the token as{" "}
                <code className="text-primary font-mono bg-surface-2 px-1 py-0.5 rounded text-[11px]">
                  spotifyToken
                </code>{" "}
                and your chosen track IDs as{" "}
                <code className="text-primary font-mono bg-surface-2 px-1 py-0.5 rounded text-[11px]">
                  trackIds
                </code>
                . The component will auto-fetch all metadata.
              </p>
            </div>
          </div>
        </div>

        <CodeBlock title="Token Exchange Route" code={EXAMPLE_TOKEN_ROUTE} />
        <CodeBlock title="Spotify Usage" code={EXAMPLE_SPOTIFY} />

        {/* Note callout */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/80 leading-relaxed">
          <strong className="text-amber-400">⚠️ Note:</strong> Spotify's free
          API tier only provides <strong>30-second audio previews</strong>.
          Full-length playback requires Spotify Premium + OAuth user
          authorization. The CD banner (album art) is always available.
        </div>
      </section>

      {/* ─── Section 3: Customization Examples ─── */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">
          Customization Examples
        </h2>

        {/* Timeline Color */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            Progress Timeline Color
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            Change the seek bar accent with any hex color value. Great for
            matching your app's brand palette.
          </p>
          <CodeBlock code={EXAMPLE_TIMELINE_COLOR} />
        </div>

        {/* Component Color */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-zinc-800 border border-zinc-600" />
            Component Background Color
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            Customize the skeuomorphic card body. Supports hex and rgba for
            glass-like transparency effects.
          </p>
          <CodeBlock code={EXAMPLE_COMPONENT_COLOR} />
        </div>

        {/* Playlist Loop vs Static */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
            🔁 Playlist: Loop vs Static
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            Control whether the playlist loops continuously or stops after the
            last track. Perfect for background music vs. curated listening.
          </p>
          <CodeBlock code={EXAMPLE_PLAYLIST_LOOP} />
        </div>

        {/* Volume & Speed */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
            🔊 Volume &amp; Playback Speed
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            Set the initial volume (0–100) and speed multiplier (0.5x, 1.0x,
            1.5x, 2.0x). Both map directly to the HTML Audio API.
          </p>
          <CodeBlock code={EXAMPLE_VOLUME_SPEED} />
        </div>

        {/* Title & Artist Override */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ink tracking-tight flex items-center gap-2">
            ✏️ Song Name &amp; Artist Override
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            Override the displayed track title and artist name. Useful for
            custom branding or when you want a fixed label regardless of which
            track is playing.
          </p>
          <CodeBlock code={EXAMPLE_TITLE_OVERRIDE} />
        </div>
      </section>

      {/* ─── Section 4: Full Example ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">
          Full Kitchen Sink Example
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Here's a complete example combining Spotify integration with every
          customization option:
        </p>
        <CodeBlock title="Full Customization" code={EXAMPLE_FULL} />
      </section>

      {/* ─── Section 5: Dependencies ─── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">
          Dependencies
        </h2>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-2/60 border-b border-hairline">
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                  Package
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-hairline/50 bg-surface-1/40 hover:bg-surface-2/30 transition-colors">
                <td className="px-4 py-3">
                  <code className="text-primary text-xs font-mono">
                    framer-motion
                  </code>
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted">
                  CD spin animation, cover morph transitions, sound wave bars
                </td>
              </tr>
              <tr className="border-b border-hairline/50 hover:bg-surface-2/30 transition-colors">
                <td className="px-4 py-3">
                  <code className="text-primary text-xs font-mono">
                    clsx + tailwind-merge
                  </code>
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted">
                  Conditional class name merging via the{" "}
                  <code className="font-mono">cn()</code> utility
                </td>
              </tr>
              <tr className="border-b border-hairline/50 bg-surface-1/40 hover:bg-surface-2/30 transition-colors">
                <td className="px-4 py-3">
                  <code className="text-primary text-xs font-mono">
                    tailwindcss
                  </code>
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted">
                  Utility-first CSS framework for all layout and styling
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Install"
          code="npm install framer-motion clsx tailwind-merge"
        />
      </section>
    </div>
  );
}
