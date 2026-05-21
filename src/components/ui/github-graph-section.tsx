import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const username = "ashwera";

type HeatmapEntry = {
  date: string;
  count: number;
};

type HeatmapPanel = {
  platform: string;
  accent: string;
  colorScale: string[];
  emptyCell: string;
  loadEntries: () => Promise<HeatmapEntry[]>;
};

/* ── tonal color scales derived from site palette ──────────────── */

const panels: HeatmapPanel[] = [
  {
    platform: "LeetCode",
    accent: "#d9a2a0",
    colorScale: [
      "rgba(217,162,160,0.38)",
      "rgba(217,162,160,0.56)",
      "rgba(196,120,116,0.72)",
      "rgba(180,90,84,0.92)",
      "rgba(164,68,62,1)",
    ],
    emptyCell: "rgba(217,162,160,0.08)",
    loadEntries: loadLeetcodeHeatmap,
  },
  {
    platform: "GitHub",
    accent: "#b45a54",
    colorScale: [
      "rgba(180,90,84,0.36)",
      "rgba(180,90,84,0.52)",
      "rgba(164,68,62,0.68)",
      "rgba(148,52,46,0.86)",
      "rgba(132,40,34,1)",
    ],
    emptyCell: "rgba(180,90,84,0.08)",
    loadEntries: loadGitHubFallbackHeatmap,
  },
  {
    platform: "Codeforces",
    accent: "#6f95c7",
    colorScale: [
      "rgba(111,149,199,0.36)",
      "rgba(111,149,199,0.52)",
      "rgba(90,130,185,0.68)",
      "rgba(72,112,170,0.86)",
      "rgba(56,96,156,1)",
    ],
    emptyCell: "rgba(0,0,0,0.06)",
    loadEntries: loadCodeforcesHeatmap,
  },
];

/* ── main section (scroll choreography preserved) ──────────────── */

export default function GithubGraphSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const githubX = useTransform(scrollYProgress, [0.18, 0.46], ["112%", "0%"]);
  const githubRotate = useTransform(scrollYProgress, [0.18, 0.46], [6, 0]);
  const codeforcesX = useTransform(
    scrollYProgress,
    [0.54, 0.82],
    ["112%", "0%"],
  );
  const codeforcesRotate = useTransform(scrollYProgress, [0.54, 0.82], [6, 0]);
  const leetcodeScale = useTransform(scrollYProgress, [0, 0.46], [1, 0.965]);
  const githubScale = useTransform(scrollYProgress, [0.18, 0.82], [1, 0.975]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] w-full px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.04] via-white to-white" />
        <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-black/[0.04] blur-[120px]" />
      </div>
      <div className="sticky top-0 flex min-h-screen items-center overflow-visible py-12">
        <div className="w-full max-w-none">
          {/* ── section header ── */}
          <div className="mb-1">
            <h2 className="mt-1 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl lg:text-8xl">
              Heatmaps
            </h2>
          </div>

          {/* ── stacked heatmap cards ── */}
          <div className="relative h-[360px] w-full sm:h-[440px]">
            <motion.div
              className="absolute inset-0 z-10"
              style={{ scale: leetcodeScale }}
            >
              <HeatmapCard panel={panels[0]} />
            </motion.div>
            <motion.div
              className="absolute inset-0 z-20"
              style={{ x: githubX, rotate: githubRotate, scale: githubScale }}
            >
              <HeatmapCard panel={panels[1]} />
            </motion.div>
            <motion.div
              className="absolute inset-0 z-30"
              style={{ x: codeforcesX, rotate: codeforcesRotate }}
            >
              <HeatmapCard panel={panels[2]} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── heatmap card ──────────────────────────────────────────────── */

