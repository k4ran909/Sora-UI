<div align="center">
  <img src="public/logo.png" width="120" height="120" alt="Sora UI Logo" />
  <h1>Sora UI 🕯️</h1>
  <p><strong>Hey developer!</strong> Welcome to Sora UI — a crafted collection of gorgeous, interactive, and copy-paste friendly skeuomorphic components for Next.js and Tailwind CSS.</p>
  
  <p>
    <a href="#-why-sora-ui">Why Sora UI?</a> •
    <a href="#%EF%B8%8F-quick-start">Quick Start</a> •
    <a href="#-the-skeuomorphic-music-player">Music Player Specs</a> •
    <a href="#-how-to-wire-up-spotify">Spotify Setup</a> •
    <a href="#-customization-props">Props API</a>
  </p>
</div>

---

## 🖤 Why Sora UI?

Let's face it: most web interfaces today look exactly the same. Flat grids, generic cards, and sterile layouts are everywhere. 

We built **Sora UI** to bring back the fun! Inspired by the dark, high-end visual aesthetic of Linear.app and the tactile feel of classic hardware, Sora UI combines modern React animations (via Framer Motion) with skeuomorphic design.

And best of all? **It's 100% copy-pasteable and v0.app compatible.** No bloated npm packages to install, no complex config files to adjust — just copy the component file, drop it in, customize it with props, and you're good to go!

---

## ⚡ Quick Start

### 1. Copy the Code
Grab the raw code of the component you want from our registry folder. For example, copy the contents of [music-player.tsx](registry/music-player.tsx).

### 2. Drop it in your project
Create a new file in your React/Next.js project. We suggest putting it in:
`components/music-player.tsx`

### 3. Grab the dependencies
We use standard animation and utility helper libraries. Run this command to install them:
```bash
npm install framer-motion clsx tailwind-merge lucide-react
```

### 4. Ensure your tailwind helper exists
If you don't already have the standard class merger in `lib/utils.ts`, drop this snippet in:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 📻 The Skeuomorphic Music Player

Our centerpiece component is a classic CD player shell with premium interactions:
* **The Tactile Spin:** Clicking play starts an infinite, buttery-smooth CSS rotation of the vinyl disc cover art.
* **Equalizer Waves:** Five responsive wave bars dance dynamically to show playback activity.
* **Morphing Transition:** Switching tracks triggers a custom Framer Motion timeline where the spinning CD expands to fill the entire card, crossfades the album art, and then scales back down.

---

## 🎵 How to Wire Up Spotify

To dynamicize your CD covers and song streams directly from Spotify's database, you just need a Bearer Access Token!

### Step 1: Create a Developer App
Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in. Click **Create App**, give it any name, and grab your **Client ID** and **Client Secret**.

### Step 2: Grab an Access Token
You can trade your client credentials for a temporary token using the built-in route we set up in this repo: `app/api/spotify/token/route.ts`. 

Simply make a `POST` request to `/api/spotify/token` containing your credentials:
```json
{
  "clientId": "your_client_id_here",
  "clientSecret": "your_client_secret_here"
}
```

It will return an `access_token`.

### Step 3: Pass Props to the Player
Simply pass your Spotify Token and the track IDs you want to play! The component will load all track metadata automatically.

```tsx
import { MusicPlayer } from "@/components/music-player";

export default function App() {
  const SPOTIFY_TOKEN = "BQB16..."; // paste token here
  const MY_TRACKS = [
    "0V3wPSX3ygHQwZ21K47gOO", // Shape of You
    "7qiZRhU7tZ2XG6xBvDUz6r", // Blinding Lights
  ];

  return (
    <MusicPlayer 
      spotifyToken={SPOTIFY_TOKEN} 
      trackIds={MY_TRACKS} 
    />
  );
}
```

> 💡 **Tip:** If no `spotifyToken` or `trackIds` are supplied, the player is smart enough to gracefully load our copyright-free local fallback songs so it works right out of the box!

---

## 🎨 Customization Props

Every style and behavioral setting can be adjusted via props on the `<MusicPlayer />` component:

| Prop | Type | Default | Description |
|---|---|---|---|
| `spotifyToken` | `string` | — | Your Spotify Web API Bearer token for retrieving dynamic cover art and previews. |
| `trackIds` | `string[]` | — | List of Spotify Track ID strings to load into the player playlist. |
| `timelineColor` | `string` | `"#5e6ad2"` | Accent color of the seeking progress track fill. |
| `componentColor` | `string` | `"#0f1011"` | The background hex color of the music player shell. |
| `titleOverride` | `string` | — | Override text to display a custom song title. |
| `artistOverride` | `string` | — | Override text to display a custom artist name. |
| `defaultVolume` | `number` | `80` | Initial playback volume from 0 (muted) to 100 (full). |
| `playbackSpeed` | `number` | `1.0` | Default rate multiplier. Supports `0.5`, `1.0`, `1.5`, and `2.0`. |
| `loop` | `boolean` | `true` | Loops playlist playback continuously. |

---

## 🛠️ Local Development Preview

If you want to run our interactive docs site and playground locally to test custom themes and configurations:

1. Clone or download this project folder
2. Install the local project dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser and click on **Skeuomorphic Music Player** in the sidebar navigation!
