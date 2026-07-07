"use client";

import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TYPES & INTERFACES ───

export interface CharacterAlignmentResponseModel {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

export type WordStatus = "spoken" | "unspoken" | "current";

export interface TranscriptViewerContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  alignment: CharacterAlignmentResponseModel;
  words: TranscriptWord[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  seekToTime: (time: number) => void;
  seekToWord: (word: TranscriptWord) => void;
  playbackMode: "audio" | "speech" | "simulated";
}

const TranscriptViewerContext = createContext<TranscriptViewerContextType | null>(null);

// ─── PARSER HELPER ───

export function parseAlignment(alignment: CharacterAlignmentResponseModel): TranscriptWord[] {
  const words: TranscriptWord[] = [];
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;

  if (!chars || !starts || !ends || chars.length === 0) return [];

  let currentWord = "";
  let wordStart = 0;
  let wordEnd = 0;
  let inWord = false;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const isSpace = char === " " || char === "\n" || char === "\t";

    if (!isSpace) {
      if (!inWord) {
        inWord = true;
        currentWord = char;
        wordStart = starts[i];
        wordEnd = ends[i];
      } else {
        currentWord += char;
        wordEnd = ends[i];
      }
    } else {
      if (inWord) {
        words.push({ word: currentWord, start: wordStart, end: wordEnd });
        inWord = false;
      }
    }
  }

  if (inWord) {
    words.push({ word: currentWord, start: wordStart, end: wordEnd });
  }

  return words;
}

// ─── DYNAMIC TRANSCRIPT COMPOSER ───

