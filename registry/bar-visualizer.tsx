
"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── TYPES ───

export type AgentState =
  | "connecting"
  | "initializing"
  | "listening"
  | "speaking"
  | "thinking";

export interface AudioAnalyserOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
}

export interface MultiBandVolumeOptions {
  bands: number;
  loPass?: number;
  hiPass?: number;
  updateInterval?: number;
}

export interface BarVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current voice assistant/agent state.
   */
  state: AgentState;

  /**
   * Number of visualizer bars to display. Default: 15.
   */
  barCount?: number;

  /**
   * Real-time MediaStream source for audio analysis.
   */
  mediaStream?: MediaStream;

  /**
   * Minimum height of a bar as a percentage (0-100). Default: 20.
   */
  minHeight?: number;

  /**
   * Maximum height of a bar as a percentage (0-100). Default: 100.
   */
  maxHeight?: number;

  /**
   * Enable demo mode to generate fake audio data animations. Default: false.
   */
  demo?: boolean;

  /**
   * Center-align bars vertically (growing out from middle) instead of bottom-aligned. Default: false.
   */
  centerAlign?: boolean;

  /**
   * Optional custom color or CSS variable/gradient for the visualizer bars.
   * If provided, it overrides the state-based default colors.
   */
  color?: string;
}

// ─── AUDIO HOOKS ───

/**
 * Hook to calculate overall average volume level (0 to 1) from an audio stream.
 */
export function useAudioVolume(
  mediaStream: MediaStream | undefined | null,
  options: AudioAnalyserOptions = {}
): number {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!mediaStream) {
      setVolume(0);
      return;
    }

    let audioContext: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let animationId: number;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      source = audioContext.createMediaStreamSource(mediaStream);
      analyser = audioContext.createAnalyser();

      analyser.fftSize = options.fftSize || 32;
      analyser.smoothingTimeConstant = options.smoothingTimeConstant ?? 0.8;
      if (options.minDecibels !== undefined) analyser.minDecibels = options.minDecibels;
      if (options.maxDecibels !== undefined) analyser.maxDecibels = options.maxDecibels;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setVolume(average / 255);
        animationId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (e) {
      console.error("Audio volume analysis failed:", e);
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [mediaStream, options.fftSize, options.smoothingTimeConstant, options.minDecibels, options.maxDecibels]);

  return volume;
}

/**
 * Hook to analyze and track volume levels across multiple distinct frequency bands (0 to 1).
 */
export function useMultibandVolume(
  mediaStream: MediaStream | undefined | null,
  options: MultiBandVolumeOptions
): number[] {
  const [bands, setBands] = useState<number[]>(() => Array(options.bands).fill(0));

  useEffect(() => {
    if (!mediaStream) {
      setBands(Array(options.bands).fill(0));
      return;
    }

    let audioContext: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let animationId: number;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      source = audioContext.createMediaStreamSource(mediaStream);
      analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.75;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const sampleRate = audioContext.sampleRate;

      const loHz = options.loPass || 20;
      const hiHz = options.hiPass || 4000;
      const loIdx = Math.floor((loHz * analyser.fftSize) / sampleRate);
      const hiIdx = Math.floor((hiHz * analyser.fftSize) / sampleRate);
      const range = Math.max(1, hiIdx - loIdx);

      let lastUpdate = 0;
      const interval = options.updateInterval || 32;

      const updateBands = (timestamp: number) => {
        animationId = requestAnimationFrame(updateBands);

        if (timestamp - lastUpdate < interval) return;
        lastUpdate = timestamp;

        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);

        const bandSize = range / options.bands;
        const newBands = Array(options.bands).fill(0);

        for (let i = 0; i < options.bands; i++) {
          const start = Math.floor(loIdx + i * bandSize);
          const end = Math.floor(loIdx + (i + 1) * bandSize);
          let sum = 0;
          let count = 0;

          for (let j = start; j < end && j < bufferLength; j++) {
            sum += dataArray[j];
            count++;
          }

          const avg = count > 0 ? sum / count : 0;
          
          // Boost high frequencies slightly for better visual feedback
          const frequencyFactor = 1 + (i / options.bands) * 0.4;
          newBands[i] = Math.min(1, (avg / 255) * frequencyFactor);
        }

        setBands(newBands);
      };

      animationId = requestAnimationFrame(updateBands);
    } catch (e) {
      console.error("Multiband frequency analysis failed:", e);
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [mediaStream, options.bands, options.loPass, options.hiPass, options.updateInterval]);

  return bands;
}

/**
 * Hook to manage state-based animation sequences (connecting, listening, speaking, etc.)
 */
