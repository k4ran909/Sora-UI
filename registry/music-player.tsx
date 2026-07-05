"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
  hasPreview?: boolean;
}

// Gorgeous, copyright-free track list that mirrors the original library's stripes vibe!
const STATIC_PLAYLIST: Track[] = [
  {
    title: "De Stijl",
    artist: "The White Stripes",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    hasPreview: true,
  },
  {
    title: "Icky Thump",
    artist: "The White Stripes",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    hasPreview: true,
  },
  {
    title: "Elephant",
    artist: "The White Stripes",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    hasPreview: true,
  },
  {
    title: "White Blood Cells",
    artist: "The White Stripes",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    hasPreview: true,
  },
  {
    title: "Get Behind Me Satan",
    artist: "The White Stripes",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    hasPreview: true,
  },
];

interface MusicPlayerProps {
  /**
   * Spotify Web API Access Token (Bearer Token).
   */
  spotifyToken?: string;
  
  /**
   * List of Spotify Track IDs you want to play.
   */
  trackIds?: string[];
  
  /**
   * Circular progress timeline color (hex or Tailwind class).
   */
  timelineColor?: string;
  
  /**
   * Main player capsule background color (hex).
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
   * Default starting volume (0 to 100).
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

export function MusicPlayer({
  spotifyToken,
  trackIds,
  timelineColor = "#5e6ad2",
  componentColor = "#000000",
  titleOverride,
  artistOverride,
  defaultVolume = 80,
  playbackSpeed = 1.0,
  loop = true,
}: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(defaultVolume);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Active playlist (either static fallback or loaded from Spotify)
  const [playlist, setPlaylist] = useState<Track[]>(STATIC_PLAYLIST);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackScrollRef = useRef<HTMLDivElement | null>(null);
  const volScrollRef = useRef<HTMLDivElement | null>(null);
  
  const isScrollingTracks = useRef(false);
  const isScrollingVol = useRef(false);
  const trackScrollTimeout = useRef<number | null>(null);
  const volScrollTimeout = useRef<number | null>(null);

  const currentTrack = playlist[currentTrackIndex] || STATIC_PLAYLIST[0];

  // Sync volume and playback speed props with HTML Audio object
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
      audio.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed, currentTrackIndex]);

  // Fetch track metadata directly from Spotify API
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
            src: data.preview_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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

  // Bind HTML Audio event listeners
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
        selectTrack((currentTrackIndex + 1) % playlist.length);
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

  // Sync scroll positioning of Track & Volume lists on load/change
  useEffect(() => {
    if (trackScrollRef.current && !isScrollingTracks.current) {
      trackScrollRef.current.scrollTop = currentTrackIndex * 44;
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (volScrollRef.current && !isScrollingVol.current) {
      const volIndex = 100 - volume;
      volScrollRef.current.scrollTop = volIndex * 36;
    }
  }, [volume]);

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

  // Eject-roll track selection transition
  const selectTrack = (index: number) => {
    if (isTransitioning || index === currentTrackIndex) return;
    setIsTransitioning(true);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);

    // Scroll the track list to target item
    isScrollingTracks.current = true;
    if (trackScrollRef.current) {
      trackScrollRef.current.scrollTo({
        top: index * 44,
        behavior: "smooth"
      });
    }

    // Phase transition duration to match slide animation
    setTimeout(() => {
      setCurrentTrackIndex(index);
      const wasPlaying = isPlaying;
      
      setTimeout(() => {
        setIsTransitioning(false);
        isScrollingTracks.current = false;
        
        // Auto-play the next song if it was already playing
        if (audioRef.current) {
          const nextTrack = playlist[index];
          if (nextTrack) {
            audioRef.current.src = nextTrack.src;
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((err) => console.log("Auto-play blocked:", err));
          }
        }
      }, 350);
    }, 450);
  };

  // Debounced track scrolling (updates active index when scroll settles)
  const handleTrackScroll = () => {
    if (isScrollingTracks.current || !trackScrollRef.current) return;

    if (trackScrollTimeout.current) {
      window.clearTimeout(trackScrollTimeout.current);
    }

    trackScrollTimeout.current = window.setTimeout(() => {
      if (trackScrollRef.current) {
        const index = Math.round(trackScrollRef.current.scrollTop / 44);
        if (index >= 0 && index < playlist.length && index !== currentTrackIndex) {
          selectTrack(index);
        }
      }
    }, 150) as unknown as number;
  };

  // Volume wheel scrolling
  const handleVolScroll = () => {
    if (!volScrollRef.current) return;
    isScrollingVol.current = true;

    if (volScrollTimeout.current) {
      window.clearTimeout(volScrollTimeout.current);
    }

    const volIndex = Math.round(volScrollRef.current.scrollTop / 36);
    const newVol = Math.max(0, Math.min(100, 100 - volIndex));
    
    if (newVol !== volume) {
      setVolume(newVol);
      if (audioRef.current) {
        audioRef.current.volume = newVol / 100;
      }
    }

    volScrollTimeout.current = window.setTimeout(() => {
      isScrollingVol.current = false;
    }, 150) as unknown as number;
  };

  // Click on a specific track directly
  const handleTrackClick = (index: number) => {
    selectTrack(index);
  };

  // Circular progress ring calculation
  const radius = 107;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = duration > 0 
    ? circumference - (currentTime / duration) * circumference 
    : circumference;

  return (
    <div className="relative font-mono select-none">
      {/* Infinite Spin Keyframe styles */}
      <style>{`
        @keyframes sora-cd-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sora-cd-spin-active {
          animation: sora-cd-spin 12s linear infinite;
        }
      `}</style>

      {/* Main black pill shell */}
      <div
        style={{ backgroundColor: componentColor }}
        className="relative w-[620px] h-[260px] rounded-[130px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex items-center px-[25px] box-border border border-zinc-900/50"
      >
        {/* Hidden Audio node */}
        <audio ref={audioRef} src={currentTrack.src} />

        {/* Circular progress timeline ring surrounding the disc */}
        <div className="absolute left-[22px] top-[22px] w-[216px] h-[216px] pointer-events-none z-10">
          <svg className="w-full h-full -rotate-90">
            <circle
              className="transition-all duration-300"
              stroke={timelineColor}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={108}
              cy={108}
            />
          </svg>
        </div>

        {/* Album Art Section */}
        <div className="relative w-[210px] h-[210px] rounded-full border border-white/20 bg-[#111] overflow-hidden flex-shrink-0">
          {/* Slicing window displaying vertical cover slide strip */}
          <div className="w-full h-full absolute top-0 left-0 rounded-full overflow-hidden">
            <div
              className="w-full h-full flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateY(-${currentTrackIndex * 100}%)` }}
            >
              {playlist.map((track, idx) => {
                const isActive = idx === currentTrackIndex;
                return (
                  <div
                    key={idx}
                    style={{ backgroundImage: `url('${track.cover}')` }}
                    className={cn(
                      "w-full h-full rounded-full flex-shrink-0 bg-cover bg-center bg-[#111] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive && isPlaying && !isTransitioning ? "sora-cd-spin-active" : "",
                      isActive && !isTransitioning ? "scale-100 opacity-90" : "scale-[0.65] opacity-0",
                      isActive && isTransitioning ? "scale-[0.65] opacity-40" : "",
                      !isActive && isTransitioning && Math.abs(idx - currentTrackIndex) === 1 ? "scale-[0.65] opacity-40" : ""
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Centered play button overlay */}
          <button
            onClick={togglePlay}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-black/60 border border-white/25 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 z-30 shadow-lg outline-none",
              isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 fill-white drop-shadow" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 fill-white translate-x-0.5 drop-shadow" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Center Section: Album/Song Track list */}
        <div className="flex-1 h-full relative flex flex-col justify-center pl-8 box-border">
          <div className="absolute top-[45px] left-12 text-[10px] text-zinc-500 tracking-wider uppercase">
            Album
          </div>
          
          {/* Highlight pill indicator block */}
          <div className="absolute left-6 top-[54%] -translate-y-1/2 w-[85%] h-[44px] border border-zinc-800 rounded-[22px] bg-[#0d0d0d] pointer-events-none z-0 flex items-center justify-end pr-5 box-border">
            <div className="w-[6px] h-[6px] bg-white rounded-full" />
          </div>

          {/* Track list container with snap-scrolling */}
          <div
            ref={trackScrollRef}
            onScroll={handleTrackScroll}
            className="w-full h-[150px] overflow-y-scroll scrollbar-none snap-y snap-mandatory mt-[15px] relative z-10"
          >
            {/* Top spacer for center snap align */}
            <div className="h-[53px] flex-shrink-0" />
            
            {playlist.map((track, idx) => {
              const isActive = idx === currentTrackIndex;
              return (
                <div
                  key={idx}
                  onClick={() => handleTrackClick(idx)}
                  className={cn(
                    "h-[44px] flex items-center pl-5 snap-center cursor-pointer select-none transition-all duration-300 text-sm font-medium w-[80%]",
                    isActive ? "text-white scale-105" : "text-zinc-600 opacity-40 hover:opacity-70"
                  )}
                >
                  <span className="truncate">
                    {idx === currentTrackIndex && titleOverride ? titleOverride : track.title}
                  </span>
                </div>
              );
            })}
            
            {/* Bottom spacer for center snap align */}
            <div className="h-[53px] flex-shrink-0" />
          </div>
        </div>

        {/* Right Section: Volume Scroller */}
        <div className="w-[90px] h-full relative flex flex-col justify-center items-center flex-shrink-0">
          <div className="absolute top-[45px] text-[10px] text-zinc-500 tracking-wider uppercase">
            Vol
          </div>
          
          {/* Volume scroller container with snap-scrolling */}
          <div
            ref={volScrollRef}
            onScroll={handleVolScroll}
            className="w-full h-[150px] overflow-y-scroll scrollbar-none snap-y snap-mandatory mt-[15px]"
          >
            {/* Top spacer for center snap align */}
            <div className="h-[57px] flex-shrink-0" />
            
            {Array.from({ length: 101 }, (_, i) => 100 - i).map((val) => {
              const isActive = val === volume;
              return (
                <div
                  key={val}
                  onClick={() => {
                    setVolume(val);
                    if (audioRef.current) {
                      audioRef.current.volume = val / 100;
                    }
                  }}
                  className={cn(
                    "h-[36px] flex items-center justify-center snap-center text-xl tracking-tighter cursor-pointer select-none transition-all duration-300 font-semibold",
                    isActive ? "text-white scale-110" : "text-zinc-800 opacity-30 hover:opacity-50"
                  )}
                >
                  {val}
                </div>
              );
            })}

            {/* Bottom spacer for center snap align */}
            <div className="h-[57px] flex-shrink-0" />
          </div>
          <div className="absolute right-[22px] top-[54%] -translate-y-1/2 w-[5px] h-[5px] bg-white rounded-full pointer-events-none" />
        </div>

        {/* Center Pill Home Indicator bar */}
        <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 w-[40px] h-[4px] bg-[#444] rounded-[4px]" />
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
