import React from "react";
import Link from "next/link";
import { registry } from "@/registry";
import { Sparkles, Layers, FileText } from "lucide-react";
import { Logo } from "@/components/logo";
import { DocsSidebar } from "@/components/docs/sidebar";

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
            href="https://github.com/k4ran909/Sora-UI"
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
        <DocsSidebar />

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-10 md:px-12 lg:px-16 overflow-y-auto">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
