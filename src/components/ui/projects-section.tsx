import React from "react";

type Project = {
  id: string;
  name: string;
  type: string;
  tagline: string;
  tech: string[];
  image: string;
  href: string;
};

type NormalizedPoint = readonly [number, number];

type BuildingRegion = {
  id: string;
  projectId: Project["id"];
  label: string;
  points: readonly NormalizedPoint[];
  focus: NormalizedPoint;
};

const SKYLINE_IMAGE = "/images/skyline.svg";
const SKYLINE_ASPECT_RATIO = "1632 / 248";

const projects: Project[] = [
  {
    id: "mentora",
    name: "Mentora",
    type: "Learning Ops",
    tagline:
      "Student engagement tracking shaped into a clean instructor workflow.",
    tech: ["Next.js", "PostgreSQL", "Tailwind"],
    image: "/images/mentora.png",
    href: "#",
  },
  {
    id: "decay-ai",
    name: "Decay-AI",
    type: "Signal Engine",
    tagline: "Trend decline signals for faster content strategy calls.",
    tech: ["React", "Node.js", "MongoDB"],
    image: "/images/decay-ai.png",
    href: "#",
  },
  {
    id: "civil-setu",
    name: "Civil Setu",
    type: "Civic Intelligence",
    tagline: "AI-assisted civic reporting for cleaner issue routing.",
    tech: ["TypeScript", "Redis", "AWS"],
    image: "/images/civil-setu.png",
    href: "#",
  },
  {
    id: "city-pulse",
    name: "City Pulse",
    type: "Experience Map",
    tagline: "A cinematic interaction layer for browsing work through space.",
    tech: ["React", "SVG", "Motion"],
    image: SKYLINE_IMAGE,
    href: "#",
  },
  {
    id: "collabhub",
    name: "CollabHub",
    type: "Team Collaboration",
    tagline: "A contribution-first talent network where builders showcase real work, collaborate on projects, and grow their reputation through impact instead of resumes.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    image: "/images/collabhub.png",
    href: "https://collabhub-sigma.vercel.app/",
  },
];

const projectById = new Map(projects.map((project) => [project.id, project]));

const buildingRegions: BuildingRegion[] = [
  {
    id: "west-towers",
    projectId: "mentora",
    label: "Mentora building cluster",
    points: [
      [0.176, 0.03],
      [0.205, 0.18],
      [0.244, 0.43],
      [0.244, 0.92],
      [0.175, 0.92],
    ],
    focus: [0.21, 0.38],
  },
  {
    id: "twin-spires",
    projectId: "decay-ai",
    label: "Decay-AI twin tower",
    points: [
      [0.323, 0.02],
      [0.374, 0.01],
      [0.386, 0.92],
      [0.314, 0.92],
    ],
    focus: [0.35, 0.28],
  },
  {
    id: "central-dome",
    projectId: "city-pulse",
    label: "City Pulse central district",
    points: [
      [0.414, 0.57],
      [0.455, 0.57],
      [0.47, 0.37],
      [0.489, 0.56],
      [0.518, 0.58],
      [0.518, 0.92],
      [0.414, 0.92],
    ],
    focus: [0.466, 0.56],
  },
  {
    id: "east-stack",
    projectId: "civil-setu",
    label: "Civil Setu tower stack",
    points: [
      [0.552, 0.28],
      [0.625, 0.3],
      [0.625, 0.92],
      [0.544, 0.92],
      [0.544, 0.41],
    ],
    focus: [0.588, 0.44],
  },
  {
    id: "needle-row",
    projectId: "decay-ai",
    label: "Decay-AI needle row",
    points: [
      [0.779, 0.13],
      [0.809, 0.26],
      [0.809, 0.92],
      [0.777, 0.92],
    ],
    focus: [0.793, 0.36],
  },
  {
    id: "final-tower",
    projectId: "civil-setu",
    label: "Civil Setu eastern tower",
    points: [
      [0.955, 0.04],
      [0.998, 0.2],
      [0.998, 0.92],
      [0.954, 0.92],
    ],
    focus: [0.977, 0.36],
  },
  {
    id: "hub-nexus",
    projectId: "collabhub",
    label: "CollabHub nexus tower",
    points: [
      [0.659, 0.15],
      [0.725, 0.08],
      [0.74, 0.92],
      [0.65, 0.92],
    ],
    focus: [0.692, 0.35],
  },
];

const toSvgPoints = (points: readonly NormalizedPoint[]) =>
  points.map(([x, y]) => `${x},${y}`).join(" ");

// ============================================================================
// Firefly Cursor Engine - Premium cinematic glow system
// ============================================================================
class FireflyCursorEngine {
  private glowEl: HTMLElement | null = null;
  private containerEl: HTMLElement | null = null;
  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private isHovering = false;
  private rafId: number | null = null;
  private inertia = 0.12; // Lerp factor for smooth trailing
  private containerRect: DOMRect | null = null;
  private lastContainerUpdate = 0;

