"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
  hasPreview?: boolean;
}

// Some lovely, copyright-free fallback tracks so the player works right out of the box!
const STATIC_PLAYLIST: Track[] = [
  {
    title: "Forest Song",
    artist: "Mavka",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    hasPreview: true,
  },
  {
    title: "Urban Echoes",
    artist: "Lofi Dreamer",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    hasPreview: true,
  },
  {
    title: "Neon Dreams",
    artist: "Synthwave King",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    hasPreview: true,
  },
];

interface MusicPlayerProps {
  /**
   * Spotify Web API Access Token (Bearer Token).
   * Grab a temporary token from: https://developer.spotify.com/documentation/web-api
   */
  spotifyToken?: string;
  
  /**
   * List of Spotify Track IDs you want to play.
   * Example: ["0V3wPSX3ygHQwZ21K47gOO", "7qiZRhU7tZ2XG6xBvDUz6r"]
   */
  trackIds?: string[];
  
  /**
   * Timeline progress indicator color (hex or Tailwind class).
   */
  timelineColor?: string;
  
  /**
   * Music player card background color (hex).
   */
  componentColor?: string;
  
  /**
   * Override text for the display song title.
   */
  titleOverride?: string;
  
  /**
   * Override text for the display artist name.
   */
  artistOverride?: string;
  
  /**
   * Default audio volume (0 to 100).
   */
  defaultVolume?: number;
  
  /**
   * Playback speed multiplier (0.5, 1.0, 1.5, 2.0).
   */
  playbackSpeed?: number;
  
  /**
   * Toggles whether the playlist should loop continuously.
   */
  loop?: boolean;
}

// Framer motion variants to make those wave bars dance up and down!
const barVariants: Variants = {
  playing: (i: number) => ({
    scaleY: [1, 0.3, 1],
    transition: {
      repeat: Infinity,
      duration: 1.2,
      delay: i * 0.15,
      ease: "easeInOut",
    },
  }),
  paused: {
    scaleY: 1,
  },
};

