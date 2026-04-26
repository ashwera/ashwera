import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const username = "ashwera";

type HeatmapEntry = {
  date: string;
  count: number;
};

type HeatmapPanel = {
  platform: string;
  title: string;
  href: string;
  accent: string;
  loadEntries: () => Promise<HeatmapEntry[]>;
};

const panels: HeatmapPanel[] = [
  {
    platform: "LeetCode",
    title: "Practice Heatmap",
    href: `https://leetcode.com/${username}`,
    accent: "#d9a2a0",
    loadEntries: loadLeetcodeHeatmap,
  },
  {
    platform: "GitHub",
    title: "Commit Heatmap",
    href: `https://github.com/${username}`,
    accent: "#b45a54",
    loadEntries: loadGitHubFallbackHeatmap,
  },
  {
    platform: "Codeforces",
    title: "Submission Heatmap",
    href: `https://codeforces.com/profile/${username}`,
    accent: "#6f95c7",
    loadEntries: loadCodeforcesHeatmap,
  },
];

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
      <div className="sticky top-0 flex min-h-screen items-center overflow-visible py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-1 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="mt-1 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl">
                The Grind
              </h2>
            </div>

            <div className="flex gap-2" aria-hidden="true">
              {panels.map((panel) => (
                <span
                  key={panel.platform}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: panel.accent }}
                />
              ))}
            </div>
          </div>

          <div className="relative h-[280px] sm:h-[300px]">
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

function HeatmapCard({ panel }: { panel: HeatmapPanel }) {
  const [entries, setEntries] = React.useState<HeatmapEntry[]>(() =>
    buildFallbackHeatmap(panel.platform),
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
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [panel]);

  return (
    <div className="group relative h-full overflow-visible after:pointer-events-none after:absolute after:inset-x-8 after:-bottom-36 after:z-0 after:h-80 after:bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.20),rgba(0,0,0,0.09)_44%,rgba(0,0,0,0)_78%)] after:blur-3xl after:content-['']">
      <a
        href={panel.href}
        target="_blank"
        rel="noreferrer"
        className="relative z-10 block h-full overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0f1116] p-3 shadow-[0_34px_96px_rgba(0,0,0,0.14),0_72px_190px_rgba(0,0,0,0.08),0_128px_280px_rgba(0,0,0,0.045)] transition duration-300 hover:-translate-y-1 sm:p-5"
      >
        <div className="relative z-10 mb-3 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#f5f5f5]">
            {username}
          </p>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: panel.accent }}
            />
            <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#f5f5f5]">
              {panel.platform}
            </p>
          </div>
        </div>

        <div className="relative z-10 grid h-[220px] place-items-center overflow-visible rounded-2xl border border-white/[0.07] bg-[#0b0d12] px-4 pb-7 pt-5 shadow-[inset_0_-40px_80px_rgba(255,255,255,0.025)] sm:h-[232px]">
          <HeatmapGrid entries={entries} />
        </div>
      </a>
    </div>
  );
}

function HeatmapGrid({ entries }: { entries: HeatmapEntry[] }) {
  const maxCount = Math.max(1, ...entries.map((entry) => entry.count));
  const labels = monthLabels(entries);

  return (
    <div className="w-full">
      <div className="mb-2 grid grid-cols-[repeat(24,minmax(0,1fr))] text-xs font-semibold uppercase tracking-[0.05em] text-[#cccccc]">
        {labels.map((label) => (
          <span
            key={`${label.month}-${label.column}`}
            className="col-span-1"
            style={{ gridColumnStart: label.column + 1 }}
          >
            {label.month}
          </span>
        ))}
      </div>
      <div className="grid h-[120px] grid-cols-[repeat(24,minmax(0,1fr))] grid-rows-[repeat(7,minmax(0,1fr))] gap-1 overflow-hidden sm:h-[128px]">
        {entries.map((entry) => (
          <span
            key={entry.date}
            title={`${entry.date}: ${entry.count}`}
            className="h-full w-full rounded-[4px] border border-white/[0.04]"
            style={{ backgroundColor: heatColor(entry.count, maxCount) }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.05em] text-[#cccccc]">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className="h-3 w-3 rounded-[3px] border border-white/[0.03]"
              style={{ backgroundColor: heatColor(level, 4) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

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
  start.setDate(today.getDate() - 7 * 24 + 1);

  for (let day = 0; day < 7 * 24; day += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + day);
    dates.push(toDateKey(date));
  }

  return dates;
}

function monthLabels(entries: HeatmapEntry[]) {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const labels: { month: string; column: number }[] = [];
  let previousMonth = "";

  entries.forEach((entry, index) => {
    if (index % 7 !== 0) {
      return;
    }

    const date = new Date(`${entry.date}T00:00:00`);
    const month = formatter.format(date);

    if (month !== previousMonth) {
      labels.push({ month, column: Math.floor(index / 7) });
      previousMonth = month;
    }
  });

  return labels;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function heatColor(count: number, maxCount: number) {
  if (count <= 0) {
    return "#24222b";
  }

  const ratio = Math.min(1, count / maxCount);
  if (ratio < 0.25) {
    return "#4b3d58";
  }
  if (ratio < 0.5) {
    return "#864b62";
  }
  if (ratio < 0.75) {
    return "#bd5f5a";
  }
  return "#6f95c7";
}
