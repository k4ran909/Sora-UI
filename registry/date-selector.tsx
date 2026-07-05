"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DayData {
  label: string; // Weekday short label (e.g., "T", "W")
  date: number;  // Day number (e.g., 4, 5, 6)
}

const DEFAULT_DAYS: DayData[] = [
  { label: "T", date: 4 },
  { label: "W", date: 5 },
  { label: "T", date: 6 },
  { label: "F", date: 7 },
  { label: "S", date: 8 },
];

export interface DateSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Initial active index (0 to 4). Default: 2.
   */
  initialSelectedIndex?: number;

  /**
   * Active selection indicator circle background (hex). Default: "#ff3b30" (iOS Red).
   */
  activeColor?: string;

  /**
   * Background color of the selector widget card (hex). Default: "#ededf2" (Slate Grey).
   */
  componentColor?: string;

  /**
   * Array of 5 days to display. Defaults to Thursday 4 to Saturday 8.
   */
  days?: DayData[];

  /**
   * Callback fired when a day is selected.
   */
  onChange?: (index: number, day: DayData) => void;
}

export function DateSelector({
  initialSelectedIndex = 2,
  activeColor = "#ff3b30",
  componentColor = "#ededf2",
  days = DEFAULT_DAYS,
  onChange,
  className,
  ...props
}: DateSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(initialSelectedIndex);

  useEffect(() => {
    setActiveIndex(initialSelectedIndex);
  }, [initialSelectedIndex]);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    if (onChange) {
      onChange(idx, days[idx]);
    }
  };

  // Calculates the horizontal percentage center for the pointer (e.g. index 2 is centered at 50%)
  const pointerLeftPos = `${(activeIndex + 0.5) * 20}%`;

  return (
    <div className="relative font-sans select-none">
      {/* Self-contained style to handle red glowing circle shadows dynamically */}
      <style>{`
        .sora-date-active-circle {
          box-shadow: 
            0 6px 15px var(--active-glow-color-35),
            0 2px 6px var(--active-glow-color-15);
        }
      `}</style>

      {/* Main Selector Card Widget */}
      <div
        style={{ 
          backgroundColor: componentColor,
          // Convert activeColor to RGBA variables for shadows
          ["--active-glow-color-35" as any]: `${activeColor}59`,
          ["--active-glow-color-15" as any]: `${activeColor}26`,
        }}
        className={cn(
          "relative w-[460px] h-[190px] rounded-[36px] px-6 py-4 flex flex-col justify-end box-border border border-white/40 dark:border-white/5 shadow-[0_15px_35px_rgba(0,0,0,0.04),0_4px_10px_rgba(0,0,0,0.02)]",
          className
        )}
        {...props}
      >
        {/* Floating Indicator Triangle Pointer */}
        <div
          style={{ left: pointerLeftPos }}
          className="absolute top-2.5 -translate-x-1/2 text-[11px] text-zinc-900 dark:text-zinc-100 pointer-events-none transition-[left] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-20"
        >
          ▼
        </div>

        {/* Weekday Header Labels Row */}
        <div className="grid grid-cols-5 w-full mb-2 z-5">
          {days.map((day, idx) => (
            <span
              key={idx}
              className="text-xs font-extrabold text-zinc-400 text-center tracking-tight"
            >
              {day.label}
            </span>
          ))}
        </div>

        {/* Capsules Flex Row */}
        <div className="grid grid-cols-5 w-full items-end h-[118px]">
          {days.map((day, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const isFuture = idx > activeIndex;

            return (
              <div key={idx} className="flex justify-center items-end h-full">
                <button
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    "w-16 rounded-[32px] flex flex-col items-center justify-start pt-2 box-border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] outline-hidden cursor-pointer",
                    // Inactive Past State (faded grey)
                    isPast && "h-[94px] bg-zinc-200 dark:bg-zinc-800 opacity-60 hover:opacity-85 border border-zinc-300/30",
                    // Inactive Future State (white raised)
                    isFuture && "h-[94px] bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 shadow-[0_4px_10px_rgba(0,0,0,0.015)] hover:bg-zinc-50 dark:hover:bg-zinc-850",
                    // Active Selected State (extended card height)
                    isActive && "h-[116px] bg-white dark:bg-zinc-900 shadow-[0_12px_28px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.02)] border border-zinc-250 dark:border-zinc-800 z-10 scale-100"
                  )}
                >
                  {/* Number Circle inside capsule */}
                  <div
                    style={{ 
                      backgroundColor: isActive ? activeColor : "transparent",
                      borderColor: isActive ? activeColor : undefined
                    }}
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-bold transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                      // Inactive circle styles
                      isPast && "border border-zinc-350 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400",
                      isFuture && "border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400",
                      // Active circle style
                      isActive && "sora-date-active-circle text-white border-1.5"
                    )}
                  >
                    {day.date}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
