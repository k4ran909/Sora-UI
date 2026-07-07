"use client";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PreviewComponents } from "@/components/preview/preview-components";
import { MusicPlayer } from "@/registry/music-player";
import { MusicPlayer as DarkPlayer } from "@/registry/dark-player";
import { BarVisualizer } from "@/registry/bar-visualizer";
import { DateSelector } from "@/registry/date-selector";
import { DustSphere } from "@/registry/dust-sphere";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { ShineButton } from "./shine-button";
import { ArrowLeft, ArrowRight, Blocks, Music, Disc, Activity, Calendar, Globe } from "lucide-react";
import { Button } from "../ui/button";

export function ComponentsSection() {
  const [active, setActive] = useState("music-player");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [borderPosition, setBorderPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 2,
  });
  const tabsListRef = useRef<HTMLDivElement>(null);

  const components = [
    {
      id: "music-player",
      label: "Skeuomorphic Player",
      icon: Disc,
      href: "/docs/music-player",
    },
    {
      id: "dark-player",
      label: "Dark Pill Player",
      icon: Music,
      href: "/docs/dark-player",
    },
    {
      id: "bar-visualizer",
      label: "Voice Visualizer",
      icon: Activity,
      href: "/docs/bar-visualizer",
    },
    {
      id: "date-selector",
      label: "Date Selector",
      icon: Calendar,
      href: "/docs/date-selector",
    },
    {
      id: "dust-sphere",
      label: "3D Particle Sphere",
      icon: Globe,
      href: "/docs/dust-sphere",
    },
  ];

  useEffect(() => {
    if (!tabsListRef.current) return;

    const tabsList = tabsListRef.current;
    const activeTab = tabsList.querySelector(
      `[data-state="active"]`,
    ) as HTMLElement;

    if (activeTab) {
      const tabsListRect = tabsList.getBoundingClientRect();
      const activeTabRect = activeTab.getBoundingClientRect();

      setBorderPosition({
        left: 0,
        top: activeTabRect.top - tabsListRect.top,
        width: 3,
        height: activeTabRect.height,
      });
    }
  }, [active]);

  useEffect(() => {
    if (!isAutoRotating || isHovered) return;

    const interval = setInterval(() => {
      handleTransition();
    }, 6000);

    return () => clearInterval(interval);
  }, [active, isAutoRotating, isHovered]);

  const handleTransition = (targetComponent?: string) => {
    const currentIndex = components.findIndex((comp) => comp.id === active);
    let nextComponent;

    if (targetComponent) {
      nextComponent = targetComponent;
    } else {
      const nextIndex = (currentIndex + 1) % components.length;
      nextComponent = components[nextIndex].id;
    }

    setActive(nextComponent);
  };

  const handleComponentClick = (componentId: string) => {
    if (componentId === active) return;

    handleTransition(componentId);
    setIsAutoRotating(false);

    setTimeout(() => {
      setIsAutoRotating(true);
    }, 15000);
  };

  const handlePrevious = () => {
    const currentIndex = components.findIndex((comp) => comp.id === active);
    const prevIndex =
      currentIndex === 0 ? components.length - 1 : currentIndex - 1;
    const prevComponent = components[prevIndex].id;
    handleComponentClick(prevComponent);
  };

  const handleNext = () => {
    const currentIndex = components.findIndex((comp) => comp.id === active);
    const nextIndex = (currentIndex + 1) % components.length;
    const nextComponent = components[nextIndex].id;
    handleComponentClick(nextComponent);
  };

  const getCurrentComponent = () => {
    return components.find((comp) => comp.id === active);
  };

  const handleViewComponent = () => {
    const currentComponent = getCurrentComponent();
    if (currentComponent?.href) {
      window.open(currentComponent.href, "_blank");
    }
  };

  return (
    <div className="relative mx-auto w-full overflow-hidden">
      <Tabs
        value={active}
        onValueChange={handleComponentClick}
        className="w-full"
      >
        <div className="flex w-full flex-col items-start gap-8 xl:flex-row">
          {/* Left Side - Title, Description & Tab List */}
          <div className="flex w-full flex-shrink-0 flex-col items-start xl:w-80">
            <ShineButton
              Icon={Blocks}
              className="w-fit shadow-xl shadow-white/5"
              label="Components"
            />
            <div className="text-left">
              <h2 className="font-display text-primary animate-in fade-in slide-in-from-bottom-4 mt-4 text-3xl font-medium duration-1000 sm:text-3xl md:text-4xl">
                Explore Interactive Premium Components
              </h2>
              <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 mt-4 mb-8 text-sm tracking-tight text-balance delay-200 duration-1000 md:text-base">
                Interact with real-time animated elements designed to make your
                interfaces stand out.
              </p>
            </div>

            {/* Tab List */}
            <div className="w-full">
              <TabsList
                ref={tabsListRef}
                className="bg-background relative flex h-auto w-full flex-col gap-2 rounded-lg p-2"
              >
                {components.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "flex h-auto w-full flex-row gap-3 p-3 transition-all duration-200",
                        "rounded-md border-0 text-sm font-medium",
                        "hover:bg-muted/50 cursor-pointer justify-start",
                        "data-[state=active]:bg-muted data-[state=active]:text-foreground",
                      )}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-left text-sm leading-tight">
                        {item.label}
                      </span>
                    </TabsTrigger>
                  );
                })}

                {/* Animated border indicator */}
                <motion.div
                  className="bg-primary absolute rounded-sm"
                  animate={{
                    left: borderPosition.left,
                    top: borderPosition.top,
                    width: borderPosition.width,
                    height: borderPosition.height,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    position: "absolute",
                  }}
                />
              </TabsList>

              <div className="mt-4 grid w-full grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                <Button
                  variant={"default"}
                  className="col-span-2 w-full py-2 text-sm md:col-span-1 xl:col-span-4"
                  onClick={handleViewComponent}
                >
                  View Component
                </Button>
                <Button
                  variant={"secondary"}
                  className="col-span-1 flex w-full items-center justify-center py-2 xl:col-span-2"
                  onClick={handlePrevious}
                  title="Previous Component"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  variant={"secondary"}
                  className="col-span-1 flex w-full items-center justify-center py-2 xl:col-span-2"
                  onClick={handleNext}
                  title="Next Component"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Tab Content */}
          <div className="w-full flex-1 xl:w-auto">
            <ComponentsShowcase setIsHovered={setIsHovered} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function ComponentsShowcase({ setIsHovered }: any) {
  return (
    <div id="components-showcase" className="w-full">
      <div
        className="border-fd-primary/10 bg-background flex w-full flex-col items-center justify-center rounded-lg border shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-full w-full transition-all duration-300 ease-in-out">
          <TabsContent value="music-player" className="mt-0">
            <PreviewComponents className="animate-in fade-in bg-background h-full min-h-[500px] w-full max-w-none border-none px-0 py-4 duration-300 md:min-h-[700px] flex items-center justify-center">
              <MusicPlayer timelineColor="var(--primary)" componentColor="var(--card)" />
            </PreviewComponents>
          </TabsContent>

          <TabsContent value="dark-player" className="mt-0">
            <PreviewComponents className="animate-in fade-in bg-background h-full min-h-[500px] w-full max-w-none border-none px-0 py-4 duration-300 md:min-h-[700px] flex items-center justify-center">
              <DarkPlayer timelineColor="var(--primary)" componentColor="var(--card)" />
            </PreviewComponents>
          </TabsContent>

          <TabsContent value="bar-visualizer" className="mt-0">
            <PreviewComponents className="animate-in fade-in bg-background h-full min-h-[500px] w-full max-w-none border-none px-0 py-4 duration-300 md:min-h-[700px] flex items-center justify-center">
              <InteractiveBarVisualizer />
            </PreviewComponents>
          </TabsContent>

          <TabsContent value="date-selector" className="mt-0">
            <PreviewComponents className="animate-in fade-in bg-background h-full min-h-[500px] w-full max-w-none border-none px-0 py-4 duration-300 md:min-h-[700px] flex items-center justify-center">
              <DateSelector activeColor="var(--primary)" componentColor="var(--card)" />
            </PreviewComponents>
          </TabsContent>

          <TabsContent value="dust-sphere" className="mt-0">
            <PreviewComponents className="animate-in fade-in bg-background h-full min-h-[500px] w-full max-w-none border-none px-0 py-4 duration-300 md:min-h-[700px] flex items-center justify-center">
              <InteractiveDustSphere />
            </PreviewComponents>
          </TabsContent>
        </div>
      </div>
    </div>
  );
}

