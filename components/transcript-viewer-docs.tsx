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

const CONTAINER_PROPS = [
  { name: "audioSrc", type: "string", default: "—", description: "Optional URL to an audio file. If omitted, uses Web Speech API or simulated timeline." },
  { name: "alignment", type: "CharacterAlignmentResponseModel", default: "MOCK_ALIGNMENT", description: "Optional custom alignment model containing character timings." },
  { name: "componentColor", type: "string", default: '"var(--card)"', description: "Container card background color." },
];

const WORDS_PROPS = [
  { name: "highlightBg", type: "string", default: '"var(--primary)"', description: "Background highlight color for the currently spoken word." },
  { name: "highlightText", type: "string", default: '"var(--primary-foreground)"', description: "Text color for the currently active word." },
  { name: "wordClassNames", type: "string", default: "—", description: "Additional CSS classes applied to individual word spans." },
  { name: "gapClassNames", type: "string", default: "—", description: "Additional CSS classes applied to word gaps." },
  { name: "renderWord", type: "(props: { word, status }) => ReactNode", default: "—", description: "Custom render function for word elements." },
];

const SCRUBBAR_PROPS = [
  { name: "showTimeLabels", type: "boolean", default: "true", description: "Whether to render current time and duration labels." },
  { name: "trackClassName", type: "string", default: "—", description: "Custom classes for the track background bar." },
  { name: "progressClassName", type: "string", default: "—", description: "Custom classes for the active progress fill." },
  { name: "thumbClassName", type: "string", default: "—", description: "Custom classes for the draggable scrubber thumb." },
];

const EXAMPLE_COMPOUND = `import {
  TranscriptViewerContainer,
  TranscriptViewerAudio,
  TranscriptViewerWords,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar
} from "@/components/transcript-viewer";

export default function Demo() {
  return (
    <TranscriptViewerContainer>
      <TranscriptViewerAudio />
      <TranscriptViewerWords 
        highlightBg="#ffffff"
        highlightText="#09090b"
      />
      <div className="flex items-center gap-4 w-full">
        <TranscriptViewerPlayPauseButton />
        <TranscriptViewerScrubBar className="flex-1" />
      </div>
    </TranscriptViewerContainer>
  );
}`;

const EXAMPLE_CUSTOM_ALIGNMENT = `import {
  TranscriptViewerContainer,
  TranscriptViewerAudio,
  TranscriptViewerWords,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar
} from "@/components/transcript-viewer";

const myAlignment = {
  characters: ["H", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"],
  character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2],
};

export default function CustomAlignmentDemo() {
  return (
    <TranscriptViewerContainer 
      alignment={myAlignment}
      audioSrc="/sample/audio.mp3"
    >
      <TranscriptViewerAudio />
      <TranscriptViewerWords />
      <div className="flex items-center gap-4 w-full">
        <TranscriptViewerPlayPauseButton />
        <TranscriptViewerScrubBar className="flex-1" />
      </div>
    </TranscriptViewerContainer>
  );
}`;

export function TranscriptViewerDocs() {
  return (
    <div className="space-y-16 font-sans">
      {/* ─── Section 1: API Reference ─── */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-ink tracking-[-0.5px]">API Reference</h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Transcript Viewer is built as a flexible set of compound components, giving you full control over layout, audio binding, word styling, and controls.
        </p>

        {/* Container Props */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <code className="text-primary font-mono bg-primary/8 px-1.5 py-0.5 rounded text-xs">TranscriptViewerContainer</code> Props
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
                {CONTAINER_PROPS.map((prop, i) => (
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

        {/* Words Props */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <code className="text-primary font-mono bg-primary/8 px-1.5 py-0.5 rounded text-xs">TranscriptViewerWords</code> Props
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
                {WORDS_PROPS.map((prop, i) => (
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

        {/* ScrubBar Props */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <code className="text-primary font-mono bg-primary/8 px-1.5 py-0.5 rounded text-xs">TranscriptViewerScrubBar</code> Props
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
                {SCRUBBAR_PROPS.map((prop, i) => (
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
            <h3 className="text-sm font-semibold text-ink">Compound Component Pattern</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Standard setup composing container, words, play/pause trigger, and progress scrub bar.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_COMPOUND} />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Custom Character Alignment</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Pass timestamps matching ElevenLabs or custom speech-to-text API alignment models.
            </p>
            <CodeBlock title="App.tsx" code={EXAMPLE_CUSTOM_ALIGNMENT} />
          </div>
        </div>
      </section>
    </div>
  );
}