  constructor(glowEl: HTMLElement, containerEl: HTMLElement) {
    this.glowEl = glowEl;
    this.containerEl = containerEl;
    this.setupEventListeners();
    this.startLoop();
  }

  private setupEventListeners() {
    if (!this.containerEl) return;

    // Throttle mousemove to avoid excessive calculations
    let moveTimeout: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (moveTimeout !== null) return;
      this.updateCursorPos(e);
      moveTimeout = window.setTimeout(() => {
        moveTimeout = null;
      }, 0);
    };

    this.containerEl.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });
  }

  private updateCursorPos(e: MouseEvent) {
    if (!this.containerEl) return;

    // Cache container rect for performance
    const now = performance.now();
    if (now - this.lastContainerUpdate > 100) {
      this.containerRect = this.containerEl.getBoundingClientRect();
      this.lastContainerUpdate = now;
    }

    if (this.containerRect) {
      this.targetX = e.clientX - this.containerRect.left;
      this.targetY = e.clientY - this.containerRect.top;
    }
  }

  private startLoop() {
    const animate = () => {
      this.update();
      this.rafId = requestAnimationFrame(animate);
    };
    this.rafId = requestAnimationFrame(animate);
  }

  private update() {
    if (!this.glowEl) return;

    // Smooth position interpolation with inertia
    this.currentX += (this.targetX - this.currentX) * this.inertia;
    this.currentY += (this.targetY - this.currentY) * this.inertia;

    // Target opacity: fully visible only when hovering, completely invisible otherwise
    const targetOpacity = this.isHovering ? 0.85 : 0;
    const currentOpacity =
      this.glowEl.style.opacity !== ""
        ? parseFloat(this.glowEl.style.opacity)
        : 0;
    const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.12;

    // Target scale based on hover state
    const targetScale = this.isHovering ? 1 : 0.75;
    const scaleMatch = this.glowEl.style.transform.match(/scale\(([\d.]+)\)/);
    const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 0.75;
    const newScale = currentScale + (targetScale - currentScale) * 0.08;

    // GPU-accelerated transform: translate3d + scale
    this.glowEl.style.transform = `translate3d(${this.currentX - 32}px, ${this.currentY - 32}px, 0) scale(${newScale.toFixed(3)})`;
    this.glowEl.style.opacity = newOpacity.toFixed(3);
  }

  setHovering(hovering: boolean) {
    this.isHovering = hovering;
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// ============================================================================
// Preview Positioning Engine - Cinematic hover preview system
// ============================================================================
type PreviewData = {
  project: Project;
  containerRect: DOMRect;
  cursorX: number;
  cursorY: number;
};

class PreviewPositioningEngine {
  private previewEl: HTMLElement | null = null;
  private imageEl: HTMLElement | null = null;
  private containerEl: HTMLElement | null = null;
  private currentData: PreviewData | null = null;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private targetOpacity = 0;
  private currentOpacity = 0;
  private targetScale = 0.85;
  private currentScale = 0.85;
  private rafId: number | null = null;
  private inertia = 0.14;
  private lastImageUpdate = 0;

  constructor(
    previewEl: HTMLElement,
    imageEl: HTMLElement,
    containerEl: HTMLElement,
  ) {
    this.previewEl = previewEl;
    this.imageEl = imageEl;
    this.containerEl = containerEl;
    this.startLoop();
  }

  private startLoop() {
    const animate = () => {
      this.update();
      this.rafId = requestAnimationFrame(animate);
    };
    this.rafId = requestAnimationFrame(animate);
  }

  private update() {
    if (!this.previewEl) return;

    // Smooth interpolation for position
    this.currentX += (this.targetX - this.currentX) * this.inertia;
    this.currentY += (this.targetY - this.currentY) * this.inertia;

    // Smooth opacity transition
    this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.12;

    // Smooth scale transition
    this.currentScale += (this.targetScale - this.currentScale) * 0.1;

    // GPU-accelerated transform
    this.previewEl.style.transform = `translate3d(${this.currentX.toFixed(1)}px, ${this.currentY.toFixed(1)}px, 0) scale(${this.currentScale.toFixed(3)})`;
    this.previewEl.style.opacity = this.currentOpacity.toFixed(3);
  }

  setPreview(data: PreviewData | null) {
    if (!data) {
      this.targetOpacity = 0;
      this.targetScale = 0.85;
      this.currentData = null;
      return;
    }

    this.currentData = data;

    // Update image if project changed
    const now = performance.now();
    if (now - this.lastImageUpdate > 100 && this.imageEl) {
      this.imageEl.style.backgroundImage = `url(${data.project.image})`;
      this.lastImageUpdate = now;
    }

    // Calculate intelligent positioning: anchor above cursor with slight offset
    const previewWidth = 320;
    const previewHeight = 280;
    const offsetX = -previewWidth / 2;
    const offsetY = -previewHeight - 12; // 12px above cursor

    let x = data.cursorX + offsetX;
    let y = data.cursorY + offsetY;

    // Clamp to viewport boundaries
    const containerRect = data.containerRect;
    if (x < 8) x = 8;
    if (x + previewWidth > containerRect.width - 8) {
      x = containerRect.width - previewWidth - 8;
    }
    if (y < 8) y = 8;

    this.targetX = x;
    this.targetY = y;
    this.targetOpacity = 1;
    this.targetScale = 1;
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

export function ProjectsSection() {
  return (
    <section
      className="relative w-full px-4 text-black sm:px-6 lg:px-8"
      aria-label="Project showcase"
    >
      <div className="mx-auto w-full max-w-[1600px] py-14 sm:py-16 overflow-visible">
        <div className="mb-8 sm:mb-10">
          <h2
            className="mt-1 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl lg:text-8xl"
            style={{ marginBottom: "0px" }}
          >
            Works
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/40">
            Hover over the skyline to explore. Click for details.
          </p>
        </div>
        <div style={{ perspective: "1200px", marginTop: "128px" }}>
          <SkylineExperienceMap />
        </div>
      </div>
    </section>
  );
}

function SkylineExperienceMap() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const previewImageRef = React.useRef<HTMLDivElement>(null);
  const engineRef = React.useRef<FireflyCursorEngine | null>(null);
  const previewEngineRef = React.useRef<PreviewPositioningEngine | null>(null);
  const containerRectRef = React.useRef<DOMRect | null>(null);
  let cursorUpdateTimeout: number | null = null;

  const hoveredRegion = React.useMemo(
    () => buildingRegions.find((region) => region.id === hoveredId) ?? null,
    [hoveredId],
  );
  const hoveredProject = hoveredRegion
    ? projectById.get(hoveredRegion.projectId)
    : null;

  const selectedRegion = React.useMemo(
    () => buildingRegions.find((region) => region.id === selectedId) ?? null,
    [selectedId],
  );
  const selectedProject = selectedRegion
    ? projectById.get(selectedRegion.projectId)
    : null;

  const updateHoveredId = React.useCallback((id: string | null) => {
    setHoveredId((current) => (current === id ? current : id));
  }, []);

  const openRegion = React.useCallback((region: BuildingRegion) => {
    setSelectedId(region.id);
  }, []);

  // Track cursor position for preview positioning (non-React updates via engine)
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (cursorUpdateTimeout !== null) return;

    setCursorPos({ x: e.clientX, y: e.clientY });

    if (!containerRectRef.current) {
      containerRectRef.current =
        containerRef.current?.getBoundingClientRect() ?? null;
    }

    cursorUpdateTimeout = window.setTimeout(() => {
      cursorUpdateTimeout = null;
    }, 0);
  }, []);

  // Initialize engines
  React.useEffect(() => {
    if (
      !containerRef.current ||
      !glowRef.current ||
      !previewRef.current ||
      !previewImageRef.current
    )
      return;

    containerRef.current.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    engineRef.current = new FireflyCursorEngine(
      glowRef.current,
      containerRef.current,
    );

    previewEngineRef.current = new PreviewPositioningEngine(
      previewRef.current,
      previewImageRef.current,
      containerRef.current,
    );

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      if (engineRef.current) {
        engineRef.current.destroy();
      }
      if (previewEngineRef.current) {
        previewEngineRef.current.destroy();
      }
    };
  }, [handleMouseMove]);

  // Update firefly hover state
  React.useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setHovering(hoveredId !== null);
    }
  }, [hoveredId]);

  // Update preview display
  React.useEffect(() => {
    if (previewEngineRef.current && containerRectRef.current) {
      if (hoveredProject && hoveredId) {
        previewEngineRef.current.setPreview({
          project: hoveredProject,
          containerRect: containerRectRef.current,
          cursorX: cursorPos.x - containerRectRef.current.left,
          cursorY: cursorPos.y - containerRectRef.current.top,
        });
      } else {
        previewEngineRef.current.setPreview(null);
      }
    }
  }, [hoveredId, hoveredProject, cursorPos]);

  return (
    <div className="relative overflow-visible">
      <div
        ref={containerRef}
        className="group relative left-1/2 w-screen -translate-x-1/2 overflow-visible"
        style={{ aspectRatio: SKYLINE_ASPECT_RATIO }}
      >
        {/* Firefly cursor glow */}
        <div
          ref={glowRef}
          className="skyline-firefly-glow pointer-events-none absolute"
          style={{
            width: "64px",
            height: "64px",
            left: 0,
            top: 0,
            opacity: 0,
            transform: "translate3d(0, 0, 0) scale(0.75)",
            willChange: "transform, opacity",
            zIndex: 20,
          }}
        />

        <img
          src={SKYLINE_IMAGE}
          alt="Interactive city skyline project map"
          className="absolute inset-0 h-full w-full select-none object-cover"
          draggable={false}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          aria-label="Project buildings"
        >
          {buildingRegions.map((region) => {
            const project = projectById.get(region.projectId);
            if (!project) return null;

            return (
              <SkylineHotspot
                key={region.id}
                region={region}
                project={project}
                isActive={hoveredId === region.id}
                onHover={updateHoveredId}
                onOpen={openRegion}
              />
            );
          })}
        </svg>

        {/* Cinematic preview card */}
        <div
          ref={previewRef}
          className="skyline-cinematic-preview pointer-events-none absolute"
          style={{
            width: "320px",
            left: 0,
            top: 0,
            opacity: 0,
            transform: "translate3d(0, 0, 0) scale(0.85)",
            willChange: "transform, opacity",
            zIndex: 30,
          }}
        >
          <div
            ref={previewImageRef}
            className="skyline-preview-image relative h-32 w-full bg-cover bg-center rounded-t-xl"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="skyline-preview-content rounded-lg bg-black border border-white/10 px-2 py-1.5">
            <h4 className="font-['Bebas_Neue'] text-base font-normal uppercase leading-tight text-white">
              {hoveredProject?.name}
            </h4>
          </div>
        </div>
      </div>

      {selectedRegion && selectedProject && (
        <ExperienceDialog
          project={selectedProject}
          region={selectedRegion}
          onClose={() => setSelectedId(null)}
        />
      )}

      <style>{`
        @keyframes skyline-firefly-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }

        .skyline-firefly-glow {
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 220, 100, 0.9) 0%,
            rgba(255, 180, 60, 0.4) 35%,
            rgba(255, 140, 40, 0.1) 60%,
            transparent 100%
          );
          filter: drop-shadow(0 0 12px rgba(255, 200, 80, 0.5))
                  drop-shadow(0 0 24px rgba(255, 150, 50, 0.25));
          border-radius: 50%;
          animation: skyline-firefly-pulse 4s ease-in-out infinite;
        }

        .skyline-cinematic-preview {
          box-shadow: 
            0 8px 32px rgba(255, 180, 60, 0.15),
            0 24px 64px rgba(0, 0, 0, 0.45),
            inset 0 1px 1px rgba(255, 255, 255, 0.08);
        }

        .skyline-preview-image {
          position: relative;
          overflow: hidden;
        }

        .skyline-preview-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .skyline-preview-content {
          position: relative;
          background: #000;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
      `}</style>
    </div>
  );
}

