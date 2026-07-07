"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface ManualInstallBlockProps {
  dependencies: string[];
}

type PackageManager = "npm" | "pnpm" | "bun";

export function ManualInstallBlock({ dependencies }: ManualInstallBlockProps) {
  const [copied, setCopied] = useState(false);
  const [manager, setManager] = useState<PackageManager>("npm");
  
  const depsString = dependencies.join(" ");

  const getCommand = () => {
    switch (manager) {
      case "pnpm":
        return `pnpm add ${depsString}`;
      case "bun":
        return `bun add ${depsString}`;
      case "npm":
      default:
        return `npm install ${depsString}`;
    }
  };

  const command = getCommand();

  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 border-b border-hairline/60 pb-1.5">
        {(["npm", "pnpm", "bun"] as PackageManager[]).map((pm) => (
          <button
            key={pm}
            onClick={() => setManager(pm)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer border ${
              manager === pm
                ? "bg-white text-zinc-950 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-50 dark:border-zinc-800 font-bold"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {pm}
          </button>
        ))}
      </div>
      <div className="relative flex items-center justify-between p-4 rounded-xl border border-hairline bg-surface-1 font-mono text-xs group">
        <code className="text-primary select-all pr-10 whitespace-pre-wrap break-all">
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
    </div>
  );
}