const DEFAULT_WORD_TIMINGS = [
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

export function generateDefaultMockAlignment(): CharacterAlignmentResponseModel {
  const characters: string[] = [];
  const character_start_times_seconds: number[] = [];
  const character_end_times_seconds: number[] = [];

  DEFAULT_WORD_TIMINGS.forEach((wt, idx) => {
    const word = wt.word;
    const duration = wt.end - wt.start;
    const charDuration = duration / word.length;

    for (let i = 0; i < word.length; i++) {
      characters.push(word[i]);
      character_start_times_seconds.push(wt.start + i * charDuration);
      character_end_times_seconds.push(wt.start + (i + 1) * charDuration);
    }

    if (idx < DEFAULT_WORD_TIMINGS.length - 1) {
      characters.push(" ");
      character_start_times_seconds.push(wt.end);
      character_end_times_seconds.push(wt.end + 0.05);
    }
  });

  return {
    characters,
    character_start_times_seconds,
    character_end_times_seconds,
  };
}

// Calculate duration from alignment bounds
function getAlignmentDuration(alignment: CharacterAlignmentResponseModel): number {
  if (alignment.character_end_times_seconds.length > 0) {
    return alignment.character_end_times_seconds[alignment.character_end_times_seconds.length - 1];
  }
  return 6.5;
}

// ─── HOOKS ───

export function useTranscriptViewerContext() {
  const context = useContext(TranscriptViewerContext);
  if (!context) {
    throw new Error("TranscriptViewer compound components must be rendered within a TranscriptViewerContainer");
  }
  return context;
}

export function useTranscriptViewer({
  alignment,
  audioSrc,
}: {
  alignment?: CharacterAlignmentResponseModel;
  audioSrc?: string;
}) {
  const defaultAlignment = useRef(generateDefaultMockAlignment());
  const activeAlignment = alignment || defaultAlignment.current;
  const words = parseAlignment(activeAlignment);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => getAlignmentDuration(activeAlignment));
  const [playbackMode, setPlaybackMode] = useState<"audio" | "speech" | "simulated">("simulated");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Sync duration if alignment input changes
  useEffect(() => {
    setDuration(getAlignmentDuration(activeAlignment));
  }, [activeAlignment]);

  // Initialize playback mode
  useEffect(() => {
    if (audioSrc) {
      setPlaybackMode("audio");
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
      }
    } else if (typeof window !== "undefined" && window.speechSynthesis) {
      setPlaybackMode("speech");
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.getVoices();
        }
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        }
      };
    } else {
      setPlaybackMode("simulated");
    }
  }, [audioSrc]);

  // RequestAnimationFrame timer loop (Used for both speech synthesis and simulation mode)
  // This guarantees smooth, device-independent slider updates!
  const stepTimer = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setCurrentTime((prev) => {
      const next = prev + delta;
      if (next >= duration) {
        setIsPlaying(false);
        if (playbackMode === "speech" && typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        lastTimeRef.current = 0;
        return 0;
      }
      return next;
    });

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(stepTimer);
    }
  };

  useEffect(() => {
    if (isPlaying && playbackMode !== "audio") {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(stepTimer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = 0;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackMode, duration]);

  // Browser TTS engine trigger
  const speakFromTime = (time: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    let startWordIdx = 0;
    for (let i = 0; i < words.length; i++) {
      if (time >= words[i].start && time < words[i].end) {
        startWordIdx = i;
        break;
      }
    }

    const slicedWords = words.slice(startWordIdx);
    const textToSpeak = slicedWords.map(t => t.word).join(" ");
    
    if (!textToSpeak) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith("en-US") && v.name.includes("Google")) ||
                         voices.find(v => v.lang.startsWith("en-US")) ||
                         voices.find(v => v.lang.startsWith("en")) ||
                         voices[0];

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
    utterance.rate = 0.95; // Speaking speed multiplier

    utterance.onend = () => {
      // Handled by the master timer loop to ensure sync
    };

    utterance.onerror = () => {
      // Silent fallback
    };

    window.speechSynthesis.speak(utterance);
  };

  const play = () => {
    setIsPlaying(true);
    if (playbackMode === "audio" && audioRef.current) {
      audioRef.current.play().catch(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          setPlaybackMode("speech");
          speakFromTime(currentTime);
        } else {
          setPlaybackMode("simulated");
        }
      });
    } else if (playbackMode === "speech") {
      speakFromTime(currentTime);
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (playbackMode === "audio" && audioRef.current) {
      audioRef.current.pause();
    } else if (playbackMode === "speech" && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const seekToTime = (time: number) => {
    const clampedTime = Math.max(0, Math.min(duration, time));
    setCurrentTime(clampedTime);

    if (playbackMode === "audio" && audioRef.current) {
      audioRef.current.currentTime = clampedTime;
    } else if (playbackMode === "speech") {
      if (isPlaying) {
        speakFromTime(clampedTime);
      }
    }
    // Update animation frames delta offset
    if (isPlaying) {
      lastTimeRef.current = performance.now();
    }
  };

  const seekToWord = (word: TranscriptWord) => {
    seekToTime(word.start);
  };

  return {
    audioRef,
    words,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isPlaying,
    play,
    pause,
    seekToTime,
    seekToWord,
    playbackMode,
  };
}

// ─── COMPOUND COMPONENTS ───

export interface TranscriptViewerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  audioSrc?: string;
  alignment?: CharacterAlignmentResponseModel;
  componentColor?: string;
}

