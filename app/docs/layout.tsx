import React from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Logo } from "@/components/logo";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { registry } from "@/registry";

const componentChildren = Object.values(registry).map((item) => ({
  type: "page" as const,
  name: item.name,
  url: `/docs/${item.slug}`,
}));

const tree = {
  name: "Docs",
  children: [
    {
      type: "page",
      name: "Introduction",
      url: "/docs",
    },
    {
      type: "separator",
      name: "Components",
    },
    ...componentChildren,
  ],
};

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout
      tree={tree as any}
      nav={{
        title: (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo size={24} className="text-zinc-100" />
            <span className="font-display text-lg tracking-tight text-white">Sora UI</span>
          </Link>
        ),
      }}
      links={[
        {
          type: "icon",
          icon: <FaGithub className="h-4 w-4" />,
          text: "GitHub",
          url: "https://github.com/k4ran909/Sora-UI",
        },
      ]}
      themeSwitch={{
        enabled: false,
      }}
    >
      {children}
    </DocsLayout>
  );
}
