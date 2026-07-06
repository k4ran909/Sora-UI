import React from "react";
import Link from "next/link";
import { registry } from "@/registry";
import { Sparkles, Layers, FileText } from "lucide-react";
import { Logo } from "@/components/logo";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-hairline bg-background/80 px-6 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <Logo size={22} className="text-zinc-100" />
          <span>Sora UI</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink-subtle hover:text-ink transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Docs Body Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="fixed bottom-0 top-16 z-30 hidden w-64 shrink-0 border-r border-hairline bg-background md:sticky md:block">
          <div className="h-full overflow-y-auto px-6 py-8">
            <div className="mb-8">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-4">
                <FileText className="h-3 w-3" />
                Getting Started
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="block text-sm text-ink-subtle hover:text-ink hover:underline transition-colors"
                  >
                    Introduction
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-4">
                <Layers className="h-3 w-3" />
                Components
              </h4>
              <ul className="space-y-2">
                {Object.values(registry).map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/docs/${item.slug}`}
                      className="block text-sm text-ink-subtle hover:text-ink transition-colors border-l border-hairline hover:border-primary pl-3"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-10 md:px-12 lg:px-16 overflow-y-auto">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
