"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Code, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col justify-between">
      {/* Floating navigation header */}
      <header className="w-full h-16 flex items-center justify-between px-6 md:px-12 border-b border-hairline bg-background/50 backdrop-blur-md z-20">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-wider text-ink">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
          <span>Sora UI</span>
        </Link>
        <Link
          href="/docs"
          className="text-sm font-medium text-ink-subtle hover:text-ink transition-colors"
        >
          Documentation
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium tracking-wide">
            <Sparkles className="h-3 w-3" />
            Introducing Sora UI Components
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold tracking-[-2px] text-ink leading-tight">
            Make your websites <br />
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              feel magical
            </span>
          </h1>

          <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed tracking-[-0.2px]">
            Beautiful, premium animated components ready to be copied and pasted directly into your React applications. Built with Tailwind CSS and Framer Motion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/docs"
              className="group flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-8 py-3 text-sm font-medium text-white transition-all shadow-sm"
            >
              Explore Components
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/docs/music-player"
              className="flex items-center gap-2 rounded-lg border border-hairline bg-surface-1 hover:bg-surface-2 text-ink hover:border-hairline-strong px-8 py-3 text-sm font-medium transition-all"
            >
              View Music Player
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 w-full"
        >
          {/* Card 1 */}
          <div className="linear-card linear-card-hover p-6 rounded-xl text-left space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-ink tracking-[-0.4px]">Copy & Paste</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">
              No npm install required. Grab the source code, drop it into your codebase, and make it your own.
            </p>
          </div>

          {/* Card 2 */}
          <div className="linear-card linear-card-hover p-6 rounded-xl text-left space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-ink tracking-[-0.4px]">Fluid Animations</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">
              Pre-built high-fidelity motion states designed with Framer Motion that react to mouse hover, click, and scroll.
            </p>
          </div>

          {/* Card 3 */}
          <div className="linear-card linear-card-hover p-6 rounded-xl text-left space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-ink tracking-[-0.4px]">Highly Customizable</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">
              Since you copy the code, you have full control over the markup, styles, and timing variables.
            </p>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-hairline bg-background text-xs text-ink-subtle z-10">
        © {new Date().getFullYear()} Sora UI. Designed for creators.
      </footer>
    </div>
  );
}