export function MusicPlayer({
  spotifyToken,
  trackIds,
  timelineColor = "#5e6ad2",
  componentColor = "#0f1011",
  titleOverride,
  artistOverride,
  defaultVolume = 80,
  playbackSpeed = 1.0,
  loop = true,
}: MusicPlayerProps) {
  // Let's hook up our track playback state so React knows when to re-render
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [coverOpacity, setCoverOpacity] = useState(1);

  // Our active playlist state. If Spotify isn't connected, we default to our lovely local track mix.
  const [playlist, setPlaylist] = useState<Track[]>(STATIC_PLAYLIST);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || STATIC_PLAYLIST[0];

  // Sync up our native HTML Audio ref with user-provided volume & speed props whenever they update
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = defaultVolume / 100;
      audio.playbackRate = playbackSpeed;
    }
  }, [defaultVolume, playbackSpeed, currentTrackIndex]);

  // Effect hook to fetch song details directly from Spotify. 
  // If no credentials or IDs are passed, we gracefully fallback to local demo songs.
  useEffect(() => {
    if (!spotifyToken || !trackIds || trackIds.length === 0) {
      setPlaylist(STATIC_PLAYLIST);
      setCurrentTrackIndex(0);
      setSpotifyError(null);
      return;
    }

    const loadSpotifyTracks = async () => {
      setSpotifyError(null);
      try {
        const fetchedTracks: Track[] = [];

        for (const id of trackIds) {
          const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          });

          if (!res.ok) {
            throw new Error(`Track ${id} fetch failed (${res.statusText})`);
          }

          const data = await res.json();
          
          fetchedTracks.push({
            title: data.name,
            artist: data.artists.map((a: any) => a.name).join(", "),
            cover: data.album.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
            src: data.preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // fallback to local audio if no preview is available
            hasPreview: !!data.preview_url,
          });
        }

        setPlaylist(fetchedTracks);
        setCurrentTrackIndex(0);
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch (err: any) {
        setSpotifyError(err.message || "Failed to load tracks from Spotify.");
        setPlaylist(STATIC_PLAYLIST);
      }
    };

    loadSpotifyTracks();
  }, [spotifyToken, trackIds]);

  // Quick helper to format raw audio seconds into a friendly human-readable MM:SS string
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Bind basic HTML Audio event listeners so we can sync time progress and know when the track finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (loop) {
        changeTrack((currentTrackIndex + 1) % playlist.length);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, playlist, loop]);

  const togglePlay = () => {
    if (isTransitioning) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Playback failed:", err);
      });
    }
  };

  // The secret sauce: morphing the spinning CD out to a card, swapping tracks, then morphing it back!
  const changeTrack = (nextIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    let targetIndex = nextIndex;
    if (targetIndex < 0) targetIndex = playlist.length - 1;
    if (targetIndex >= playlist.length) targetIndex = 0;

    // Stop whatever is playing before we begin the morph transition
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);

    // Phase 1: CD morphs into the fullscreen album art card while hiding detail text
    setIsFullscreen(true);

    // Phase 2: Fade the cover art opacity down slightly during transition
    setTimeout(() => {
      setCoverOpacity(0.1);
    }, 450);

    // Phase 3: Switch the current track index and restore cover visibility
    setTimeout(() => {
      setCurrentTrackIndex(targetIndex);
      setCoverOpacity(1);
    }, 900);

    // Phase 4: Shrink the fullscreen cover back down into the circular CD shape
    setTimeout(() => {
      setIsFullscreen(false);
    }, 1500);

    // Phase 5: Kick off the audio playback for the new track and let the disc spin!
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsTransitioning(false);
          })
          .catch((err) => {
            console.error("Auto-play failed:", err);
            setIsTransitioning(false);
          });
      } else {
        setIsTransitioning(false);
      }
    }, 2200);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning || !audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    audioRef.current.currentTime = seekTime;
  };

  return (
    <div className="relative font-mono select-none">
      {/* Embedded keyframe styles for spinning the CD disc. Inline works perfectly here. */}
      <style>{`
        @keyframes sora-cd-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sora-cd-spin-active {
          animation: sora-cd-spin 12s linear infinite;
        }
      `}</style>

      {/* Outer Neumorphic Card container */}
      <div 
        style={{ backgroundColor: componentColor }}
        className="relative w-[300px] h-[380px] rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.12),_inset_0_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5),_inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col justify-end pb-8 overflow-hidden border border-zinc-200/20 dark:border-zinc-800/30"
      >
        {/* The actual HTML5 Audio player hidden under the hood */}
        <audio ref={audioRef} src={currentTrack.src} />

        {/* Spinning CD Disc container which morphs to fullscreen during track changes */}
        <motion.div
          onClick={togglePlay}
          animate={{
            left: isFullscreen ? 0 : 10,
            top: isFullscreen ? 0 : -120,
            width: isFullscreen ? 300 : 280,
            height: isFullscreen ? 380 : 280,
            borderRadius: isFullscreen ? "40px" : "140px", // 50% border radius
          }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            backgroundImage: `url('${currentTrack.cover}')`,
            opacity: coverOpacity,
            animationPlayState: isPlaying && !isFullscreen ? "running" : "paused",
          }}
          className={cn(
            "absolute z-20 bg-cover bg-center flex justify-center items-center shadow-lg shadow-black/15",
            !isFullscreen ? "sora-cd-spin-active cursor-pointer active:scale-98" : "cursor-default"
          )}
          title={!isFullscreen ? "Click to play/pause" : undefined}
        >
          {/* Skeuomorphic touch: the plastic center hole of the CD */}
          <motion.div
            animate={{ opacity: isFullscreen ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/25 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3),_0_0_5px_rgba(0,0,0,0.5)] bg-[radial-gradient(circle,_#b4b4b4_30%,_#999_70%)] pointer-events-none"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)]" />
          </motion.div>
        </motion.div>

        {/* Text info & playback controls */}
        <motion.div
          animate={{ opacity: isFullscreen ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center z-30 px-8 select-none overflow-hidden"
        >
          {/* Tiny dancing equalizer wave bars to show playback activity */}
          <div className="flex items-center gap-[3px] h-4 mb-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={barVariants}
                animate={isPlaying ? "playing" : "paused"}
                className="w-0.5 h-4 bg-zinc-500 dark:bg-zinc-400 rounded-full origin-center"
              />
            ))}
          </div>

          {/* Artist & Song Title labels */}
          <div className="text-zinc-500 dark:text-zinc-400 text-xs tracking-wider mb-1 max-w-full truncate text-center">
            {artistOverride || currentTrack.artist}
          </div>
          <div className="text-zinc-950 dark:text-white text-base font-bold tracking-tight mb-4 max-w-full text-center truncate">
            {titleOverride || currentTrack.title}
          </div>

          {/* Progress bar with drag/seek interactivity */}
          <div className="w-full max-w-[200px] flex flex-col items-center mb-3">
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="w-full h-1 bg-zinc-700 rounded-full relative cursor-pointer overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full pointer-events-none"
                style={{ 
                  width: `${duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
                  backgroundColor: timelineColor 
                }}
              />
            </div>
            
            <div className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 tabular-nums">
              <span className="text-zinc-950 dark:text-white">{formatTime(currentTime)}</span>
              <span className="mx-1 opacity-40">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Skip buttons */}
          <div className="flex items-center justify-center gap-8 w-full mt-1">
            <button
              onClick={() => changeTrack(currentTrackIndex - 1)}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              title="Previous Track"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6L18 18V6z" />
              </svg>
            </button>
            
            <button
              onClick={() => changeTrack(currentTrackIndex + 1)}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              title="Next Track"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Spotify Error Alert */}
      {spotifyError && (
        <div className="absolute -bottom-10 left-0 right-0 text-[10px] text-red-400 text-center">
          ⚠️ {spotifyError}
        </div>
      )}
    </div>
  );
}
