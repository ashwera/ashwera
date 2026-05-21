import React from "react";

/* ─────────────────────────────────────────────
   Achievement Data
   ───────────────────────────────────────────── */

type Achievement = {
  title: string;
  organization: string;
  highlight: string;
  description: string;
  featured: boolean;
};

const achievements: Achievement[] = [
  {
    title: "AlgoUniversity Tech Fellowship 2025",
    organization: "AlgoUniversity",
    highlight: "Top 0.2%",
    description:
      "Selected among 250,000+ applicants nationwide for the elite technical fellowship program.",
    featured: true,
  },
  {
    title: "IET India Scholarship Award",
    organization: "Institution of Engineering & Technology",
    highlight: "Top 150",
    description:
      "National Finalist selected from 44,000+ applicants across India.",
    featured: true,
  },
  {
    title: "Datathon 24-Hr Hackathon",
    organization: "Datathon",
    highlight: "1st Runner-Up",
    description:
      "Built Decay-AI and secured runner-up position among 100+ competing teams.",
    featured: true,
  },
  {
    title: "Competitive Programming",
    organization: "Codeforces • LeetCode • CSES",
    highlight: "900+ Problems",
    description:
      "Solved algorithmic and data structure problems across multiple competitive programming platforms.",
    featured: false,
  },
  {
    title: "SPIT Codebuster Contest",
    organization: "SPIT Mumbai",
    highlight: "4th Position",
    description:
      "Secured top rank in a city-wide competitive programming contest.",
    featured: false,
  },
];

/* ─────────────────────────────────────────────
   Accent palette – site-native warm/cool tones
   ───────────────────────────────────────────── */

const cardAccents = [
  { bg: "#151515", text: "#ffffff", stat: "#d9a2a0" },   // dark slab, warm rose stat
  { bg: "#253447", text: "#ffffff", stat: "#6f95c7" },   // deep navy, cool blue stat
  { bg: "#f4f0e8", text: "#0a0a0a", stat: "#b45a54" },   // warm beige, editorial red stat
  { bg: "#1a1a1a", text: "#ffffff", stat: "#c78d6f" },   // charcoal, amber stat
  { bg: "#2a2018", text: "#ffffff", stat: "#d9a2a0" },   // dark umber, rose stat
];

/* ─────────────────────────────────────────────
   CSS (injected once)
   ───────────────────────────────────────────── */

