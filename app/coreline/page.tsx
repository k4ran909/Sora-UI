"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CorelineHeading } from "@/components/coreline-heading";

// Types
interface TeamMember {
  name: string;
  role: string;
  image: string;
  link: string;
}

interface PortfolioCompany {
  name: string;
  logo: string;
  link: string;
  preCoreline?: boolean;
  marketCode?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Osuke Honda",
    role: "Co-Founder, Managing Partner",
    image: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a30fb315dfcddf9191f28dc_team-pic-osuke.avif",
    link: "https://coreline.vc/team/osuke-honda",
  },
  {
    name: "Kenichiro \"Ken\" Hara",
    role: "Co-Founder, Managing Partner",
    image: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a30fb2436a22a568eb57a2f_team-pic-ken.avif",
    link: "https://coreline.vc/team/kenichiro-ken-hara",
  },
  {
    name: "Arthur Kaneko",
    role: "Co-Founder, Managing Partner",
    image: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a30fb1078c1fef6aec38915_team-pic-arthur.avif",
    link: "https://coreline.vc/team/arthur-kaneko",
  },
  {
    name: "Matthew C. Bonner",
    role: "Co-Founder, COO",
    image: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a30fab03eb15742b8ca304b_team-pic-matthias.avif",
    link: "https://coreline.vc/team/matthew-c-bonner",
  },
];

const PORTFOLIO_COMPANIES: PortfolioCompany[] = [
  {
    name: "enechain",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/67b85381f7d5991e7017336f_logo-4.avif",
    link: "https://enechain.co.jp/en",
  },
  {
    name: "LayerX",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/67b85381f7d5991e7017336d_logo-5.avif",
    link: "https://layerx.co.jp/",
  },
  {
    name: "Squizify",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a343c6643c0f2106e42f20a_logo.avif",
    link: "https://squizify.com/",
  },
  {
    name: "Fish Audio",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a343c41310d05c10c0fb5d0_logo-4.avif",
    link: "https://fish.audio/",
  },
  {
    name: "Lens",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a343c539de6cac7af40aa8e_logo-3.avif",
    link: "https://lensinc.jp/",
  },
  {
    name: "DubGuild",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a343c36b706d60a781f783c_logo-5.avif",
    link: "https://dubguild.com/",
  },
  {
    name: "monolyst",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a343c4cc4b746b6e0201021_logo-2.avif",
    link: "https://corp.mono-lyst.com/",
  },
  {
    name: "route-D",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a343c6eae2b34a37ff7d680_logo-1.avif",
    link: "https://route-d.co.jp/",
  },
  {
    name: "freee",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/67b85381f7d5991e7017336e_logo.avif",
    link: "https://corp.freee.co.jp/",
    preCoreline: true,
    marketCode: "freee k.k. 4478.T",
  },
  {
    name: "Sansan",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/67b85381f7d5991e70173375_logo-1.avif",
    link: "https://www.corp-sansan.com/",
    preCoreline: true,
    marketCode: "Sansan, inc. 4443.T",
  },
  {
    name: "Kakao",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/67b85381f7d5991e70173378_logo-11.avif",
    link: "https://kakao.ai/",
    preCoreline: true,
    marketCode: "035720.KS",
  },
  {
    name: "CADDi",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a3421f09df1b480fe9424eb_67b85381f7d5991e70173370_logo-2.avif",
    link: "https://caddi.com/",
    preCoreline: true,
  },
  {
    name: "Linc'well",
    logo: "https://cdn.prod.website-files.com/67b85381f7d5991e70173284/6a3421fa1cc4cb956c6aaac4_67b85381f7d5991e70173371_logo-3.avif",
    link: "https://linc-well.com/en/",
    preCoreline: true,
  },
];