export function useBarAnimator(
  state: AgentState,
  columns: number,
  interval: number = 40
): number[] {
  const [heights, setHeights] = useState<number[]>(() => Array(columns).fill(0.2));

  useEffect(() => {
    let frame = 0;
    const intervalId = setInterval(() => {
      frame++;
      const newHeights = Array(columns).fill(0.2);

      if (state === "connecting") {
        // Left-to-right ping-pong scanner wave
        const period = columns * 2;
        const position = frame % period;
        const waveCenter = position < columns ? position : period - position;
        
        for (let i = 0; i < columns; i++) {
          const dist = Math.abs(i - waveCenter);
          newHeights[i] = Math.max(0.15, 0.9 - dist * 0.35);
        }
      } else if (state === "initializing") {
        // Slow pulsing breathing breath animation
        const breath = 0.4 + Math.sin(frame * 0.1) * 0.25;
        for (let i = 0; i < columns; i++) {
          newHeights[i] = breath;
        }
      } else if (state === "listening") {
        // Tiny baseline noise vibrations
        for (let i = 0; i < columns; i++) {
          const base = 0.15 + Math.sin(frame * 0.15 + i * 0.6) * 0.04;
          newHeights[i] = Math.max(0.12, base + Math.random() * 0.05);
        }
      } else if (state === "speaking") {
        // Voice-like random frequencies
        for (let i = 0; i < columns; i++) {
          const base = 0.2 + Math.sin(frame * 0.35 + i * 0.8) * 0.45;
          newHeights[i] = Math.max(0.15, base + Math.random() * 0.3);
        }
      } else if (state === "thinking") {
        // Rippling sine wave spreading outwards from center
        const center = (columns - 1) / 2;
        for (let i = 0; i < columns; i++) {
          const dist = Math.abs(i - center);
          const wave = 0.35 + Math.sin(frame * 0.2 - dist * 0.55) * 0.22;
          newHeights[i] = Math.max(0.15, wave);
        }
      }

      setHeights(newHeights);
    }, interval);

    return () => clearInterval(intervalId);
  }, [state, columns, interval]);

  return heights;
}

// ─── VISUALIZER COMPONENT ───

export function BarVisualizer({
  state,
  barCount = 15,
  mediaStream,
  minHeight = 20,
  maxHeight = 100,
  demo = false,
  centerAlign = false,
  color,
  className,
  ...props
}: BarVisualizerProps) {
  // 1. Get real volume levels from analyser hooks
  const liveBands = useMultibandVolume(demo ? null : mediaStream, { bands: barCount });
  
  // 2. Get state animation heights for demo/idle backups
  const animatedBands = useBarAnimator(state, barCount);

  // 3. Fallback logic: Use real audio analysis unless stream is missing or demo mode is explicit
  const useDemoData = demo || !mediaStream;
  const rawHeights = useDemoData ? animatedBands : liveBands;

  // 4. Map state to specific color themes (Linear/Neon styling)
  const themeMap: Record<AgentState, string> = {
    connecting: "bg-zinc-400 dark:bg-zinc-600 shadow-[0_0_15px_rgba(161,161,170,0.15)]",
    initializing: "bg-gradient-to-t from-violet-600 to-indigo-400 shadow-[0_0_20px_rgba(124,58,237,0.3)]",
    listening: "bg-gradient-to-t from-cyan-600 to-sky-400 shadow-[0_0_20px_rgba(8,145,178,0.3)]",
    speaking: "bg-gradient-to-t from-emerald-600 to-teal-400 shadow-[0_0_20px_rgba(5,150,105,0.4)]",
    thinking: "bg-gradient-to-t from-amber-600 to-orange-400 shadow-[0_0_20px_rgba(217,119,6,0.3)]",
  };

  return (
    <div
      className={cn(
        "flex gap-1.5 h-16 px-6 py-2 rounded-2xl bg-zinc-950/80 border border-zinc-800/60 backdrop-blur-md justify-center w-fit min-w-[200px] transition-colors duration-500",
        centerAlign ? "items-center" : "items-end",
        className
      )}
      {...props}
    >
      {rawHeights.map((value, i) => {
        // Clamp and calculate the final styled height value
        const calculatedHeight = Math.max(
          minHeight,
          Math.min(maxHeight, value * 100)
        );

        const barStyle: React.CSSProperties = {
          height: `${calculatedHeight}%`,
        };

        if (color) {
          if (color.includes("gradient") || color.startsWith("linear") || color.startsWith("radial") || color.startsWith("var(")) {
            barStyle.background = color;
          } else {
            barStyle.backgroundColor = color;
          }
          barStyle.boxShadow = `0 0 15px ${color}`;
        }

        return (
          <div
            key={i}
            style={barStyle}
            className={cn(
              "w-2.5 rounded-full transition-all duration-[80ms] ease-out",
              !color && themeMap[state]
            )}
          />
        );
      })}
    </div>
  );
}
