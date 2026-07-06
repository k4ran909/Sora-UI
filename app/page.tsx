"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Share_Tech } from "next/font/google";
import { Logo } from "@/components/logo";

const shareTech = Share_Tech({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div 
      className="relative min-h-screen w-full select-none flex flex-col justify-between overflow-x-hidden antialiased"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(#e5e5e7 1.2px, transparent 1.2px)",
        backgroundSize: "20px 20px"
      }}
    >
      {/* ─── NAVIGATION HEADER ─── */}
      <header className="w-full h-20 flex items-center justify-between px-6 md:px-12 border-b border-zinc-100 bg-white/70 backdrop-blur-md z-20">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-black" size={32} />
          <span className="font-bold text-sm tracking-tight text-zinc-900">Sora UI</span>
        </Link>

        {/* Center menu links */}
        <nav className="hidden md:flex items-center gap-8">
          {["services", "case-studies", "testimonials", "pricing"].map((link) => (
            <Link
              key={link}
              href={`#${link}`}
              className="text-[11px] font-bold text-zinc-500 hover:text-black uppercase tracking-wider transition-colors duration-200"
            >
              {link.replace("-", " ")}
            </Link>
          ))}
        </nav>

        {/* Right CTA button */}
        <div>
          <Link
            href="/docs"
            className="px-5 py-2.5 border border-zinc-200 hover:border-zinc-300 text-zinc-800 hover:text-black text-[10px] font-bold uppercase tracking-wider rounded-md bg-white hover:bg-zinc-50 transition-all duration-200"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50/80 text-zinc-650 text-xs font-medium tracking-tight shadow-xs">
            <span className="text-amber-500 text-sm">✦</span>
            <span className="font-semibold text-zinc-900">4.99</span>
            <span className="text-zinc-300">•</span>
            <span>106 reviews</span>
          </div>

          {/* Main Heading */}
          <h1 className={`${shareTech.className} text-4xl sm:text-6xl md:text-[68px] font-normal tracking-tight text-zinc-950 leading-[1.08] max-w-3.5xl mx-auto`}>
            The Framer partner your team actually needs
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-[17px] text-zinc-500 max-w-[560px] mx-auto mt-4 font-normal leading-relaxed">
            We help design and marketing teams build, launch, and grow Framer sites with solid structure, fast performance, and SEO safety.
          </p>

          {/* Actions */}
          <div className="flex flex-row items-center justify-center gap-3 pt-6">
            <Link
              href="/docs"
              className="px-7 py-3.5 bg-black hover:bg-zinc-900 text-white text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 shadow-sm"
            >
              Get In Touch
            </Link>
            <Link
              href="/docs"
              className="px-7 py-3.5 border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 shadow-xs"
            >
              Case Studies
            </Link>
          </div>
        </motion.div>

        {/* Separator / Trust statement */}
        <div className="w-full text-center mt-20">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.18em]">
            — Trusted by startups and enterprise teams alike —
          </span>
        </div>
      </main>

      {/* ─── BRAND LOGO PARTNER GRID ─── */}
      <footer className="w-full border-t border-zinc-200 bg-white/50 backdrop-blur-xs z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-zinc-200/80 border-b border-zinc-200/50">
          {/* Logo 1: Vercel */}
          <div className="flex items-center justify-center py-8 px-6 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center gap-2 text-zinc-900/90 font-bold tracking-tight text-[17px]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 22.525H0L12 1.475L24 22.525Z" />
              </svg>
              <span>Vercel</span>
            </div>
          </div>

          {/* Logo 2: Stripe */}
          <div className="flex items-center justify-center py-8 px-6 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center gap-0.5 text-zinc-900/90 font-black tracking-[-0.04em] text-[24px] lowercase italic font-sans">
              stripe
            </div>
          </div>

          {/* Logo 3: Linear */}
          <div className="flex items-center justify-center py-8 px-6 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center gap-2 text-zinc-900/90 font-bold tracking-tight text-[17px]">
              <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
              </svg>
              <span>Linear</span>
            </div>
          </div>

          {/* Logo 4: Notion */}
          <div className="flex items-center justify-center py-8 px-6 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center gap-2 text-zinc-900/90 font-bold tracking-tight text-[17px]">
              <div className="w-[22px] h-[22px] bg-black text-white flex items-center justify-center font-extrabold text-[11px] rounded-[4px] leading-none pt-0.5">
                N
              </div>
              <span>Notion</span>
            </div>
          </div>

          {/* Logo 5: Raycast */}
          <div className="flex items-center justify-center py-8 px-6 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center gap-2 text-zinc-900/90 font-bold tracking-tight text-[17px]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z" />
              </svg>
              <span>Raycast</span>
            </div>
          </div>

          {/* Logo 6: Mercury */}
          <div className="flex items-center justify-center py-8 px-6 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center gap-2 text-zinc-900/90 font-bold tracking-tight text-[16px] uppercase font-sans">
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
