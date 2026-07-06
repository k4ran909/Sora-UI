"use client";

import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import { ComponentsSection } from "@/components/landing/components";
import { QuickIntegration } from "@/components/landing/quick-integrations";
import { Sentra } from "@/components/landing/sentra";
import { Faq } from "@/components/landing/faq";
import { OpenSource } from "@/components/landing/opensource";
import { Footer2 } from "@/components/landing/footer2";

export default function Home() {
  return (
    <div className="bg-background mx-auto min-h-screen w-full max-w-[1920px]">
      <NavBar />
      <main className="relative container mx-auto w-full overflow-hidden p-4">
        <Hero />
        <Features />
        <ComponentsSection />
        <QuickIntegration />
        <Sentra />
        <Faq />
        <OpenSource />
        <Footer2 />
      </main>
    </div>
  );
}
