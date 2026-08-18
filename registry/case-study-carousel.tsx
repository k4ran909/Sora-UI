"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TYPES & INTERFACES ───

export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudySlide {
  id: string | number;
  companyName?: string;
  logo?: React.ReactNode;
  title: string;
  description: string;
  readMoreLink?: string;
  onReadMore?: () => void;
  stats?: CaseStudyStat[];
  visual?: React.ReactNode;
  visualBg?: string;
}

export interface CaseStudyCarouselProps {
  slides?: CaseStudySlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  cardClassName?: string;
}

// ─── DEFAULT LIQUID SPLASH 3D SVG GRAPHIC ───

export function LiquidDropletGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full object-contain select-none pointer-events-none p-4", className)}
    >
      <defs>
        <radialGradient id="liquidBaseGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#27272a" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#09090b" stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="1" />
        </radialGradient>

        <linearGradient id="glossTop" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#a1a1aa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="dropletHighlight" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#71717a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>

        <filter id="liquidShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
          <feOffset dx="0" dy="14" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient shadow floor */}
      <ellipse cx="200" cy="300" rx="100" ry="24" fill="#000000" opacity="0.65" filter="blur(16px)" />

      {/* Main Liquid Splash Body */}
      <g filter="url(#liquidShadow)">
        {/* Splash Cone */}
        <path
          d="M 115 285 C 130 275 168 262 190 200 C 195 185 197 165 200 150 C 203 165 205 185 210 200 C 232 262 270 275 285 285 C 295 292 270 300 200 300 C 130 300 105 292 115 285 Z"
          fill="url(#liquidBaseGlow)"
        />

        {/* Specular Rim Highlight */}
        <path
          d="M 125 282 C 140 272 172 260 192 205 C 196 190 198 170 200 155 C 202 170 204 190 208 205 C 228 260 260 272 275 282 C 245 292 155 292 125 282 Z"
          fill="none"
          stroke="url(#glossTop)"
          strokeWidth="2.5"
          opacity="0.8"
        />

        {/* Liquid Surface Rim Base */}
        <ellipse cx="200" cy="282" rx="76" ry="14" fill="#18181b" />
        <ellipse cx="200" cy="280" rx="70" ry="11" fill="#09090b" />
        <ellipse cx="200" cy="278" rx="55" ry="7" fill="#27272a" opacity="0.5" />

        {/* Center Peak Highlight */}
        <path
          d="M 197 150 C 197 145 199 142 200 142 C 201 142 203 145 203 150 C 203 155 197 155 197 150 Z"
          fill="#ffffff"
        />

        {/* Suspended Airborne Droplet */}
        <g transform="translate(200, 115)">
          <path
            d="M 0 -14 C 6 -6 8 2 8 6 C 8 11 4 14 0 14 C -4 14 -8 11 -8 6 C -8 2 -6 -6 0 -14 Z"
            fill="url(#dropletHighlight)"
          />
          <ellipse cx="-2.5" cy="2" rx="2" ry="4" fill="#ffffff" opacity="0.9" />
        </g>
      </g>
    </svg>
  );
}

// ─── DEFAULT DEMO DATA ───

export const DEFAULT_CASE_STUDIES: CaseStudySlide[] = [
  {
    id: 1,
    companyName: "LEPSM",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-6 w-6 rounded bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-black text-xs">
          ▲
        </div>
        <span className="font-bold tracking-wider text-sm text-zinc-900 dark:text-zinc-100">LEPSM</span>
      </div>
    ),
    title: "AI Workflow Automation for SaaS Company",
    description: "We analyze your workflows, bottlenecks, and revenue opportunities to streamline customer onboarding.",
    readMoreLink: "#",
    stats: [
      { value: "+40%", label: "Demo Booking" },
      { value: "+25%", label: "Closing Rate" },
      { value: "3x", label: "Engagement" },
    ],
    visual: <LiquidDropletGraphic />,
    visualBg: "bg-gradient-to-b from-zinc-800 to-zinc-950",
  },
  {
    id: 2,
    companyName: "VOICEFLOW",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white font-bold text-xs">
          V
        </div>
        <span className="font-bold tracking-wider text-sm text-zinc-900 dark:text-zinc-100">VOICEFLOW</span>
      </div>
    ),
    title: "Conversational Voice Agents for Global Teams",
    description: "Scaled customer support automation to over 2M+ inquiries with zero latency degradation.",
    readMoreLink: "#",
    stats: [
      { value: "99.8%", label: "Accuracy" },
      { value: "4.2x", label: "Resolution Speed" },
      { value: "-60%", label: "Support Cost" },
    ],
    visual: (
      <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
        <div className="w-28 h-28 rounded-full bg-blue-500/20 blur-2xl absolute" />
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-blue-500/30 flex items-center justify-center shadow-2xl relative z-10">
          <div className="flex items-end gap-1.5 h-8">
            <span className="w-1.5 h-6 bg-blue-400 rounded-full animate-pulse" />
            <span className="w-1.5 h-8 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            <span className="w-1.5 h-7 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
          </div>
        </div>
      </div>
    ),
    visualBg: "bg-gradient-to-b from-zinc-900 to-zinc-950",
  },
  {
    id: 3,
    companyName: "NEXUS AI",
    logo: (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-6 w-6 rounded bg-emerald-600 text-white font-bold text-xs">
          N
        </div>
        <span className="font-bold tracking-wider text-sm text-zinc-900 dark:text-zinc-100">NEXUS AI</span>
      </div>
    ),
    title: "Predictive Analytics Infrastructure for Fintech",
    description: "Instant transaction risk scoring handling billions in volume without manual intervention.",
    readMoreLink: "#",
    stats: [
      { value: "$120M+", label: "Fraud Prevented" },
      { value: "<15ms", label: "Latency" },
      { value: "99.99%", label: "Uptime" },
    ],
    visual: (
      <div className="w-full h-full flex items-center justify-center relative p-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-teal-900/40 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
            99%
          </div>
        </div>
      </div>
    ),
    visualBg: "bg-gradient-to-b from-zinc-900 to-zinc-950",
  },
];

