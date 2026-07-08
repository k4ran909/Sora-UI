<div align="center">
  <img src="public/logo.svg" width="96" height="96" alt="Sora UI logo" />

  # Sora UI

  **Skeuomorphic, copy-paste React components for Next.js + Tailwind CSS.**

  <p>
    <a href="https://github.com/k4ran909/Sora-UI/stargazers"><img src="https://img.shields.io/github/stars/k4ran909/Sora-UI?style=flat-square&color=5e6ad2" alt="GitHub stars" /></a>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT license" />
  </p>

  <a href="https://sora-ui-plum.vercel.app"><strong>Live Demo</strong></a> ·
  <a href="https://sora-ui-plum.vercel.app/docs"><strong>Docs</strong></a> ·
  <a href="#-components">Components</a> ·
  <a href="#-quick-start">Quick Start</a>
</div>

---

Tactile, animated UI you **own**. No package dependency — the source lands in your repo, so you can restyle and rewrite it freely. Installs through the shadcn CLI registry (aliases and deps resolved for you) or plain copy-paste.

## 🧩 Components

| Component | Description | Install |
|---|---|---|
| 📀 **Music Player** | Skeuomorphic CD player with morphing track-change animation + optional Spotify metadata | `npx soraui-cli add music-player` |
| 🌑 **Dark Player** | Dark pill player with a rolling track list and spinning disc | `npx soraui-cli add dark-player` |
| 📊 **Bar Visualizer** | Voice-agent frequency bars with live `MediaStream` + state animations | `npx soraui-cli add bar-visualizer` |
| 📅 **Date Selector** | Tactile week strip with a glowing active-day indicator | `npx soraui-cli add date-selector` |
| 🌐 **Dust Sphere** | Three.js particle globe that reacts to mic input | `npx soraui-cli add dust-sphere` |
| 📝 **Transcript Viewer** | Word-level transcript synced to audio, with click-to-seek and TTS fallback | `npx soraui-cli add transcript-viewer` |

## ⚡ Quick Start

```bash
# If your project uses shadcn/ui — resolves aliases + deps automatically
npx soraui-cli add music-player
```

Or copy a file from [`registry/`](registry/) manually, then install its deps and add the `cn` helper:

```bash
npm install framer-motion lucide-react clsx tailwind-merge   # + three (dust-sphere)
```

```ts
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

```tsx
import { MusicPlayer } from "@/components/ui/music-player";

<MusicPlayer timelineColor="#5e6ad2" defaultVolume={80} loop />
```

> Optional: pass `spotifyToken` + `trackIds` to pull real track metadata. Mint tokens **server-side** — see [`app/api/spotify/token/route.ts`](app/api/spotify/token/route.ts). Without them, the player falls back to bundled demo tracks.

## 🏗 How It Works

```mermaid
flowchart LR
    A["registry/*.tsx<br/>component source"] -->|build-registry.js| B["public/registry/*.json<br/>shadcn schema"]
    B --> C{Install}
    C -->|soraui-cli add| D["shadcn CLI"]
    C -->|copy-paste| E["registry/ file"]
    D --> F["your project<br/>components/ui/"]
    E --> F
    A --> G["app/docs<br/>live playground"]
```

The `registry/` files are the single source of truth. A `prebuild` hook (`scripts/build-registry.js`) compiles them into shadcn-compatible JSON that the CLI serves, while the docs site renders the same files as live previews.

## 🛠 Local Development

```bash
git clone https://github.com/k4ran909/Sora-UI.git
cd Sora-UI && npm install && npm run dev   # → http://localhost:3000
```

```
registry/          Component source (what gets installed)
public/registry/   Generated shadcn JSON  ← scripts/build-registry.js
app/docs/          Docs site + playground
cli/               soraui-cli npm package
```

## 🤝 Contributing

Fork → add/improve a component in `registry/` (register it in `scripts/build-registry.js` + `registry/index.ts`) → run `npm run lint && npm run build` → open a PR. Found a bug? [Open an issue](https://github.com/k4ran909/Sora-UI/issues).

## 📄 License

[MIT](LICENSE) © Sora UI

<div align="center">
  <sub>Built with 🖤 for developers who miss when interfaces had texture.</sub>
</div>
