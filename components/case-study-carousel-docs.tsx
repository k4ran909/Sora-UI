"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  title: string;
  code: string;
}

function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-hairline">
        <span className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">{title}</span>
        <button
          onClick={copy}
          className="p-1.5 rounded hover:bg-surface-3 text-ink-subtle hover:text-ink transition-all cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="p-4 font-mono text-xs text-ink-muted bg-background overflow-x-auto leading-relaxed select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const CAROUSEL_PROPS = [
  { name: "slides", type: "CaseStudySlide[]", default: "DEFAULT_CASE_STUDIES", description: "Array of case study slide items (title, description, visual, stats, logo, readMoreLink)." },
  { name: "autoPlay", type: "boolean", default: "false", description: "Enables automatic slide cycling." },
  { name: "autoPlayInterval", type: "number", default: "6000", description: "Delay between slide transitions in milliseconds (when autoPlay is true)." },
  { name: "className", type: "string", default: "—", description: "Custom classes applied to the outer carousel wrapper." },
  { name: "cardClassName", type: "string", default: "—", description: "Custom classes applied to each slide card." },
];

const SLIDE_SCHEMA_PROPS = [
  { name: "id", type: "string | number", default: "required", description: "Unique identifier for the slide item." },
  { name: "companyName", type: "string", default: "—", description: "Company or project name." },
  { name: "logo", type: "ReactNode", default: "—", description: "Custom React node for the company logo badge." },
  { name: "title", type: "string", default: "required", description: "Main case study heading / headline." },
  { name: "description", type: "string", default: "required", description: "Detailed narrative text / summary." },
  { name: "readMoreLink", type: "string", default: "—", description: "URL destination for the Read More button." },
  { name: "onReadMore", type: "() => void", default: "—", description: "Click callback for custom modal/drawer triggers." },
  { name: "stats", type: "CaseStudyStat[]", default: "—", description: "Array of impact metrics ({ value, label })." },
  { name: "visual", type: "ReactNode", default: "<LiquidDropletGraphic />", description: "Visual node inside the left 3D squircle box." },
  { name: "visualBg", type: "string", default: "bg-zinc-950", description: "Tailwind background classes for the visual squircle." },
];

const EXAMPLE_BASIC = `import { CaseStudyCarousel } from "@/components/case-study-carousel";

export default function Demo() {
  return (
    <div className="py-12">
      <CaseStudyCarousel />
    </div>
  );
}`;

const EXAMPLE_CUSTOM_SLIDES = `import { CaseStudyCarousel, type CaseStudySlide } from "@/components/case-study-carousel";

const customSlides: CaseStudySlide[] = [
  {
    id: 1,
    companyName: "ACME CORP",
    title: "Enterprise Design System Migration",
    description: "Unified 42 distinct product teams into a single Tailwind CSS token system.",
    readMoreLink: "/case-studies/acme",
    stats: [
      { value: "4.8x", label: "Dev Velocity" },
      { value: "-45%", label: "CSS Bundle" },
      { value: "100%", label: "Tokens Synced" }
    ]
  },
  {
    id: 2,
    companyName: "NEBULA",
    title: "Autonomous Agent Workflow Orchestration",
    description: "Accelerated support ticket resolution with zero downtime deployment pipelines.",
    readMoreLink: "/case-studies/nebula",
    stats: [
      { value: "<200ms", label: "Response" },
      { value: "99.9%", label: "Success Rate" },
      { value: "12M+", label: "Tasks Run" }
    ]
  }
];

export default function CustomDemo() {
  return (
    <CaseStudyCarousel 
      slides={customSlides}
      autoPlay={true}
      autoPlayInterval={5000}
    />
  );
}`;

export function CaseStudyCarouselDocs() {
  return (
    <div className="space-y-16 font-sans">
      {/* ─── Section 1: API Reference ─── */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">API Reference</h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Complete properties reference for the Case Study Carousel. Supports custom 3D visuals, responsive drag physics, metrics grids, and keyboard accessibility.
        </p>

        {/* Carousel Props */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <code className="text-primary font-mono bg-primary/8 px-1.5 py-0.5 rounded text-xs">CaseStudyCarousel</code> Props
          </h3>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-2/60 border-b border-hairline">
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Prop</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Default</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {CAROUSEL_PROPS.map((prop, i) => (
                  <tr
                    key={prop.name}
                    className={`border-b border-hairline/50 ${
                      i % 2 === 0 ? "bg-surface-1/40" : "bg-transparent"
                    } hover:bg-surface-2/30 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <code className="text-primary text-xs font-mono bg-primary/8 px-1.5 py-0.5 rounded">{prop.name}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-ink-subtle text-xs font-mono">{prop.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-ink-subtle text-xs font-mono">{prop.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted leading-relaxed max-w-md">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slide Schema */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <code className="text-primary font-mono bg-primary/8 px-1.5 py-0.5 rounded text-xs">CaseStudySlide</code> Object Schema
          </h3>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-2/60 border-b border-hairline">
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Property</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Default</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {SLIDE_SCHEMA_PROPS.map((prop, i) => (
                  <tr
                    key={prop.name}
                    className={`border-b border-hairline/50 ${
                      i % 2 === 0 ? "bg-surface-1/40" : "bg-transparent"
                    } hover:bg-surface-2/30 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <code className="text-primary text-xs font-mono bg-primary/8 px-1.5 py-0.5 rounded">{prop.name}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-ink-subtle text-xs font-mono">{prop.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-ink-subtle text-xs font-mono">{prop.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted leading-relaxed max-w-md">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Code Examples ─── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Standard Carousel</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Default carousel rendering 3D liquid droplet visuals, company tags, impact metrics, and responsive depth cards.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_BASIC} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Custom Slides & Autoplay</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Pass your own custom case studies with custom metrics and continuous autoplay transitions.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_CUSTOM_SLIDES} />
          </div>
        </div>
      </section>
    </div>
  );
}