const STYLE_ID = "achievements-drift-css";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* ── Drift Keyframes (GPU-only) ── */
    @keyframes drift-up {
      0%   { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(0, -50%, 0); }
    }
    @keyframes drift-down {
      0%   { transform: translate3d(0, -50%, 0); }
      100% { transform: translate3d(0, 0, 0); }
    }

    /* ── Section ── */
    .ach-section {
      position: relative;
      overflow: hidden;
      background: var(--paper, #efefee);
    }

    /* ── Layout Grid ── */
    .ach-layout {
      display: grid;
      grid-template-columns: 1fr;
      min-height: 100vh;
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 24px 80px;
      gap: 40px;
      align-items: center;
    }
    @media (min-width: 769px) {
      .ach-layout {
        grid-template-columns: 380px 1fr;
        padding: 80px 40px;
        gap: 56px;
      }
    }
    @media (min-width: 1024px) {
      .ach-layout {
        grid-template-columns: 420px 1fr;
        padding: 80px 56px;
        gap: 72px;
      }
    }

    /* ── Editorial Left ── */
    .ach-editorial {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    @media (min-width: 769px) {
      .ach-editorial {
        position: sticky;
        top: 20vh;
        padding-right: 16px;
      }
    }
    .ach-editorial__heading {
      font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
      font-weight: 400;
      font-size: clamp(3rem, 5.5vw, 5.2rem);
      line-height: 0.92;
      letter-spacing: -0.02em;
      color: var(--ink, #060606);
      margin: 0 0 20px;
    }
    .ach-editorial__desc {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.75;
      color: rgba(6, 6, 6, 0.5);
      max-width: 320px;
    }

    /* ── Drift Wall ── */
    .drift-wall {
      height: 72vh;
      min-height: 480px;
      max-height: 780px;
      overflow: hidden;
      position: relative;
      mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 10%,
        black 90%,
        transparent 100%
      );
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 10%,
        black 90%,
        transparent 100%
      );
    }
    @media (max-width: 768px) {
      .drift-wall {
        height: 55vh;
        min-height: 380px;
        max-height: 560px;
      }
    }
    .drift-wall__inner {
      display: flex;
      gap: 16px;
      height: 100%;
      align-items: flex-start;
    }
    @media (min-width: 769px) {
      .drift-wall__inner { gap: 20px; }
    }

    /* ── Columns ── */
    .drift-col { flex: 1; will-change: transform; }
    .drift-col__track {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    @media (min-width: 769px) {
      .drift-col__track { gap: 20px; }
    }
    .drift-col--up .drift-col__track {
      animation: drift-up 50s linear infinite;
    }
    .drift-col--down .drift-col__track {
      animation: drift-down 58s linear infinite;
    }
    .drift-wall:hover .drift-col__track {
      animation-play-state: paused;
    }

    /* ── Card ── */
    .ach-card {
      position: relative;
      border-radius: 14px;
      padding: 24px 20px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.06);
      transition:
        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    }
    .ach-card--featured {
      padding: 30px 24px;
    }
    .ach-card:hover {
      transform: translateY(-4px) scale(1.012);
      box-shadow: 0 16px 56px rgba(0,0,0,0.10);
    }

    /* Card stat */
    .ach-card__stat {
      font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
      font-weight: 400;
      line-height: 1;
      letter-spacing: -0.01em;
      margin-bottom: 6px;
    }
    .ach-card__stat--lg { font-size: clamp(2rem, 3.5vw, 2.6rem); }
    .ach-card__stat--sm { font-size: clamp(1.6rem, 2.8vw, 2rem); }

    /* Card title */
    .ach-card__title {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: -0.005em;
      line-height: 1.35;
      margin-bottom: 3px;
    }

    /* Card org */
    .ach-card__org {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      opacity: 0.4;
    }

    /* Card description */
    .ach-card__desc {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 400;
      line-height: 1.55;
      opacity: 0.35;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid currentColor;
      border-top-color: inherit;
    }
    /* border color inherits from card palette */
    .ach-card--light .ach-card__desc { border-top-color: rgba(0,0,0,0.06); }
    .ach-card--dark  .ach-card__desc { border-top-color: rgba(255,255,255,0.06); }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .ach-card { padding: 18px 16px; border-radius: 12px; }
      .ach-card--featured { padding: 22px 18px; }
      .ach-card__stat--lg { font-size: 1.7rem; }
      .ach-card__stat--sm { font-size: 1.4rem; }
      .drift-col--up .drift-col__track { animation-duration: 58s; }
      .drift-col--down .drift-col__track { animation-duration: 66s; }
    }

    @media (prefers-reduced-motion: reduce) {
      .drift-col__track { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   Achievement Card
   ───────────────────────────────────────────── */

const AchCard = React.memo(function AchCard({
  data,
  index,
}: {
  data: Achievement;
  index: number;
}) {
  const palette = cardAccents[index % cardAccents.length];
  const isLight = palette.bg === "#f4f0e8";
  const themeClass = isLight ? "ach-card--light" : "ach-card--dark";

  return (
    <article
      className={`ach-card ${themeClass}${data.featured ? " ach-card--featured" : ""}`}
      style={{
        background: palette.bg,
        color: palette.text,
      }}
    >
      <div
        className={`ach-card__stat ${data.featured ? "ach-card__stat--lg" : "ach-card__stat--sm"}`}
        style={{ color: palette.stat }}
      >
        {data.highlight}
      </div>

      <div className="ach-card__title">{data.title}</div>
      <div className="ach-card__org">{data.organization}</div>

      {data.description && (
        <div className="ach-card__desc">{data.description}</div>
      )}
    </article>
  );
});

/* ─────────────────────────────────────────────
   Drift Column (duplicated for seamless loop)
   ───────────────────────────────────────────── */

const DriftColumn = React.memo(function DriftColumn({
  items,
  indices,
  direction,
}: {
  items: Achievement[];
  indices: number[];
  direction: "up" | "down";
}) {
  const cards = items.map((item, i) => (
    <AchCard key={i} data={item} index={indices[i]} />
  ));
  const dupes = items.map((item, i) => (
    <AchCard key={`d${i}`} data={item} index={indices[i]} />
  ));

  return (
    <div className={`drift-col drift-col--${direction}`}>
      <div className="drift-col__track">
        {cards}
        {dupes}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */

export default function AchievementsSection() {
  React.useEffect(() => {
    injectStyles();
  }, []);

  // Col 1 (up):   indices 0, 2, 4
  // Col 2 (down): indices 1, 3
  const col1 = React.useMemo(() => achievements.filter((_, i) => i % 2 === 0), []);
  const col2 = React.useMemo(() => achievements.filter((_, i) => i % 2 === 1), []);
  const idx1 = React.useMemo(() => [0, 2, 4], []);
  const idx2 = React.useMemo(() => [1, 3], []);

  return (
    <section className="ach-section" aria-label="Achievements and recognition">
      <div className="ach-layout">
        {/* ── LEFT: Editorial ── */}
        <div className="ach-editorial">
          <h2 className="ach-editorial__heading">
            Achievements &amp;
            <br />
            Recognition
          </h2>

          <p className="ach-editorial__desc">
            All that I've gained so far, miles to go.
          </p>
        </div>

        {/* ── RIGHT: Drifting Masonry ── */}
        <div className="drift-wall">
          <div className="drift-wall__inner">
            <DriftColumn items={col1} indices={idx1} direction="up" />
            <DriftColumn items={col2} indices={idx2} direction="down" />
          </div>
        </div>
      </div>
    </section>
  );
}