// ─── MAIN CAROUSEL COMPONENT ───

export function CaseStudyCarousel({
  slides = DEFAULT_CASE_STUDIES,
  autoPlay = false,
  autoPlayInterval = 6000,
  className,
  cardClassName,
}: CaseStudyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay handler
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  const getSlidePosition = (index: number) => {
    const total = slides.length;
    let diff = (index - currentIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;
    return diff;
  };

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto py-6 px-2 sm:px-4 select-none", className)}>
      {/* ── Stacked Viewport ── */}
      <div className="relative w-full min-h-[460px] sm:min-h-[380px] md:min-h-[360px] flex items-center justify-center overflow-hidden">
        {slides.map((slide, index) => {
          const position = getSlidePosition(index);
          const isActive = position === 0;
          const isVisible = Math.abs(position) <= 1;

          if (!isVisible) return null;

          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{
                x: `${position * 62}%`,
                scale: isActive ? 1 : 0.86,
                opacity: isActive ? 1 : 0.35,
                zIndex: isActive ? 20 : 10,
                rotateY: position * -6,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) nextSlide();
                if (info.offset.x > 50) prevSlide();
              }}
              className={cn(
                "absolute w-[90%] sm:w-[86%] md:w-[700px] lg:w-[740px] shrink-0 rounded-[32px] sm:rounded-[40px] p-4 sm:p-6 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-grab active:cursor-grabbing",
                cardClassName
              )}
            >
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 h-full">
                {/* ── Left Visual Box (3D Squircle) ── */}
                <div
                  className={cn(
                    "w-full sm:w-[240px] md:w-[260px] h-[190px] sm:h-[260px] md:h-[280px] shrink-0 rounded-[24px] sm:rounded-[32px] relative overflow-hidden flex items-center justify-center border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.35)]",
                    slide.visualBg || "bg-zinc-950"
                  )}
                >
                  {slide.visual || <LiquidDropletGraphic />}
                </div>

                {/* ── Right Content Area ── */}
                <div className="flex-1 flex flex-col justify-between h-full py-1 min-w-0 w-full">
                  {/* Top Header & Copy */}
                  <div className="space-y-2.5">
                    {slide.logo || (
                      <span className="font-bold tracking-wider text-xs uppercase text-zinc-400">
                        {slide.companyName}
                      </span>
                    )}

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
                      {slide.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {slide.description}
                    </p>

                    {slide.readMoreLink && (
                      <a
                        href={slide.readMoreLink}
                        onClick={(e) => {
                          if (slide.onReadMore) {
                            e.preventDefault();
                            slide.onReadMore();
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors group/link pt-0.5"
                      >
                        <span>Read More</span>
                        <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center transition-transform group-hover/link:translate-x-0.5">
                          <ArrowRight className="h-2.5 w-2.5" />
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Bottom Metrics / Stats */}
                  {slide.stats && slide.stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-4 sm:pt-5 border-t border-zinc-100 dark:border-zinc-900 mt-4 sm:mt-0">
                      {slide.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {stat.value}
                          </span>
                          <span className="text-[10px] sm:text-xs text-zinc-400 font-medium whitespace-nowrap">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ── Navigation Overlays ── */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-1 sm:left-3 md:left-6 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-1 sm:right-3 md:right-6 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* ── Bottom Pill Pagination ── */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {slides.map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                isActive
                  ? "w-7 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  : "w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
