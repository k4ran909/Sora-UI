import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Copy,
  Palette,
  Moon,
  Terminal,
  MousePointerClick,
  PenLine,
  Music,
  Disc,
  Activity,
  Calendar,
  Globe,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import { registry } from "@/registry";
import { CopyBlock } from "@/components/docs/copy-block";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Copy,
    title: "Copy, don't install",
    description:
      "No npm package, no version lock-in. The source lands directly in your project and belongs to you.",
  },
  {
    icon: Palette,
    title: "100% yours to restyle",
    description:
      "Tweak colors, rewrite animations, change the logic. Every line is editable Tailwind + React.",
  },
  {
    icon: Sparkles,
    title: "Genuinely interactive",
    description:
      "Skeuomorphic players, voice visualizers, and 3D scenes — built with Framer Motion and Three.js.",
  },
  {
    icon: Moon,
    title: "Dark-mode native",
    description:
      "Designed against a Linear-inspired dark aesthetic first, with clean light-mode support.",
  },
];

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MousePointerClick,
    title: "Pick a component",
    description: "Browse the collection and open the one you need.",
  },
  {
    icon: Copy,
    title: "Copy the source",
    description: "Grab the code, or run the CLI to drop it in automatically.",
  },
  {
    icon: PenLine,
    title: "Make it yours",
    description: "Restyle, extend, and ship it as part of your own codebase.",
  },
];

const componentIcons: Record<string, LucideIcon> = {
  "music-player": Music,
  "dark-player": Disc,
  "bar-visualizer": Activity,
  "date-selector": Calendar,
  "dust-sphere": Globe,
  "transcript-viewer": MessageSquareText,
};

const CN_SNIPPET = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

export default function DocsPage() {
  const components = Object.values(registry);

  return (
    <div className="space-y-16">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden">
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-xs font-medium text-ink-subtle">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Getting Started
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-[-1.5px] text-ink sm:text-5xl">
          Build interfaces with texture
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Sora UI is a collection of beautiful, highly-interactive, and custom
          animated components for React — built with Tailwind CSS, Framer
          Motion, and Three.js. Copy them in, own them forever.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/docs/music-player"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover"
          >
            Explore components
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com/k4ran909/Sora-UI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface-1 px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-surface-2"
          >
            View on GitHub
          </a>
        </div>
      </header>

      {/* ── Feature grid ── */}
      <section className="grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-hairline bg-surface-1 p-5 transition-colors hover:border-hairline-strong"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-primary transition-colors group-hover:border-primary/40">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-[-0.3px] text-ink">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-subtle">
              {description}
            </p>
          </div>
        ))}
      </section>

      {/* ── How it works ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.6px] text-ink">
            How it works
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-subtle">
            Sora UI is a{" "}
            <strong className="font-semibold text-ink">
              copy-paste component collection
            </strong>{" "}
            — not a dependency. That means total design ownership, with nothing
            hidden inside a black-box package.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              className="relative rounded-2xl border border-hairline bg-surface-1 p-5"
            >
              <span className="absolute right-4 top-4 font-mono text-xs text-ink-tertiary">
                0{i + 1}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-subtle">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── cn utility setup ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-[-0.6px] text-ink">
            One-time setup
          </h2>
        </div>
        <p className="max-w-2xl leading-relaxed text-ink-subtle">
          Components share a small <code className="rounded border border-hairline bg-surface-1 px-1.5 py-0.5 font-mono text-[13px] text-primary">cn()</code>{" "}
          helper for merging Tailwind classes. Add it once at{" "}
          <code className="rounded border border-hairline bg-surface-1 px-1.5 py-0.5 font-mono text-[13px] text-primary">lib/utils.ts</code>
          :
        </p>
        <CopyBlock code={CN_SNIPPET} label="lib/utils.ts" />
      </section>

      {/* ── Component gallery ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.6px] text-ink">
            Browse the collection
          </h2>
          <p className="mt-2 leading-relaxed text-ink-subtle">
            {components.length} components and counting — each with a live
            preview, source, and props reference.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {components.map((component) => {
            const Icon = componentIcons[component.slug] ?? Sparkles;
            return (
              <Link
                key={component.slug}
                href={`/docs/${component.slug}`}
                className="group flex gap-4 rounded-2xl border border-hairline bg-surface-1 p-5 transition-all hover:border-hairline-strong hover:bg-surface-2"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-surface-2 text-primary transition-colors group-hover:border-primary/40">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    {component.category}
                  </div>
                  <h3 className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
                    {component.name}
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-subtle">
                    {component.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Next step ── */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-hairline bg-gradient-to-br from-surface-1 to-surface-2 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.4px] text-ink">
            Ready to dive in?
          </h3>
          <p className="mt-1 text-sm text-ink-subtle">
            Start with the skeuomorphic music player — our flagship component.
          </p>
        </div>
        <Link
          href="/docs/music-player"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover"
        >
          Music Player
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
