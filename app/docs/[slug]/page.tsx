import React from "react";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { registry } from "@/registry";
import { ComponentViewer } from "@/components/component-viewer";
import { PreviewRenderer } from "@/components/preview-renderer";
import { MusicPlayerPlayground } from "@/components/music-player-playground";
import { MusicPlayerDocs } from "@/components/music-player-docs";
import { DarkPlayerDocs } from "@/components/dark-player-docs";
import { BarVisualizerDocs } from "@/components/bar-visualizer-docs";
import { DateSelectorDocs } from "@/components/date-selector-docs";
import { CLIInstallBlock } from "@/components/cli-install-block";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(registry).map((slug) => ({
    slug,
  }));
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  
  const componentInfo = registry[slug];
  if (!componentInfo) {
    notFound();
  }

  // Read the code content of the file
  let codeContent = "";
  try {
    const filePath = path.join(process.cwd(), componentInfo.codePath);
    codeContent = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    codeContent = `// Error loading code file: ${componentInfo.codePath}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          {componentInfo.category}
        </div>
        <h1 className="text-4xl font-semibold tracking-[-1px] text-ink sm:text-5xl">
          {componentInfo.name}
        </h1>
        <p className="mt-3 text-lg text-ink-muted leading-relaxed">
          {componentInfo.description}
        </p>
      </div>

      <div className="border-t border-hairline pt-8">
        {slug === "music-player" ? (
          <MusicPlayerPlayground componentCode={codeContent} />
        ) : (
          <ComponentViewer code={codeContent}>
            <PreviewRenderer slug={slug} />
          </ComponentViewer>
        )}
      </div>

      <div className="border-t border-hairline pt-8 space-y-6">
        <h2 className="text-xl font-bold text-ink tracking-[-0.4px]">Installation</h2>
        
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-ink">Option A: Via Sora UI CLI (Recommended)</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            If your project uses `shadcn/ui`, you can install this component and its dependencies automatically:
          </p>
          <CLIInstallBlock slug={slug} />
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-ink">Option B: Manual Copy-Paste</h3>
          <p className="text-xs text-ink-subtle leading-relaxed space-y-2">
            1. Copy the code from the <strong>Code &gt; Component</strong> tab above.
            <br />
            2. Paste it in your project at <code className="text-primary font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-hairline text-[11px]">components/{componentInfo.slug}.tsx</code>.
            <br />
            3. Install the dependencies: <code className="text-primary font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-hairline text-[11px]">npm install {componentInfo.dependencies?.join(" ") || "framer-motion clsx tailwind-merge lucide-react"}</code>.
          </p>
        </div>
      </div>

      {/* Detailed documentation section for music-player */}
      {slug === "music-player" && (
        <div className="border-t border-hairline pt-12">
          <MusicPlayerDocs />
        </div>
      )}

      {/* Detailed documentation section for dark-player */}
      {slug === "dark-player" && (
        <div className="border-t border-hairline pt-12">
          <DarkPlayerDocs />
        </div>
      )}

      {/* Detailed documentation section for bar-visualizer */}
      {slug === "bar-visualizer" && (
        <div className="border-t border-hairline pt-12">
          <BarVisualizerDocs />
        </div>
      )}

      {/* Detailed documentation section for date-selector */}
      {slug === "date-selector" && (
        <div className="border-t border-hairline pt-12">
          <DateSelectorDocs />
        </div>
      )}
    </div>
  );
}
