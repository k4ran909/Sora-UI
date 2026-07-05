"use client";

import React, { useState } from "react";
import { Check, Copy, Eye, Code as CodeIcon } from "lucide-react";

interface ComponentViewerProps {
  code: string;
  usageCode?: string;
  children: React.ReactNode;
}

export function ComponentViewer({ code, usageCode, children }: ComponentViewerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [codeTab, setCodeTab] = useState<"component" | "usage">("component");
  const [copied, setCopied] = useState(false);

  const activeCode = usageCode && codeTab === "usage" ? usageCode : code;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full rounded-xl border border-hairline bg-surface-1 overflow-hidden shadow-sm">
      {/* Header controls */}
      <div className="flex h-12 items-center justify-between border-b border-hairline px-4 bg-surface-2/50">
        <div className="flex items-center gap-1.5 bg-surface-1 p-1 rounded-lg border border-hairline">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "preview"
                ? "bg-primary text-white"
                : "text-ink-subtle hover:text-ink"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "code"
                ? "bg-primary text-white"
                : "text-ink-subtle hover:text-ink"
            }`}
          >
            <CodeIcon className="h-3.5 w-3.5" />
            Code
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tabs for Component vs Usage (only when code tab is active and usageCode exists) */}
          {activeTab === "code" && usageCode && (
            <div className="flex gap-1 bg-surface-2 p-0.5 rounded-md border border-hairline">
              <button
                onClick={() => setCodeTab("component")}
                className={`px-2 py-1 text-[10px] font-semibold rounded transition-all ${
                  codeTab === "component"
                    ? "bg-surface-1 text-ink border border-hairline/40 shadow-sm"
                    : "text-ink-subtle hover:text-ink"
                }`}
              >
                Component
              </button>
              <button
                onClick={() => setCodeTab("usage")}
                className={`px-2 py-1 text-[10px] font-semibold rounded transition-all ${
                  codeTab === "usage"
                    ? "bg-surface-1 text-ink border border-hairline/40 shadow-sm"
                    : "text-ink-subtle hover:text-ink"
                }`}
              >
                Usage
              </button>
            </div>
          )}

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-subtle hover:text-ink bg-surface-1 hover:bg-surface-2 border border-hairline rounded-lg transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-0">
        {activeTab === "preview" ? (
          <div className="relative min-h-[300px] flex items-center justify-center p-12 bg-background bg-grid-pattern overflow-hidden">
            <div className="z-10">{children}</div>
          </div>
        ) : (
          <div className="relative max-h-[500px] overflow-y-auto">
            <pre className="p-6 font-mono text-sm text-ink-muted bg-background overflow-x-auto leading-relaxed select-text">
              <code>{activeCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
