import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-[-1px] text-ink sm:text-5xl">
          Introduction
        </h1>
        <p className="mt-4 text-lg text-ink-muted leading-relaxed">
          Welcome to Sora UI. A collection of beautiful, highly-interactive, and custom animated components built with React, Tailwind CSS, and Framer Motion.
        </p>
      </div>

      <div className="border-t border-hairline pt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.6px]">How it works</h2>
        <p className="text-ink-subtle leading-relaxed">
          Sora UI is a <strong className="font-semibold text-ink">copy-paste component collection</strong>. Instead of installing it as an npm package dependency, you choose the component you need, copy its source code, and drop it straight into your project.
        </p>
        <p className="text-ink-subtle leading-relaxed">
          This gives you 100% design ownership over the component. You can tweak its colors, change animations, and rewrite logic to fit your specific needs.
        </p>
      </div>

      <div className="border-t border-hairline pt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.6px]">Prerequisites</h2>
        <p className="text-ink-subtle leading-relaxed">
          Ensure you have the following dependencies installed in your React/Tailwind/TypeScript project:
        </p>
        
        <div className="rounded-lg border border-hairline bg-surface-1 p-5 font-mono text-sm text-primary">
          npm install framer-motion lucide-react clsx tailwind-merge
        </div>
      </div>

      <div className="border-t border-hairline pt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-ink tracking-[-0.6px]">Setup dynamic class utility</h2>
        <p className="text-ink-subtle leading-relaxed">
          Create a file named <code className="text-primary font-mono bg-surface-1 px-1.5 py-0.5 rounded border border-hairline">lib/utils.ts</code> (or similar) to handle dynamic Tailwind CSS class merging:
        </p>
        
        <pre className="rounded-lg border border-hairline bg-surface-1 p-5 font-mono text-sm text-ink-muted overflow-x-auto">
{`import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
        </pre>
      </div>

      <div className="border-t border-hairline pt-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink tracking-[-0.4px]">Next Step</h3>
          <p className="text-sm text-ink-subtle">Check out the music player component.</p>
        </div>
        <Link
          href="/docs/music-player"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
        >
          Music Player
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
