// Curated demo playlist for the landing page.
//
// Audio always plays from local MP3s in /public/audio (Spotify's Web API only
// serves 30s previews, and those are null for nearly every track). The Spotify
// track IDs are used to enrich each entry with verified title/artist/cover art
// when a token is available; otherwise these static values are the fallback.
//
// IMPORTANT: SAMPLE_TRACKS and SAMPLE_TRACK_IDS must stay index-aligned —
// MusicPlayer matches trackIds[i] to tracks[i].

export interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
  hasPreview?: boolean;
}

export const SAMPLE_TRACKS: Track[] = [
  {
    title: "Stayin' Alive",
    artist: "Bee Gees",
    cover: "https://i.scdn.co/image/ab67616d0000b27352038992fc6d7868f31d23b7",
    src: "/audio/stayin-alive.mp3",
    hasPreview: true,
  },
  {
    title: "Milkshake",
    artist: "Kelis",
    cover: "https://i.scdn.co/image/ab67616d0000b273f15a5df5eeed858907cee229",
    src: "/audio/milkshake.mp3",
    hasPreview: true,
  },
  {
    title: "Macarena (Bayside Boys Remix)",
    artist: "Los Del Rio",
    cover: "https://i.scdn.co/image/ab67616d0000b273a8c284ce171e96a79eabf7de",
    src: "/audio/macarena.mp3",
    hasPreview: true,
  },
  {
    title: "La Isla Bonita",
    artist: "Madonna",
    cover: "https://i.scdn.co/image/ab67616d0000b273de3094d98b62340d3268c7bc",
    src: "/audio/la-isla-bonita.mp3",
    hasPreview: true,
  },
  {
    title: "U Should've Known Better",
    artist: "Monica",
    cover: "https://i.scdn.co/image/ab67616d0000b2730cfb7f6743c0742761edf377",
    src: "/audio/u-shouldve-known-better.mp3",
    hasPreview: true,
  },
  {
    title: "Oh, Pretty Woman",
    artist: "Roy Orbison",
    cover: "https://i.scdn.co/image/ab67616d0000b27377958c617ea2cb4462db1193",
    src: "/audio/oh-pretty-woman.mp3",
    hasPreview: true,
  },
  {
    title: "Hips Don't Lie",
    artist: "Shakira, Wyclef Jean",
    cover: "https://i.scdn.co/image/ab67616d0000b27385432abc16fd92be0d435cb9",
    src: "/audio/hips-dont-lie.mp3",
    hasPreview: true,
  },
];

// Same order as SAMPLE_TRACKS — verified live against the Spotify Web API.
export const SAMPLE_TRACK_IDS: string[] = [
  "3mRM4NM8iO7UBqrSigCQFH", // Stayin' Alive — Bee Gees
  "26wpcLqBHEfOL00i1rdbun", // Milkshake — Kelis
  "7obdw7ZGr6l1GqSBkFiY11", // Macarena (Bayside Boys Remix) — Los Del Rio
  "6r8k1vznHrzlEKYxL4dZEe", // La Isla Bonita — Madonna
  "0EQuu6hyNACWI7LT7N5pRv", // U Should've Known Better — Monica
  "48i055G1OT5KxGGftwFxWy", // Oh, Pretty Woman — Roy Orbison
  "3d0WouFnFmr0K3kjeza3fF", // Hips Don't Lie — Shakira, Wyclef Jean
];
