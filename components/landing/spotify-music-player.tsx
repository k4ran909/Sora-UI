"use client";

import React, { useEffect, useState } from "react";
import { MusicPlayer } from "@/registry/music-player";
import { SAMPLE_TRACKS, SAMPLE_TRACK_IDS } from "@/registry/sample-tracks";

interface SpotifyMusicPlayerProps {
  timelineColor?: string;
  componentColor?: string;
}

/**
 * Landing-page wrapper: mints a Spotify token from our server-side route
 * (client-credentials flow) and hands it to the MusicPlayer so track metadata
 * and cover art come from Spotify. Audio always plays from the local sample
 * MP3s. If the token can't be fetched, the player falls back to the same
 * samples with their static metadata.
 */
export function SpotifyMusicPlayer({
  timelineColor,
  componentColor,
}: SpotifyMusicPlayerProps) {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const fetchToken = async () => {
      try {
        const res = await fetch("/api/spotify/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Empty body — the route reads credentials from server env vars.
          body: "{}",
          signal: controller.signal,
        });
        if (!res.ok) return; // leave token undefined → local sample fallback
        const data = await res.json();
        if (!controller.signal.aborted && data.access_token) {
          setToken(data.access_token);
        }
      } catch {
        // Network/abort error — silently fall back to local samples.
      }
    };

    fetchToken();
    return () => controller.abort();
  }, []);

  return (
    <MusicPlayer
      spotifyToken={token}
      trackIds={token ? SAMPLE_TRACK_IDS : undefined}
      tracks={SAMPLE_TRACKS}
      timelineColor={timelineColor}
      componentColor={componentColor}
    />
  );
}
