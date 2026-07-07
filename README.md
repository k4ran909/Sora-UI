<div align="center">
  <img src="public/logo.svg" width="110" height="110" alt="Sora UI logo" />

  # Sora UI

  **Beautiful, skeuomorphic, copy-paste React components for Next.js + Tailwind CSS.**

  Crafted audio players, visualizers, and interactive widgets — installable with one command, owned by you forever.

  <p>
    <a href="https://github.com/k4ran909/Sora-UI/stargazers"><img src="https://img.shields.io/github/stars/k4ran909/Sora-UI?style=flat-square&color=5e6ad2" alt="GitHub stars" /></a>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT license" />
  </p>

  <p>
    <a href="#-components">Components</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-usage">Usage</a> •
    <a href="#-spotify-integration">Spotify</a> •
    <a href="#-local-development">Development</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## 🖤 Why Sora UI?

Most web interfaces today look the same — flat grids, generic cards, sterile layouts. Sora UI brings back **tactility**: spinning CD discs, dancing equalizer bars, word-by-word speech highlighting, and 3D particle spheres that react to your voice.

- **Copy-paste first.** No package to install, no runtime lock-in. The code lands in *your* repo — restyle it, rewrite it, own it.
- **shadcn-compatible registry.** Install any component through the shadcn CLI pipeline; path aliases and dependencies are resolved automatically.
- **Modern stack.** Built for Next.js App Router, React 19, Tailwind CSS v4, and Framer Motion.
- **Dark-mode native.** Designed against a Linear-inspired dark aesthetic, with light-mode support.

---

## 🧩 Components

| Component | Description | Install |
|---|---|---|
| 📀 **Music Player** | Skeuomorphic CD player with a morphing track-change animation, equalizer bars, and optional Spotify metadata | `npx soraui-cli add music-player` |
| 🌑 **Dark Player** | Sleek dark-themed audio player with a rolling track list and animated disc | `npx soraui-cli add dark-player` |
| 📊 **Bar Visualizer** | Voice-assistant style frequency bars with `connecting / listening / thinking / speaking` states — plug in any `MediaStream` | `npx soraui-cli add bar-visualizer` |
| 📅 **Date Selector** | Tactile week strip with a glowing active-day indicator | `npx soraui-cli add date-selector` |
| 🌐 **Dust Sphere** | Three.js particle globe that scatters on hover and reacts to microphone input | `npx soraui-cli add dust-sphere` |
| 📝 **Transcript Viewer** | Word-level audio transcript with synced highlighting, click-to-seek, scrub bar, and TTS fallback | `npx soraui-cli add transcript-viewer` |

Live previews and full prop tables for every component: **[the docs site](https://sora-ui.vercel.app/docs)** (or run it locally, see below).

---

## ⚡ Quick Start

### Option A — CLI (recommended)

If your project already uses `shadcn/ui`, one command downloads the component, resolves your path aliases, and installs its dependencies:

```bash
npx soraui-cli add music-player
# or
pnpm dlx soraui-cli add music-player
bunx soraui-cli add music-player
```

### Option B — Manual copy-paste

1. Copy the component file you want from [`registry/`](registry/) into your project (e.g. `components/ui/music-player.tsx`).
2. Install its dependencies:

   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   ```

   > `dust-sphere` additionally needs `three`. `transcript-viewer` doesn't need `framer-motion`.

3. Make sure the `cn` helper exists at `lib/utils.ts`:

   ```ts
   import { type ClassValue, clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

---

## 🎯 Usage

### Music Player

Works out of the box with bundled copyright-free demo tracks:

```tsx
import { MusicPlayer } from "@/components/ui/music-player";

export default function App() {
  return (
    <MusicPlayer
      timelineColor="#5e6ad2"
      defaultVolume={80}
      loop
    />
  );
}
```

### Transcript Viewer

Compound components give you full layout control:

```tsx
import {
  TranscriptViewerContainer,
  TranscriptViewerAudio,
  TranscriptViewerWords,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar,
} from "@/components/ui/transcript-viewer";

export default function Demo() {
  return (
    <TranscriptViewerContainer audioSrc="/speech.mp3" alignment={myAlignment}>
      <TranscriptViewerAudio />
      <TranscriptViewerWords />
      <div className="flex items-center gap-4">
        <TranscriptViewerPlayPauseButton />
        <TranscriptViewerScrubBar className="flex-1" />
      </div>
    </TranscriptViewerContainer>
  );
}
```

`alignment` accepts a character-level timing payload (the shape returned by ElevenLabs' alignment API); a helper `parseAlignment()` converts it to word timings. Without `audioSrc`, the component falls back to browser TTS or a simulated timer.

### Bar Visualizer

```tsx
import { BarVisualizer } from "@/components/ui/bar-visualizer";

<BarVisualizer state="speaking" barCount={15} mediaStream={stream} />
```

---

## 🎵 Spotify Integration

The Music Player can pull real track metadata (titles, artists, cover art) from Spotify.

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and note your **Client ID** and **Client Secret**.
2. Keep the credentials **server-side** — e.g. in `.env`:

   ```bash
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

3. Exchange them for a short-lived access token on the server (this repo ships an example route at `app/api/spotify/token/route.ts`), then pass the token and track IDs as props:

   ```tsx
   <MusicPlayer
     spotifyToken={accessToken}
     trackIds={["0V3wPSX3ygHQwZ21K47gOO", "7qiZRhU7tZ2XG6xBvDUz6r"]}
   />
   ```

> ⚠️ **Never ship your Client Secret in client-side code.** Mint tokens on the server and hand only the short-lived `access_token` to the browser. If you deploy the example token route, add auth/rate-limiting so it can't be used by third parties.

> 💡 If no `spotifyToken`/`trackIds` are provided, the player gracefully falls back to the bundled demo tracks.

---

## 🛠 Local Development

Run the docs site and interactive playground locally:

```bash
git clone https://github.com/k4ran909/Sora-UI.git
cd Sora-UI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and browse the components from the sidebar.

**Project layout:**

```
registry/          # The component source files (what gets installed)
public/registry/   # Generated shadcn-compatible JSON (via scripts/build-registry.js)
app/docs/          # Docs site pages
components/        # Docs-site UI (viewers, playgrounds, install blocks)
cli/               # The soraui-cli npm package
```

`npm run build` regenerates the registry JSON automatically (`prebuild` hook). To rebuild it manually:

```bash
node scripts/build-registry.js
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo and create a feature branch.
2. Add or improve a component in `registry/` (and add its entry to `scripts/build-registry.js` + `registry/index.ts` so the CLI and docs pick it up).
3. Run `npm run lint` and `npm run build` before opening a PR.

Found a bug? [Open an issue](https://github.com/k4ran909/Sora-UI/issues).

---

## 📄 License

[MIT](LICENSE) © Sora UI

<div align="center">
  <sub>Built with 🖤 for developers who miss when interfaces had texture.</sub>
</div>