function HeatmapCard({ panel }: { panel: HeatmapPanel }) {
  const [entries, setEntries] = React.useState<HeatmapEntry[]>(() =>
    buildFallbackHeatmap(panel.platform),
  );
  const [isLoaded, setIsLoaded] = React.useState(false);
  const totalCount = React.useMemo(
    () => entries.reduce((sum, entry) => sum + entry.count, 0),
    [entries],
  );

  React.useEffect(() => {
    let active = true;

    panel
      .loadEntries()
      .then((nextEntries) => {
        if (active && nextEntries.length > 0) {
          setEntries(nextEntries);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [panel]);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-start justify-center pt-2 sm:pt-3"
      style={
        {
          // GitHub-like proportions: ~12px cells, ~4px gaps at ~844px width
          // Clamp keeps the grid responsive without over-scaling on wide screens.
          "--heatmap-cell": "clamp(11px, 1.75vw, 15px)",
          "--heatmap-gap": "clamp(3px, 0.75vw, 6px)",
        } as React.CSSProperties
      }
    >
      <div className="w-full max-w-[940px] rounded-2xl bg-[#fdfdfd] px-4 py-4 shadow-none border border-black/[0.06] sm:px-6 sm:py-5 isolate">
        <div className="mb-3 flex items-center justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/50">
            {panel.platform}
          </p>
        </div>
        <HeatmapGrid
          entries={entries}
          colorScale={panel.colorScale}
          emptyCell={panel.emptyCell}
          isLoaded={isLoaded}
          accent={panel.accent}
        />
        <p className="mt-3 text-right text-[11px] font-medium uppercase tracking-[0.18em] text-black/40">
          {totalCount.toLocaleString("en-US")} submissions this year
        </p>
      </div>
    </div>
  );
}

/* ── heatmap grid (GitHub-style layout) ──────────────────────────── */

function HeatmapGrid({
  entries,
  colorScale,
  emptyCell,
  isLoaded,
  accent,
}: {
  entries: HeatmapEntry[];
  colorScale: string[];
  emptyCell: string;
  isLoaded: boolean;
  accent: string;
}) {
  const maxCount = Math.max(1, ...entries.map((entry) => entry.count));
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const labels = monthLabels(entries);

  return (
    <div className="mx-auto w-full max-w-[940px]">
      <div
        className="mb-2 grid"
        style={{
          gridTemplateColumns: "repeat(52, minmax(0, var(--heatmap-cell)))",
          columnGap: "var(--heatmap-gap)",
        }}
      >
        {labels.map((label) => (
          <span
            key={`${label.month}-${label.column}`}
            className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/40"
            style={{ gridColumnStart: label.column + 1 }}
          >
            {label.month}
          </span>
        ))}
      </div>
      {/* GitHub-like grid: 7 rows (days) × 24 columns (weeks) */}
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: "repeat(52, minmax(0, var(--heatmap-cell)))",
          gap: "var(--heatmap-gap)",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {Array.from({ length: 52 }).map((_, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-rows-7"
            style={{ gap: "var(--heatmap-gap)" }}
          >
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const cellIndex = weekIndex * 7 + dayIndex;
              const entry = entries[cellIndex];

              if (!entry) return null;

              const level = intensityLevel(entry.count, maxCount);
              const bg = level === 0 ? emptyCell : colorScale[level - 1];
              const isHovered = hoveredIndex === cellIndex;
              const animationDelay = isLoaded
                ? weekIndex * 8 + dayIndex * 4
                : 0;

              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className="relative aspect-square cursor-pointer rounded-sm transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: bg,
                    opacity: isLoaded ? 1 : 0,
                    width: "var(--heatmap-cell)",
                    height: "var(--heatmap-cell)",
                  }}
                  initial={isLoaded ? { scale: 0.6, opacity: 0 } : undefined}
                  animate={isLoaded ? { scale: 1, opacity: 1 } : undefined}
                  transition={{
                    duration: 0.42,
                    delay: animationDelay / 1000,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setHoveredIndex(cellIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{
                    boxShadow: `0 0 16px ${accent}40, 0 0 6px ${accent}20`,
                    y: -1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── data loaders (preserved) ──────────────────────────────────── */

async function loadCodeforcesHeatmap() {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`,
  );
  const payload = await response.json();

  if (payload.status !== "OK" || !Array.isArray(payload.result)) {
    return [];
  }

  const counts = new Map<string, number>();

  payload.result.forEach((submission: { creationTimeSeconds?: number }) => {
    if (!submission.creationTimeSeconds) {
      return;
    }

    const key = toDateKey(new Date(submission.creationTimeSeconds * 1000));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return buildHeatmapFromCounts(counts);
}

async function loadLeetcodeHeatmap() {
  const response = await fetch(
    `https://leetcode-api-faisalshohag.vercel.app/${username}`,
  );
  const payload = await response.json();
  const calendar = payload.submissionCalendar;

  if (!calendar) {
    return [];
  }

  const parsedCalendar =
    typeof calendar === "string" ? JSON.parse(calendar) : calendar;
  const counts = new Map<string, number>();

  Object.entries(parsedCalendar as Record<string, number>).forEach(
    ([timestamp, count]) => {
      const seconds = Number(timestamp);
      if (!Number.isFinite(seconds)) {
        return;
      }

      counts.set(toDateKey(new Date(seconds * 1000)), Number(count) || 0);
    },
  );

  return buildHeatmapFromCounts(counts);
}

async function loadGitHubFallbackHeatmap() {
  return buildFallbackHeatmap("GitHub");
}

/* ── helpers (preserved) ───────────────────────────────────────── */

function buildHeatmapFromCounts(counts: Map<string, number>) {
  return heatmapDates().map((date) => ({
    date,
    count: counts.get(date) ?? 0,
  }));
}

function buildFallbackHeatmap(seed: string) {
  const seedValue = seed
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return heatmapDates().map((date, index) => {
    const wave = Math.sin((index + seedValue) * 0.42);
    const pulse = (index * 17 + seedValue) % 11;
    const active = wave > 0.08 || pulse > 7;

    return {
      date,
      count: active ? Math.max(1, Math.round((wave + 1) * 2 + (pulse % 3))) : 0,
    };
  });
}

function heatmapDates() {
  const dates: string[] = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 7 * 52 + 1);

  for (let day = 0; day < 7 * 52; day += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + day);
    dates.push(toDateKey(date));
  }

  return dates;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function intensityLevel(count: number, maxCount: number): number {
  if (count <= 0) return 0;
  const ratio = Math.min(1, count / maxCount);
  if (ratio < 0.15) return 1;
  if (ratio < 0.35) return 2;
  if (ratio < 0.55) return 3;
  if (ratio < 0.75) return 4;
  return 5;
}

function monthLabels(entries: HeatmapEntry[]) {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const labels: { month: string; column: number }[] = [];
  let previousMonth = "";

  entries.forEach((entry, index) => {
    if (index % 7 !== 0) return;

    const date = new Date(`${entry.date}T00:00:00`);
    const month = formatter.format(date);

    if (month !== previousMonth) {
      labels.push({ month, column: Math.floor(index / 7) });
      previousMonth = month;
    }
  });

  return labels;
}