export function TranscriptViewerContainer({
  audioSrc,
  alignment,
  componentColor = "var(--card)",
  className,
  children,
  ...props
}: TranscriptViewerContainerProps) {
  const viewer = useTranscriptViewer({ alignment, audioSrc });

  useEffect(() => {
    const audio = viewer.audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      viewer.setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      viewer.setDuration(audio.duration);
    };

    const onEnded = () => {
      viewer.pause();
      viewer.setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [viewer.playbackMode]);

  return (
    <TranscriptViewerContext.Provider value={viewer as any}>
      <div
        style={{ backgroundColor: componentColor }}
        className={cn(
          "w-full rounded-[24px] p-6 flex flex-col justify-between box-border border border-zinc-200/10 dark:border-zinc-800/20 shadow-[0_25px_50px_rgba(0,0,0,0.25)] select-none font-sans relative overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TranscriptViewerContext.Provider>
  );
}

export function TranscriptViewerAudio(props: React.AudioHTMLAttributes<HTMLAudioElement>) {
  const { audioRef, playbackMode } = useTranscriptViewerContext();
  if (playbackMode !== "audio") return null;

  return (
    <audio
      ref={audioRef}
      className="hidden"
      {...props}
    />
  );
}

export interface TranscriptViewerWordsProps extends React.HTMLAttributes<HTMLDivElement> {
  renderWord?: (props: { word: TranscriptWord; status: WordStatus }) => React.ReactNode;
  wordClassNames?: string;
  gapClassNames?: string;
  highlightBg?: string;
  highlightText?: string;
}

export function TranscriptViewerWords({
  renderWord,
  wordClassNames,
  gapClassNames,
  highlightBg = "var(--primary)",
  highlightText = "var(--primary-foreground)",
  className,
  ...props
}: TranscriptViewerWordsProps) {
  const { words, currentTime, seekToWord } = useTranscriptViewerContext();

  const getWordStatus = (w: TranscriptWord): WordStatus => {
    if (currentTime >= w.start && currentTime < w.end) return "current";
    if (currentTime >= w.end) return "spoken";
    return "unspoken";
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start text-left mb-4 leading-relaxed select-none min-h-[60px] content-start gap-y-1.5",
        className
      )}
      {...props}
    >
      {words.map((w, idx) => {
        const status = getWordStatus(w);
        const isActive = status === "current";

        if (renderWord) {
          return <React.Fragment key={idx}>{renderWord({ word: w, status })}</React.Fragment>;
        }

        return (
          <React.Fragment key={idx}>
            <span
              onClick={() => seekToWord(w)}
              style={isActive ? { 
                backgroundColor: highlightBg, 
                color: highlightText 
              } : undefined}
              className={cn(
                "inline-block text-[15px] sm:text-[18px] transition-all duration-200 rounded px-1.5 py-0.5 cursor-pointer",
                isActive 
                  ? "font-bold shadow-[0_4px_12px_rgba(255,255,255,0.15)] scale-105" 
                  : status === "spoken"
                    ? "text-zinc-900 dark:text-zinc-100 font-medium"
                    : "text-zinc-400 dark:text-zinc-500 font-medium hover:text-zinc-800 dark:hover:text-zinc-200",
                wordClassNames
              )}
            >
              {w.word}
            </span>
            {idx < words.length - 1 && (
              <span className={cn("inline-block w-1", gapClassNames)} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function TranscriptViewerPlayPauseButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isPlaying, play, pause } = useTranscriptViewerContext();

  return (
    <button
      onClick={isPlaying ? pause : play}
      className={cn(
        "h-11 px-4 border border-zinc-700/60 dark:border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 active:scale-[0.98] transition-all text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-inner shrink-0",
        props.className
      )}
      {...props}
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
  );
}

export interface TranscriptViewerScrubBarProps extends React.HTMLAttributes<HTMLDivElement> {
  showTimeLabels?: boolean;
  labelsClassName?: string;
  trackClassName?: string;
  progressClassName?: string;
  thumbClassName?: string;
}

export function TranscriptViewerScrubBar({
  showTimeLabels = true,
  labelsClassName,
  trackClassName,
  progressClassName,
  thumbClassName,
  className,
  ...props
}: TranscriptViewerScrubBarProps) {
  const { currentTime, duration, seekToTime } = useTranscriptViewerContext();
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressBarRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    seekToTime(percentage * duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("w-full flex flex-col gap-2 justify-center", className)} {...props}>
      <div
        ref={progressBarRef}
        onClick={handleSeek}
        className={cn(
          "w-full h-1.5 bg-zinc-700/80 rounded-full relative cursor-pointer group flex items-center",
          trackClassName
        )}
      >
        {/* Progress Fill */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full bg-white rounded-full pointer-events-none transition-all duration-75",
            progressClassName
          )}
          style={{ width: `${percent}%` }}
        />
        {/* Thumb Knob */}
        <div
          className={cn(
            "absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-75 -translate-x-1/2 pointer-events-none",
            thumbClassName
          )}
          style={{ left: `${percent}%` }}
        />
      </div>

      {showTimeLabels && (
        <div className={cn("flex justify-between items-center text-xs font-semibold text-zinc-500 tabular-nums px-0.5", labelsClassName)}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      )}
    </div>
  );
}
