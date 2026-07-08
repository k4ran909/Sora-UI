import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { Footer } from "./footer";

export function Footer2() {
  return (
    <footer className="bg-muted/10 border-input w-full rounded-3xl border p-2">
      <Footer />
      <div className="px-4 pt-12 pb-2 md:pb-12">
        <div className="mx-auto max-w-6xl">
          {/* Top Section */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center select-none">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <div className="flex items-center">
                    <Image
                      src="/logo/logo-dodo.svg"
                      alt="Sora UI"
                      width={32}
                      height={32}
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <span className="font-display text-2xl text-zinc-500 leading-none">/</span>
                  <span className="font-sans font-bold text-lg tracking-tight text-white leading-none">Sora UI</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Open-source React components for premium animations and interactions.
              </p>
              <div className="flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://github.com/k4ran909/Sora-UI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://dodopayments.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/logo/logo-dodo.svg"
                      alt="Dodo Payments"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://x.com/k4ran909"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsTwitterX className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-foreground mb-4 font-semibold">Components</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing Tables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Usage Meters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Subscription Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Banners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-4 font-semibold">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/quick-start"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/theming"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Theming Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/interfaces"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Interfaces
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground mb-4 font-semibold">Community</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="https://github.com/k4ran909/Sora-UI/issues"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub Issues
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.com/invite/udZPtMSuE3"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Discord Server
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/contribution-open-source"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contributing
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/k4ran909"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Karan Github
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-border/50 border-t pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 flex flex-col items-center gap-4 md:mb-0 md:flex-row">
                <p className="text-muted-foreground text-sm">
                  © {new Date().getFullYear()} SoraUI. Made with{" "}
                  <FaHeart className="inline h-3 w-3 fill-current text-red-500" />{" "}
                  for developers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
