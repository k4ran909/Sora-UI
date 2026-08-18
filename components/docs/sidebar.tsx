"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { registry } from "@/registry";
import { Layers, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  const isIntro = pathname === "/docs";

  return (
    <aside className="fixed bottom-0 top-16 z-30 hidden w-64 shrink-0 border-r border-hairline bg-background md:sticky md:block">
      <div className="h-full overflow-y-auto px-6 py-8">
        {/* Getting Started */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Getting Started
          </h4>
          <ul className="space-y-1">
            <li>
              <Link
                href="/docs"
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                  isIntro
                    ? "bg-surface-2 text-ink font-medium border border-hairline"
                    : "text-ink-subtle hover:text-ink hover:bg-surface-1"
                )}
              >
                <span>Introduction</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Components */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Components
          </h4>
          <ul className="space-y-1">
            {Object.values(registry).map((item) => {
              const isActive = pathname === `/docs/${item.slug}`;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/docs/${item.slug}`}
                    className={cn(
                      "flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all",
                      isActive
                        ? "bg-surface-2 text-ink font-semibold border border-hairline shadow-xs"
                        : "text-ink-subtle hover:text-ink hover:bg-surface-1"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
