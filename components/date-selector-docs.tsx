"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  title: string;
  code: string;
}

function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

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

const SELECTOR_PROPS = [
  { name: "initialSelectedIndex", type: "number", default: "2", description: "Default active selection index (0-indexed)." },
  { name: "activeColor", type: "string", default: '"#ff3b30"', description: "Date highlight circle background and glow color (hex)." },
  { name: "componentColor", type: "string", default: '"#ededf2"', description: "Outer widget card background color (hex)." },
  { name: "days", type: "DayData[]", default: "DEFAULT_DAYS", description: "Array of 5 DayData structures representing columns." },
  { name: "onChange", type: "(idx: number, day: DayData) => void", default: "—", description: "Fires whenever a day capsule is selected." },
];

const EXAMPLE_BASIC = `import { DateSelector } from "@/components/ui/date-selector";

export default function Demo() {
  return (
    <DateSelector 
      onChange={(idx, day) => console.log("Selected:", day)}
    />
  );
}`;

const EXAMPLE_CUSTOM = `import { DateSelector } from "@/components/ui/date-selector";

const CUSTOM_DAYS = [
  { label: "M", date: 12 },
  { label: "T", date: 13 },
  { label: "W", date: 14 },
  { label: "T", date: 15 },
  { label: "F", date: 16 }
];

export default function App() {
  return (
    <DateSelector
      days={CUSTOM_DAYS}
      initialSelectedIndex={0}
      activeColor="#34c759" // Green theme
      componentColor="#f2f2f7" // Light gray card
      onChange={(idx, day) => console.log("Selected custom:", day)}
    />
  );
}`;

export function DateSelectorDocs() {
  return (
    <div className="space-y-16 font-sans">
      {/* ─── Section 1: API Reference ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">API Reference</h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Detailed customization details for the Date Selector widget. Style selections, background frames, and capture click callbacks.
        </p>

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
              {SELECTOR_PROPS.map((prop, i) => (
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
      </section>

      {/* ─── Section 2: Code Examples ─── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Basic Setup</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Default selector displaying dates from Thursday 4th to Monday 8th.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_BASIC} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Custom Theme & Dates</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Displays custom days (M-F) with green highlight circles and a light gray background.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_CUSTOM} />
          </div>
        </div>
      </section>
    </div>
  );
}
