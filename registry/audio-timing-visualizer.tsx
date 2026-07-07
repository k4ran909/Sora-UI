"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface AudioTimingVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * List of words with start and end timestamps in seconds.
   */
  wordTimings?: WordTiming[];
  
  /**
   * URL to speech MP3. If omitted or fails, simulated audio playback is used.
   */
  audioSrc?: string;
  
  /**
   * Background color of the highlighting capsule. Default: "#ffffff"
   */
  highlightBg?: string;

  /**
   * Text color of the active highlighted word. Default: "#09090b"
   */
  highlightText?: string;

  /**
   * Background color of the player card. Default: "var(--card)"
   */
  componentColor?: string;
}

const DEFAULT_TIMINGS: WordTiming[] = [
  { word: "Sora", start: 0.0, end: 0.4 },
  { word: "UI", start: 0.4, end: 0.8 },
  { word: "allows", start: 0.8, end: 1.3 },
  { word: "you", start: 1.3, end: 1.6 },
  { word: "to", start: 1.6, end: 1.8 },
  { word: "generate", start: 1.8, end: 2.4 },
  { word: "audio", start: 2.4, end: 2.9 },
  { word: "timings", start: 2.9, end: 3.5 },
  { word: "—", start: 3.5, end: 3.7 },
  { word: "now", start: 3.7, end: 4.0 },
  { word: "you", start: 4.0, end: 4.2 },
  { word: "can", start: 4.2, end: 4.4 },
  { word: "easily", start: 4.4, end: 4.9 },
  { word: "visualize", start: 4.9, end: 5.6 },
  { word: "them", start: 5.6, end: 5.9 },
  { word: "too!", start: 5.9, end: 6.5 },
];

// 6.5 seconds total demo duration
const DEMO_DURATION = 6.5;

export function AudioTimingVisualizer({
  wordTimings = DEFAULT_TIMINGS,
  audioSrc,
  highlightBg = "#ffffff",
  highlightText = "#09090b",
  componentColor = "var(--card)",
  className,
  ...props
}: AudioTimingVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(DEMO_DURATION);
  const [isSimulated, setIsSimulated] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  // Initialize audio element if source is provided
  useEffect(() => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      setIsSimulated(false);

      const onTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const onLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("loadedmetadata", onLoadedMetadata);
      audio.addEventListener("ended", onEnded);

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        audio.removeEventListener("ended", onEnded);
        audioRef.current = null;
      };
    } else {
      setIsSimulated(true);
      setDuration(DEMO_DURATION);
    }
  }, [audioSrc]);

  // Simulation play loop
  const stepSimulation = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp - pauseTimeRef.current;
    }
    const elapsed = (timestamp - startTimeRef.current) / 1000;

    if (elapsed >= duration) {
      setIsPlaying(false);
      setCurrentTime(0);
      pauseTimeRef.current = 0;
      startTimeRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } else {
      setCurrentTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(stepSimulation);
    }
  };

  useEffect(() => {
    if (isSimulated && isPlaying) {
      animationFrameRef.current = requestAnimationFrame(stepSimulation);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (isSimulated && !isPlaying) {
        pauseTimeRef.current = currentTime * 1000;
        startTimeRef.current = 0;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isSimulated]);

  const handlePlayPause = () => {
    if (isSimulated) {
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          // Fallback to simulation if audio block occurs
          setIsSimulated(true);
          startTimeRef.current = 0;
          pauseTimeRef.current = currentTime * 1000;
          setIsPlaying(true);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressBarRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * duration;

    setCurrentTime(newTime);

    if (!isSimulated && audioRef.current) {
      audioRef.current.currentTime = newTime;
    } else if (isSimulated) {
      pauseTimeRef.current = newTime * 1000;
      if (isPlaying) {
        startTimeRef.current = performance.now() - pauseTimeRef.current;
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{ backgroundColor: componentColor }}
      className={cn(
        "w-full rounded-[24px] p-6 flex flex-col justify-between box-border border border-zinc-200/10 dark:border-zinc-800/20 shadow-[0_25px_50px_rgba(0,0,0,0.25)] select-none font-sans relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Words Layout Container */}
      <div className="flex flex-wrap items-center justify-start text-left mb-6 leading-relaxed select-none min-h-[90px] content-start">
        {wordTimings.map((t, idx) => {
          const isActive = currentTime >= t.start && currentTime < t.end;
          return (
            <span
              key={idx}
              style={isActive ? { 
                backgroundColor: highlightBg, 
                color: highlightText 
              } : undefined}
              className={cn(
                "inline-block text-[15px] sm:text-[18px] transition-all duration-200 rounded px-1.5 py-0.5",
                isActive 
                  ? "font-bold shadow-[0_4px_12px_rgba(255,255,255,0.15)] scale-105" 
                  : "text-zinc-400 dark:text-zinc-500 font-medium hover:text-zinc-200"
              )}
            >
              {t.word}
            </span>
          );
        })}
      </div>

      {/* Progress Slider Bar */}
      <div className="w-full flex flex-col gap-2 mb-6">
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="w-full h-1.5 bg-zinc-700/80 rounded-full relative cursor-pointer group flex items-center"
        >
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full bg-white rounded-full pointer-events-none transition-all duration-75"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {/* Knob handler */}
          <div
            className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-75 -translate-x-1/2 pointer-events-none"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Timers readouts */}
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      </div>

      {/* Control Action Buttons */}
      <button
        onClick={handlePlayPause}
        className="w-full h-11 border border-zinc-700/60 dark:border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 active:scale-[0.98] transition-all text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-inner"
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4 fill-current text-white" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4 fill-current text-white" />
            <span>Play</span>
          </>
        )}
      </button>
    </div>
  );
}
