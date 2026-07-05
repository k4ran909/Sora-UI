"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CLIInstallBlockProps {
  slug: string;
}

export function CLIInstallBlock({ slug }: CLIInstallBlockProps) {
  const [copied, setCopied] = useState(false);
  const command = `npx soraui-cli add ${slug}`;

  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center justify-between p-4 rounded-xl border border-hairline bg-surface-1 font-mono text-xs group">
      <code className="text-primary select-all truncate pr-10">
        {command}
      </code>
      <button
        onClick={copy}
        className="absolute right-3 p-1.5 rounded-lg border border-hairline bg-surface-2 text-ink-subtle hover:text-ink hover:bg-surface-3 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy install command"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