const SkylineHotspot = React.memo(function SkylineHotspot({
  region,
  project,
  isActive,
  onHover,
  onOpen,
}: {
  region: BuildingRegion;
  project: Project;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onOpen: (region: BuildingRegion) => void;
}) {
  const points = React.useMemo(
    () => toSvgPoints(region.points),
    [region.points],
  );

  const handlePointerEnter = React.useCallback(() => {
    onHover(region.id);
  }, [onHover, region.id]);

  const handlePointerLeave = React.useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleSelect = React.useCallback(() => {
    onOpen(region);
  }, [onOpen, region]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<SVGPolygonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelect();
      }
    },
    [handleSelect],
  );

  return (
    <g
      className="origin-bottom"
      style={{
        transformBox: "fill-box",
        transformOrigin: "center bottom",
      }}
    >
      <polygon
        points={points}
        className="cursor-pointer outline-none"
        fill="transparent"
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.name}`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
      />
    </g>
  );
});

function ExperienceDialog({
  project,
  region,
  onClose,
}: {
  project: Project;
  region: BuildingRegion;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/24 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-dialog-title"
      onClick={onClose}
    >
      <article
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)]"
        style={{
          animation:
            "experience-dialog-in 220ms cubic-bezier(0.22,1,0.36,1) both",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/38">
              {region.label}
            </p>
            <h3
              id="experience-dialog-title"
              className="mt-2 font-['Bebas_Neue'] text-5xl font-normal uppercase leading-none text-black"
            >
              {project.name}
            </h3>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full border border-black/10 text-lg leading-none text-black/60 transition-opacity hover:opacity-60"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="mt-4 text-sm font-semibold leading-6 text-black/62">
          Dialog content for this project can be designed next.
        </p>
      </article>

      <style>{`
        @keyframes experience-dialog-in {
          from {
            opacity: 0;
            transform: translate3d(0, 12px, 0) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
