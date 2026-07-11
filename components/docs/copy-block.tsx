"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyBlockProps {
  /** The raw text that gets copied to the clipboard. */
  code: string;
  /** Optional label shown in the block header (e.g. a filename). */
  label?: string;
  /** Optional custom rendering of the code (defaults to plain text). */
  children?: React.ReactNode;
  className?: string;
}

export function CopyBlock({ code, label, children, className }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — fail silently */
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-hairline bg-surface-1",
        className,
      )}
    >
      {label && (
        <div className="flex items-center justify-between border-b border-hairline/70 bg-surface-2/50 px-4 py-2">
          <span className="font-mono text-[11px] text-ink-subtle">{label}</span>
        </div>
      )}
      <button
        onClick={copy}
        title="Copy to clipboard"
        className="absolute right-3 top-3 z-10 rounded-lg border border-hairline bg-surface-2 p-1.5 text-ink-subtle opacity-0 transition-all hover:bg-surface-3 hover:text-ink focus:opacity-100 group-hover:opacity-100"
        style={label ? { top: "3rem" } : undefined}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed text-ink-muted">
        {children ?? code}
      </pre>
    </div>
  );
}