function InteractiveDustSphere() {
  const [sphereColor, setSphereColor] = useState("var(--primary)");

  const colors = [
    { label: "Theme Active", value: "var(--primary)" },
    { label: "Indigo Glow", value: "#6366f1" },
    { label: "Emerald Green", value: "#10b981" },
    { label: "Neon Cyan", value: "#06b6d4" },
    { label: "Sunset Orange", value: "#f97316" },
    { label: "Hot Pink", value: "#ec4899" },
    { label: "Pure White", value: "#ffffff" },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <DustSphere color={sphereColor} componentColor="var(--card)" className="h-[400px] w-[350px] sm:w-[400px]" />

      <div className="flex flex-wrap gap-3 justify-center bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80 items-center">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => setSphereColor(c.value)}
            className={cn(
              "w-6 h-6 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 border-2",
              sphereColor === c.value ? "border-white scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
            )}
            style={{ 
              background: c.value === "var(--primary)" 
                ? "linear-gradient(135deg, var(--primary), var(--accent))" 
                : c.value 
            }}
            title={c.label}
          />
        ))}
      </div>
    </div>
  );
}

function InteractiveBarVisualizer() {
  const [state, setState] = useState<any>("speaking");
  const [centerAlign, setCenterAlign] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <BarVisualizer state={state} barCount={15} demo={true} centerAlign={centerAlign} color="var(--primary)" />

      <div className="flex flex-wrap gap-2 justify-center bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80">
        {(["connecting", "initializing", "listening", "speaking", "thinking"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
              state === s
                ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCenterAlign(!centerAlign)}
        className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-zinc-300 border border-zinc-800/80 rounded-md cursor-pointer"
      >
        Align: {centerAlign ? "Center" : "Bottom"}
      </button>
    </div>
  );
}
