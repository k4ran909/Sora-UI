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

const VISUALIZER_PROPS = [
  { name: "state", type: "AgentState", default: "—", description: "Voice assistant state: 'connecting' | 'initializing' | 'listening' | 'speaking' | 'thinking'" },
  { name: "barCount", type: "number", default: "15", description: "Number of visualizer frequency bars to display." },
  { name: "mediaStream", type: "MediaStream", default: "—", description: "Real-time HTML5 MediaStream microphone/audio source to analyze." },
  { name: "minHeight", type: "number", default: "20", description: "Minimum bar height percentage (0 to 100)." },
  { name: "maxHeight", type: "number", default: "100", description: "Maximum bar height percentage (0 to 100)." },
  { name: "demo", type: "boolean", default: "false", description: "Force demo simulation mode bypassing audio context." },
  { name: "centerAlign", type: "boolean", default: "false", description: "Align visualizer bars from center line rather than bottom." },
];

const EXAMPLE_BASIC = `import { BarVisualizer } from "@/components/ui/bar-visualizer";

export default function Demo() {
  return (
    <BarVisualizer 
      state="listening" 
      barCount={15} 
      demo={true} 
    />
  );
}`;

const EXAMPLE_CENTERED = `import { BarVisualizer } from "@/components/ui/bar-visualizer";

export default function App() {
  return (
    <BarVisualizer 
      state="speaking" 
      barCount={20} 
      centerAlign={true} 
      demo={true} 
    />
  );
}`;

export function BarVisualizerDocs() {
  return (
    <div className="space-y-16 font-sans">
      {/* ─── Section 1: API Reference ─── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">API Reference</h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Complete properties reference for the Bar Visualizer. Customize state visual themes, vertical alignments, bar counts, and heights.
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
              {VISUALIZER_PROPS.map((prop, i) => (
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
            <h3 className="text-sm font-semibold text-ink">Bottom-Aligned Demo</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Standard bottom-aligned visualizer with demo data.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_BASIC} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Centered-Aligned Demo</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Center-aligned growing visualizer, styled with orange-to-amber speaking gradient.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_CENTERED} />
          </div>
        </div>
      </section>
    </div>
  );
}
