"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Russo_One, Share_Tech } from "next/font/google";
import { Logo } from "@/components/logo";

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
});

const shareTech = Share_Tech({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sora-ui-theme");
    if (saved === "dark") {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem("sora-ui-theme", newVal ? "dark" : "light");
  };

  return (
    <div 
      className="relative min-h-screen w-full select-none flex flex-col justify-between overflow-x-hidden antialiased transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#09090b" : "#ffffff",
        backgroundImage: isDark 
          ? "radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)" 
          : "radial-gradient(#e5e5e7 1.2px, transparent 1.2px)",
        backgroundSize: "20px 20px"
      }}
    >
      {/* ─── NAVIGATION HEADER ─── */}
      <header className={`w-full h-20 flex items-center justify-between px-6 md:px-12 border-b transition-colors duration-300 ${
        isDark ? "border-zinc-900 bg-zinc-950/70" : "border-zinc-100 bg-white/70"
      } backdrop-blur-md z-20`}>
        <Link href="/" className="flex items-center gap-2">
          <Logo className={isDark ? "text-white" : "text-black"} size={32} />
          <span className={`font-bold text-sm tracking-tight transition-colors duration-300 ${
            isDark ? "text-white" : "text-zinc-900"
          }`}>Sora UI</span>
        </Link>

        {/* Center menu links */}
        <nav className="hidden md:flex items-center gap-8">
          {["services", "case-studies", "testimonials", "pricing"].map((link) => (
            <Link
              key={link}
              href={`#${link}`}
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"
              }`}
            >
              {link.replace("-", " ")}
            </Link>
          ))}
        </nav>

        {/* Right CTA button & Theme Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
            }`}
            aria-label="Toggle theme contrast"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-colors duration-200 ${
              isDark ? "text-zinc-450 hover:text-white" : "text-zinc-550 hover:text-black"
            }`}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              {/* Left half filled */}
              <path d="M12 3a9 9 0 0 0 0 18V3z" fill="currentColor" />
              {/* Right half striped */}
              <path d="M12 5l6 6M12 10l7 7M12 15l4 4M15 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link
            href="/docs"
            className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${
              isDark 
                ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white" 
                : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 hover:text-black"
            }`}
          >
            Get In Touch
          </Link>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-4xl"
        >
          {/* Floating Pill rating badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border tracking-tight shadow-xs transition-colors duration-300 ${
            isDark 
              ? "border-zinc-800 bg-zinc-900/60 text-zinc-400" 
              : "border-zinc-200 bg-zinc-50/80 text-zinc-650"
          }`}>
            <span className="text-amber-500 text-sm">✦</span>
            <span className={`font-semibold transition-colors duration-300 ${
              isDark ? "text-zinc-200" : "text-zinc-900"
            }`}>4.99</span>
            <span className="text-zinc-300">•</span>
            <span>106 reviews</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-normal tracking-tight leading-[1.08] max-w-4xl mx-auto transition-colors duration-300">
            <span className={`${shareTech.className} ${isDark ? "text-white" : "text-zinc-950"}`}>
              The Framer partner your
            </span>
            <br />
            <span className={`${russoOne.className} text-orange-500`}>
              team actually needs
            </span>
          </h1>

          {/* Subheading */}
          <p className={`text-sm sm:text-base md:text-[17px] max-w-[560px] mx-auto mt-4 font-normal leading-relaxed transition-colors duration-300 ${
            isDark ? "text-zinc-400" : "text-zinc-500"
          }`}>
            We help design and marketing teams build, launch, and grow Framer sites with solid structure, fast performance, and SEO safety.
          </p>

          {/* Actions */}
          <div className="flex flex-row items-center justify-center gap-3 pt-6">
            <Link
              href="/docs"
              className={`px-7 py-3.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 shadow-sm ${
                isDark 
                  ? "bg-white hover:bg-zinc-100 text-black" 
                  : "bg-black hover:bg-zinc-900 text-white"
              }`}
            >
              Get In Touch
            </Link>
            <Link
              href="/docs"
              className={`px-7 py-3.5 border text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 shadow-xs ${
                isDark 
                  ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-850" 
                  : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              Case Studies
            </Link>
          </div>
        </motion.div>

        {/* Separator / Trust statement */}
        <div className="w-full text-center mt-20">
          <span className={`text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
            isDark ? "text-zinc-600" : "text-zinc-400"
          }`}>
            — Trusted by startups and enterprise teams alike —
          </span>
        </div>
      </main>

      {/* ─── BRAND LOGO PARTNER GRID ─── */}
      <footer className={`w-full border-t z-10 transition-colors duration-300 ${
        isDark ? "border-zinc-900 bg-zinc-950/50" : "border-zinc-200 bg-white/50"
      }`}>
        <div className={`grid grid-cols-2 md:grid-cols-6 border-b divide-x transition-colors duration-300 ${
          isDark 
            ? "divide-zinc-900 border-zinc-900/50" 
            : "divide-zinc-200/80 border-zinc-200/50"
        }`}>
          {/* Logo 1: Vercel */}
          <div className={`flex items-center justify-center py-8 px-6 transition-colors duration-200 ${
            isDark ? "hover:bg-zinc-900/20 text-zinc-400 hover:text-white" : "hover:bg-zinc-50/40 text-zinc-900/90"
          }`}>
            <div className="flex items-center gap-2 font-bold tracking-tight text-[17px]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 22.525H0L12 1.475L24 22.525Z" />
              </svg>
              <span>Vercel</span>
            </div>
          </div>

          {/* Logo 2: Stripe */}
          <div className={`flex items-center justify-center py-8 px-6 transition-colors duration-200 ${
            isDark ? "hover:bg-zinc-900/20 text-zinc-405 hover:text-white" : "hover:bg-zinc-50/40 text-zinc-900/90"
          }`}>
            <div className="flex items-center gap-0.5 font-black tracking-[-0.04em] text-[24px] lowercase italic font-sans">
              stripe
            </div>
          </div>

          {/* Logo 3: Linear */}
          <div className={`flex items-center justify-center py-8 px-6 transition-colors duration-200 ${
            isDark ? "hover:bg-zinc-900/20 text-zinc-400 hover:text-white" : "hover:bg-zinc-50/40 text-zinc-900/90"
          }`}>
            <div className="flex items-center gap-2 font-bold tracking-tight text-[17px]">
              <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
              </svg>
              <span>Linear</span>
            </div>
          </div>

          {/* Logo 4: Notion */}
          <div className={`flex items-center justify-center py-8 px-6 transition-colors duration-200 ${
            isDark ? "hover:bg-zinc-900/20 text-zinc-400 hover:text-white" : "hover:bg-zinc-50/40 text-zinc-900/90"
          }`}>
            <div className="flex items-center gap-2 font-bold tracking-tight text-[17px]">
              <div className={`w-[22px] h-[22px] flex items-center justify-center font-extrabold text-[11px] rounded-[4px] leading-none pt-0.5 ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}>
                N
              </div>
              <span>Notion</span>
            </div>
          </div>

          {/* Logo 5: Raycast */}
          <div className={`flex items-center justify-center py-8 px-6 transition-colors duration-200 ${
            isDark ? "hover:bg-zinc-900/20 text-zinc-400 hover:text-white" : "hover:bg-zinc-50/40 text-zinc-900/90"
          }`}>
            <div className="flex items-center gap-2 font-bold tracking-tight text-[17px]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z" />
              </svg>
              <span>Raycast</span>
            </div>
          </div>

          {/* Logo 6: Mercury */}
          <div className={`flex items-center justify-center py-8 px-6 transition-colors duration-200 ${
            isDark ? "hover:bg-zinc-900/20 text-zinc-400 hover:text-white" : "hover:bg-zinc-50/40 text-zinc-900/90"
          }`}>
            <div className="flex items-center gap-2 font-bold tracking-tight text-[16px] uppercase font-sans">
              <svg className="w-4.5 h-4.5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6V18" strokeLinecap="round" />
                <path d="M6 12H18" strokeLinecap="round" />
              </svg>
              <span>Mercury</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
