"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
  hasPreview?: boolean;
}

// Built-in copyright-free tracks from the original code
const STATIC_PLAYLIST: Track[] = [
  { title: "De Stijl", artist: "The White Stripes", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Icky Thump", artist: "The White Stripes", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Elephant", artist: "The White Stripes", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "White blood cells", artist: "The White Stripes", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Get Behind Me Satan", artist: "The White Stripes", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
];

interface DarkPlayerProps {
  /**
   * Spotify Access Token.
   */
  spotifyToken?: string;
  
  /**
   * Spotify Track ID list to fetch.
   */
  trackIds?: string[];
  
  /**
   * Active selection indicator and border highlighting color (hex).
   */
  timelineColor?: string;
  
  /**
   * Background color of the pill-shaped player card (hex).
   */
  componentColor?: string;
  
  /**
   * Starting volume level (0 to 100).
   */
  defaultVolume?: number;
  
  /**
   * Default starting track index (0-indexed).
   */
  initialTrackIndex?: number;
}

export function MusicPlayer({
  spotifyToken,
  trackIds,
  timelineColor = "#3f3f46",
  componentColor = "#000000",
  defaultVolume = 80,
  initialTrackIndex = 2,
}: DarkPlayerProps) {
  const [playlist, setPlaylist] = useState<Track[]>(STATIC_PLAYLIST);
  const [activeTrackIndex, setActiveTrackIndex] = useState(initialTrackIndex);
  const [visualActiveIndex, setVisualActiveIndex] = useState(initialTrackIndex);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  
  const [isRolling, setIsRolling] = useState(false);
  const [oldTrackIndex, setOldTrackIndex] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listSectionRef = useRef<HTMLDivElement | null>(null);
  const volSectionRef = useRef<HTMLDivElement | null>(null);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelfScrollingRef = useRef(false);

  const currentTrack = playlist[activeTrackIndex] || STATIC_PLAYLIST[0];

  // Load playlist metadata from Spotify if token is supplied
  useEffect(() => {
    if (!spotifyToken || !trackIds || trackIds.length === 0) {
      setPlaylist(STATIC_PLAYLIST);
      setActiveTrackIndex(Math.min(initialTrackIndex, STATIC_PLAYLIST.length - 1));
      setVisualActiveIndex(Math.min(initialTrackIndex, STATIC_PLAYLIST.length - 1));
      return;
    }

    const loadSpotifyTracks = async () => {
      try {
        const fetchedTracks: Track[] = [];
        for (const id of trackIds) {
          const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            fetchedTracks.push({
              title: data.name,
              artist: data.artists.map((a: any) => a.name).join(", "),
              cover: data.album.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
              src: data.preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              hasPreview: !!data.preview_url,
            });
          }
        }
        if (fetchedTracks.length > 0) {
          setPlaylist(fetchedTracks);
          const startIndex = Math.min(initialTrackIndex, fetchedTracks.length - 1);
          setActiveTrackIndex(startIndex);
          setVisualActiveIndex(startIndex);
        }
      } catch (err) {
        console.error("Failed to load tracks from Spotify:", err);
        setPlaylist(STATIC_PLAYLIST);
      }
    };

    loadSpotifyTracks();
  }, [spotifyToken, trackIds, initialTrackIndex]);

  // Sync up native HTML Audio volume and source
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack.src) {
      const wasPlaying = isPlaying;
      audio.src = currentTrack.src;
      if (wasPlaying) {
        audio.play().catch((e) => console.error("Playback restart failed:", e));
      }
    }
  }, [activeTrackIndex, currentTrack.src]);

  // Scroll placements on initial load
  useEffect(() => {
    setTimeout(() => {
      // Placements for list track selector
      if (listSectionRef.current) {
        listSectionRef.current.scrollTop = activeTrackIndex * 44;
      }
      // Placements for volume scroll selector
      if (volSectionRef.current) {
        const volIdx = 100 - volume;
        volSectionRef.current.scrollTop = volIdx * 36;
      }
    }, 200);
  }, [playlist.length]);

  // Handles smooth list snapping and album change debounces
  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSelfScrollingRef.current) return;

    const container = e.currentTarget;
    const scrollPos = container.scrollTop;
    const idx = Math.round(scrollPos / 44);
    
    if (idx >= 0 && idx < playlist.length) {
      setVisualActiveIndex(idx);
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (idx !== activeTrackIndex) {
          triggerTrackChange(idx);
        }
      }, 150);
    }
  };

  const triggerTrackChange = (nextIndex: number) => {
    setOldTrackIndex(activeTrackIndex);
    setIsRolling(true);
    
    // Temporarily slide disc and fade active status
    setTimeout(() => {
      setActiveTrackIndex(nextIndex);
    }, 100);

    // Return disc rolling state to stable after transition settles (800ms)
    setTimeout(() => {
      setIsRolling(false);
      setOldTrackIndex(null);
    }, 800);
  };

  const handleVolumeScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const volIdx = Math.round(container.scrollTop / 36);
    const volVal = Math.max(0, Math.min(100, 100 - volIdx));
    if (volVal !== volume) {
      setVolume(volVal);
    }
  };

  const handleTrackClick = (idx: number) => {
    if (idx === activeTrackIndex) return;
    
    isSelfScrollingRef.current = true;
    if (listSectionRef.current) {
      listSectionRef.current.scrollTo({
        top: idx * 44,
        behavior: "smooth",
      });
    }
    
    triggerTrackChange(idx);
    setVisualActiveIndex(idx);
    
    setTimeout(() => {
      isSelfScrollingRef.current = false;
    }, 600);
  };

  const handleVolumeClick = (volVal: number) => {
    const volIdx = 100 - volVal;
    if (volSectionRef.current) {
      volSectionRef.current.scrollTo({
        top: volIdx * 36,
        behavior: "smooth",
      });
    }
    setVolume(volVal);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Play failed:", e));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative select-none font-mono">
      {/* Self-contained CSS for layout, spinning, and scrollbars */}
      <style>{`
        .sora-dark-scroll::-webkit-scrollbar {
          display: none;
        }
        .sora-dark-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes sora-disc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sora-disc-spin-active {
          animation: sora-disc-spin 12s linear infinite;
        }
      `}</style>

      {/* Main Pill Frame */}
      <div
        style={{ backgroundColor: componentColor }}
        className="relative w-[620px] h-[260px] rounded-[130px] flex items-center px-[25px] box-border shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-zinc-800/80"
      >
        <audio ref={audioRef} src={currentTrack.src} />

        {/* 1. Left Section: Album Art Sliding Disc Window */}
        <div className="flex-shrink-0 relative w-[210px] h-[210px] rounded-full border border-white/30 bg-[#111111] overflow-hidden">
          <div className="w-full h-full absolute top-0 left-0 rounded-full overflow-hidden">
            {/* Sliding Disc Strip wrapper */}
            <div
              style={{
                transform: `translateY(-${activeTrackIndex * 100}%)`,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="w-full h-full flex flex-col"
            >
              {playlist.map((track, idx) => {
                const isActive = idx === activeTrackIndex;
                const isOld = idx === oldTrackIndex;
                
                return (
                  <div
                    key={idx}
                    style={{ backgroundImage: `url('${track.cover}')` }}
                    className={cn(
                      "w-full h-full rounded-full flex-shrink-0 bg-cover bg-center transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] scale-65 opacity-0",
                      isActive && !isRolling && "opacity-90 scale-100",
                      isActive && isRolling && "opacity-40 scale-65",
                      isOld && isRolling && "opacity-40 scale-65",
                      isPlaying && isActive && !isRolling && "sora-disc-spin-active"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Centered Play/Pause Button overlay */}
          <button
            onClick={togglePlay}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 z-30 bg-black/40 hover:bg-black/60 rounded-full border border-white/20 backdrop-blur-xs",
              isRolling && "opacity-0 pointer-events-none"
            )}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 fill-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 fill-white ml-0.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* 2. Middle Section: Album/Track scroll lists */}
        <div className="flex-1 h-full relative flex flex-col justify-center pl-5 box-border">
          <div className="absolute top-[45px] left-10 text-[10px] text-zinc-500 uppercase tracking-widest">
            Album
          </div>
          
          {/* Active indicator Pill Background */}
          <div 
            style={{ borderColor: timelineColor }}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-[82%] h-[44px] border rounded-[22px] bg-[#0d0d0d] pointer-events-none flex items-center justify-end pr-5 box-border z-0"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>

          {/* Scrollable Track list */}
          <div
            ref={listSectionRef}
            onScroll={handleListScroll}
            className="sora-dark-scroll w-full h-[150px] overflow-y-scroll snap-y snap-mandatory relative z-10"
          >
            <div className="h-[53px] flex-shrink-0" /> {/* Top Spacer */}
            
            {playlist.map((track, idx) => {
              const isActive = idx === visualActiveIndex;
              const distance = Math.abs(visualActiveIndex - idx);
              const scale = Math.max(0.75, 1 - distance * 0.12);
              const opacity = Math.max(0.15, 1 - distance * 0.35);

              return (
                <div
                  key={idx}
                  onClick={() => handleTrackClick(idx)}
                  style={{ transform: `scale(${scale})`, opacity }}
                  className={cn(
                    "text-zinc-500 text-sm h-[44px] flex items-center pl-5 snap-center select-none cursor-pointer w-[80%] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] truncate font-semibold",
                    isActive && "text-white font-bold"
                  )}
                >
                  {track.title}
                </div>
              );
            })}
            
            <div className="h-[53px] flex-shrink-0" /> {/* Bottom Spacer */}
          </div>
        </div>

        {/* 3. Right Section: Volume Slider scroll snap */}
        <div className="flex-shrink-0 w-[100px] h-full relative flex flex-col justify-center items-center">
          <div className="absolute top-[45px] right-[35px] text-[10px] text-zinc-500 uppercase tracking-widest">
            Vol
          </div>

          {/* Scrollable volume scale list */}
          <div
            ref={volSectionRef}
            onScroll={handleVolumeScroll}
            className="sora-dark-scroll w-full h-[150px] overflow-y-scroll snap-y snap-mandatory"
          >
            <div className="h-[57px] flex-shrink-0" /> {/* Top Spacer */}
            
            {Array.from({ length: 101 }, (_, i) => 100 - i).map((volVal) => {
              const isActive = volVal === volume;
              const distance = Math.abs(volume - volVal);
              const ratio = Math.max(0, 1 - distance / 15);
              const scale = 1 + ratio * 0.8;
              const opacity = 0.15 + ratio * 0.85;

              return (
                <div
                  key={volVal}
                  onClick={() => handleVolumeClick(volVal)}
                  style={{ transform: `scale(${scale})`, opacity }}
                  className={cn(
                    "text-zinc-600 text-[18px] h-[36px] flex items-center justify-center snap-center font-normal select-none cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    isActive && "text-white font-bold"
                  )}
                >
                  {volVal}
                </div>
              );
            })}

            <div className="h-[57px] flex-shrink-0" /> {/* Bottom Spacer */}
          </div>

          {/* Active Volume indicator Dot */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-white rounded-full pointer-events-none" />
        </div>

        {/* Apple-style pill bottom home indicator decoration */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}