export default function CorelinePage() {
  const [timeSFO, setTimeSFO] = useState("");
  const [timeTYO, setTimeTYO] = useState("");
  const [clockRotation, setClockRotation] = useState(0);
  const [language, setLanguage] = useState<"ENG" | "JPN">("ENG");
  const [menuOpen, setMenuOpen] = useState(false);

  // Live ticking clocks hook
  useEffect(() => {
    const updateClocks = () => {
      const date = new Date();
      
      const sfoStr = date.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour12: false,
      });
      const tyoStr = date.toLocaleTimeString("en-US", {
        timeZone: "Asia/Tokyo",
        hour12: false,
      });

      setTimeSFO(sfoStr);
      setTimeTYO(tyoStr);

      // Rotate hands smoothly based on seconds (6 degrees per second)
      const sec = date.getSeconds();
      setClockRotation(sec * 6);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#ebe8e0] text-[#31403b] overflow-x-hidden selection:bg-[#31403b] selection:text-[#ebe8e0] font-sans pb-24">
      {/* ─── Grid Background Dividers ─── */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full grid grid-cols-3 md:grid-cols-6 pointer-events-none z-0">
        <div className="border-l border-[#31403b]/8 h-full" />
        <div className="border-l border-[#31403b]/8 h-full" />
        <div className="border-l border-[#31403b]/8 h-full" />
        <div className="border-l border-[#31403b]/8 h-full hidden md:block" />
        <div className="border-l border-[#31403b]/8 h-full hidden md:block" />
        <div className="border-l border-[#31403b]/8 h-full hidden md:block border-r" />
      </div>

      {/* ─── Navigation Header ─── */}
      <header className="relative w-full max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between border-b border-[#31403b]/10 z-35">
        {/* Logo */}
        <Link href="/coreline" className="flex items-center gap-3 z-40">
          <svg className="w-6 h-6 fill-[#31403b]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="16" height="80" />
            <rect x="42" y="10" width="16" height="80" />
            <rect x="74" y="10" width="16" height="80" />
          </svg>
          <span className="font-bold text-xl tracking-tight uppercase">Coreline</span>
        </Link>

        {/* Live clocks header section */}
        <div className="hidden md:flex items-center gap-12 text-[11px] font-semibold tracking-wider uppercase opacity-80">
          {/* SFO Clock */}
          <div className="flex items-center gap-3">
            <svg
              style={{ transform: `rotate(${clockRotation}deg)` }}
              className="w-3.5 h-3.5 stroke-[#31403b] stroke-[2px] transition-transform duration-1000 ease-linear fill-none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{timeSFO || "00:00:00"}</span>
            <span className="text-[9px] px-1 bg-[#31403b]/10 rounded font-bold text-[#31403b]/70">SFO</span>
          </div>

          {/* Tokyo Clock */}
          <div className="flex items-center gap-3">
            <svg
              style={{ transform: `rotate(${clockRotation + 90}deg)` }}
              className="w-3.5 h-3.5 stroke-[#31403b] stroke-[2px] transition-transform duration-1000 ease-linear fill-none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{timeTYO || "00:00:00"}</span>
            <span className="text-[9px] px-1 bg-[#31403b]/10 rounded font-bold text-[#31403b]/70">TYO</span>
          </div>
        </div>

        {/* Options on the right */}
        <div className="flex items-center gap-6 z-40">
          {/* Language Selector */}
          <div className="relative flex bg-[#31403b]/5 p-0.5 rounded-lg border border-[#31403b]/10 text-[9px] font-bold tracking-wider">
            <button
              onClick={() => setLanguage("ENG")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                language === "ENG" ? "bg-[#31403b] text-[#ebe8e0]" : "text-[#31403b]/60 hover:text-[#31403b]"
              }`}
            >
              ENG
            </button>
            <button
              onClick={() => setLanguage("JPN")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                language === "JPN" ? "bg-[#31403b] text-[#ebe8e0]" : "text-[#31403b]/60 hover:text-[#31403b]"
              }`}
            >
              JPN
            </button>
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <div className="w-5 h-3 flex flex-col justify-between items-end group">
              <span className={`h-0.5 bg-[#31403b] transition-all duration-300 ${menuOpen ? "w-5 rotate-45 translate-y-[5px]" : "w-5"}`} />
              <span className={`h-0.5 bg-[#31403b] transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-3"}`} />
              <span className={`h-0.5 bg-[#31403b] transition-all duration-300 ${menuOpen ? "w-5 -rotate-45 -translate-y-[5px]" : "w-4"}`} />
            </div>
            <span className="hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>

      {/* ─── Navigation Overlay Menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 w-full bg-[#ebe8e0] border-b border-[#31403b]/10 py-10 px-6 md:px-12 z-30"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
              <a href="#portfolio" onClick={() => setMenuOpen(false)} className="text-xl font-bold uppercase hover:translate-x-1 transition-transform">
                Portfolio
              </a>
              <a href="#team" onClick={() => setMenuOpen(false)} className="text-xl font-bold uppercase hover:translate-x-1 transition-transform">
                Team
              </a>
              <a href="https://atlas-by-coreline.com/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold uppercase hover:translate-x-1 transition-transform">
                Atlas Program
              </a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="text-xl font-bold uppercase hover:translate-x-1 transition-transform">
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-24">
        
        {/* ─── Hero Heading 3D Parallax Section ─── */}
        <section className="py-8 md:py-16 overflow-visible border-b border-[#31403b]/10">
          <CorelineHeading />
        </section>

        {/* ─── Intro Mission statements ─── */}
        <section className="grid grid-cols-1 md:grid-cols-6 gap-6 py-6 border-b border-[#31403b]/10">
          <div className="md:col-span-4 md:col-start-2 space-y-8 py-8">
            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight">
              {language === "ENG" 
                ? "Coreline is a boutique VC firm investing early in exceptional founders in Japan and the US+ — founders who will become category definers."
                : "コアラインは、日本と米国等の卓越した創業期起業家へ投資するブティック型ベンチャーキャピタルです。"}
            </h2>
            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-[#31403b]/70">
              {language === "ENG"
                ? "With us, you have a partner who understands your unique market opportunity, and positions you to rise above the rest."
                : "私たちは市場機会を理解し、グローバルで勝ち抜くため伴走します。"}
            </h2>
            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-[#31403b]/50">
              {language === "ENG"
                ? "We’ve helped many entrepreneurs realize the value of their life’s work. Join us."
                : "数多くの起業家の挑戦を支援してきました。共に未来へ歩みましょう。"}
            </h2>
          </div>
        </section>

        {/* ─── Team Members Section ─── */}
        <section id="team" className="space-y-12 pb-16 border-b border-[#31403b]/10">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-bold tracking-widest uppercase opacity-60">Team members</h3>
            <a href="https://coreline.vc/team" className="text-xs font-bold tracking-widest uppercase hover:underline">
              Browse all team members
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <a
                key={member.name}
                href={member.link}
                className="group flex flex-col bg-[#ebe8e0] border border-[#31403b]/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#31403b]/30 transition-all duration-300 cursor-pointer"
              >
                {/* Photo frame */}
                <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#31403b]/5 border-b border-[#31403b]/10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Text details */}
                <div className="p-4 flex flex-col gap-1">
                  <span className="font-bold text-lg tracking-tight group-hover:underline">{member.name}</span>
                  <span className="text-xs text-[#31403b]/60">{member.role}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ─── Portfolio companies Section ─── */}
        <section id="portfolio" className="space-y-12 pb-16 border-b border-[#31403b]/10">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-bold tracking-widest uppercase opacity-60">Portfolio Companies</h3>
            <a href="https://coreline.vc/portfolio" className="text-xs font-bold tracking-widest uppercase hover:underline">
              Browse all portfolio
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {PORTFOLIO_COMPANIES.map((company, idx) => (
              <a
                key={`${company.name}-${idx}`}
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between items-center p-6 bg-[#ebe8e0] border border-[#31403b]/10 rounded-2xl aspect-square hover:shadow-lg hover:border-[#31403b]/30 transition-all duration-300"
              >
                {/* Company Logo */}
                <div className="flex-1 flex items-center justify-center w-full max-h-[60%]">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-full max-w-[80%] object-contain filter opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                  />
                </div>

                {/* Info tags */}
                <div className="w-full text-center flex flex-col gap-0.5">
                  <span className="font-bold text-sm tracking-tight text-[#31403b]">{company.name}</span>
                  {company.preCoreline && (
                    <span className="text-[9px] text-[#31403b]/50 uppercase font-bold tracking-wider">
                      Pre-Coreline *
                    </span>
                  )}
                  {company.marketCode && (
                    <span className="text-[9px] text-[#31403b]/40 font-mono">
                      {company.marketCode}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Sourced/Led DCM disclaimer */}
          <p className="text-[10px] text-[#31403b]/50 italic leading-relaxed max-w-4xl pt-6">
            * Investments sourced and led by the Coreline investment team members while investment partners at DCM. Any comparison between prior investments made at DCM and Coreline investments is not without difficulty due to differing fund strategies and objectives, fund sizes, market conditions, and other factors.
          </p>
        </section>

        {/* ─── Contact Section ─── */}
        <section id="contact" className="py-12 flex flex-col md:flex-row items-start justify-between gap-8 border-b border-[#31403b]/10">
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest uppercase opacity-60">Get in touch</h3>
            <p className="text-xl max-w-md text-[#31403b]/80 leading-relaxed">
              We are always eager to partner with founders defining the core. Drop us a note.
            </p>
          </div>
          <a
            href="mailto:contact@coreline.vc"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#31403b] text-[#ebe8e0] rounded-xl hover:bg-[#31403b]/90 font-bold transition-all hover:shadow-lg uppercase tracking-wider text-xs"
          >
            <span>contact@coreline.vc</span>
            <svg className="w-4 h-4 fill-[#ebe8e0]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </a>
        </section>

      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-65 text-xs">
        {/* Left copyright */}
        <div>
          <span>© CORELINE 2026</span>
          <span className="mx-2">•</span>
          <a href="https://altalogy.com/?ref=coreline" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Design by Altalogy
          </a>
        </div>

        {/* Right clocks */}
        <div className="flex gap-8 text-[10px] font-bold tracking-wider uppercase">
          <span>TOKYO: {timeTYO || "00:00:00"}</span>
          <span>SAN FRANCISCO: {timeSFO || "00:00:00"}</span>
        </div>
      </footer>
    </div>
  );
}
