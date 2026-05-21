import React from "react";
import { motion } from "framer-motion";

type ResumeExperience = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
};

type ParsedExperience = ResumeExperience & {
  logo: string;
  impact: string;
  sortDate: number;
};

const resumeExperience: ResumeExperience[] = [
  {
    role: "KJSCE CodeCell Member",
    company: "K.J. Somaiya College of Engineering",
    dates: "Oct 2024 - Present",
    bullets: [
      "Co-leading flagship events for 500+ students to foster Competitive Programming and Open Source culture.",
      "Assisting in problem-setting and technical testing for ICPC-style contests using C++.",
    ],
  },
  {
    role: "AI Content Engineer & SEO Strategist",
    company: "Freelance",
    dates: "Nov 2019 - Present",
    bullets: [
      "Engineered automated content workflows by fine-tuning LLMs using brand-specific datasets to generate consistent, scalable, and on-brand copy.",
      "Developed and optimized prompt engineering frameworks to minimize model hallucination and ensure high-accuracy technical and marketing outputs.",
    ],
  },
  {
    role: "Technology Intern",
    company: "Formial Labs",
    dates: "May 2026 – Present",
    bullets: [
      "Built D2C storefront features, subscription flows, and custom integrations using Shopify, Razorpay, and REST APIs.",
      "Implemented analytics and tracking infrastructure using GA4, GTM, and Meta Pixel for performance monitoring.",
    ],
  },
];

const monthRank: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function parseResumeExperience(source: ResumeExperience[]): ParsedExperience[] {
  return source
    .map((item) => ({
      ...item,
      logo: buildLogo(item.company),
      impact: toProductImpact(item.bullets),
      sortDate: parseSortDate(item.dates),
    }))
    .sort((a, b) => b.sortDate - a.sortDate);
}

function buildLogo(company: string) {
  const words = company.replace(/[^a-zA-Z0-9 /&-]/g, "").split(/\s+|\/|&/);
  const initials = words
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return initials || "AH";
}

function toProductImpact(bullets: string[]) {
  const text = bullets.slice(0, 1).map(polishImpactStatement).join(" ");
  return text;
}

function polishImpactStatement(bullet: string) {
  return bullet
    .replace(/^Co-leading/i, "Co-led")
    .replace(/^Assisting/i, "Supported")
    .replace(/^Engineered/i, "Built")
    .replace(/^Developed and optimized/i, "Designed")
    .replace(/\.$/, "")
    .trim();
}

function parseSortDate(dates: string) {
  const matches = [...dates.matchAll(/([A-Za-z]{3,9})?\s*(20\d{2})/g)];
  const start = matches.at(0);
  const end = /present/i.test(dates) ? undefined : matches.at(-1);

  if (!start) {
    return 0;
  }

  const startMonth = start[1]
    ? (monthRank[start[1].slice(0, 3).toLowerCase()] ?? 11)
    : 11;
  const startValue = Number(start[2]) * 12 + startMonth;

  if (!end) {
    return Number.MAX_SAFE_INTEGER - (10_000 - startValue);
  }

  const endMonth = end[1]
    ? (monthRank[end[1].slice(0, 3).toLowerCase()] ?? 11)
    : 11;

  return Number(end[2]) * 12 + endMonth;
}

export default function ExperienceSection() {
  const experiences = React.useMemo(
    () => parseResumeExperience(resumeExperience),
    [],
  );

  const sectionRef = React.useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-16 text-black sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* heading section - refined and minimal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="mt-1 font-['Bebas_Neue'] text-6xl sm:text-7xl lg:text-8xl font-normal uppercase leading-none text-black">
            Experience
          </h2>
        </motion.div>

        {/* timeline container - desktop premium layout */}
        <div className="hidden md:block relative">
          {/* vertical timeline line - truly centered */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black -translate-x-1/2" />

          {/* timeline dots and content */}
          <div className="space-y-16 relative">
            {experiences.map((experience, index) => (
              <TimelineItemDesktop
                key={`${experience.role}-${experience.company}`}
                experience={experience}
                index={index}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* mobile timeline */}
        <div className="md:hidden space-y-6 relative pl-6">
          {/* vertical timeline line */}
          <div className="absolute left-1.5 top-0 bottom-0 w-px bg-black" />

          {experiences.map((experience, index) => (
            <TimelineItemMobile
              key={`${experience.role}-${experience.company}`}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItemDesktop({
  experience,
  index,
  isEven,
}: {
  experience: ParsedExperience;
  index: number;
  isEven: boolean;
}) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.56,
        delay: index * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative grid grid-cols-[1fr_64px_1fr] gap-6 lg:gap-10 items-stretch"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* left content (dates if even, details if odd) */}
      <div className="flex justify-end items-center">
        {isEven ? (
          <div className="text-right max-w-xs pr-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50 mb-2">
              Timeline
            </p>
            <p className="text-sm font-medium text-black/70">
              {experience.dates}
            </p>
          </div>
        ) : (
          <div className="text-right max-w-xs pr-6">
            <h3 className="text-lg sm:text-xl font-bold leading-tight text-black mb-1.5 tracking-tight">
              {experience.role}
            </h3>
            <p className="text-sm font-semibold text-black/60 mb-3">
              {experience.company}
            </p>
            <p className="text-sm leading-6 text-black/55">
              {experience.impact}
            </p>
          </div>
        )}
      </div>

      {/* center node with motion */}
      <div className="flex justify-center items-center relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{
            delay: index * 0.14 + 0.28,
            duration: 0.4,
            ease: "easeOut",
          }}
          className="relative z-10"
        >
          {/* inner dot - solid black */}
          <div className="w-4 h-4 rounded-full bg-black relative z-20 shadow-[0_2px_8px_rgba(0,0,0,0.12)]" />
        </motion.div>
      </div>

      {/* right content (details if even, dates if odd) */}
      <div className="flex justify-start items-center group">
        {isEven ? (
          <motion.div
            className="max-w-xs pl-6 relative"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h3 className="text-lg sm:text-xl font-bold leading-tight text-black mb-1.5 tracking-tight">
              {experience.role}
            </h3>
            <p className="text-sm font-semibold text-black/60 mb-3">
              {experience.company}
            </p>
            <p className="text-sm leading-6 text-black/55">
              {experience.impact}
            </p>
          </motion.div>
        ) : (
          <div className="text-left max-w-xs pl-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50 mb-2">
              Timeline
            </p>
            <p className="text-sm font-medium text-black/70">
              {experience.dates}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TimelineItemMobile({
  experience,
  index,
}: {
  experience: ParsedExperience;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.48,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative pl-6"
    >
      {/* timeline marker */}
      <div className="absolute -left-3.5 top-1 w-3 h-3 rounded-full bg-black shadow-[0_2px_6px_rgba(0,0,0,0.12)]" />

      {/* content card - premium subtle styling */}
      <div className="rounded-lg border border-black/[0.04] bg-white/60 p-4 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50 mb-2">
          {experience.dates}
        </p>
        <h3 className="text-base font-bold text-black mb-1 leading-tight">
          {experience.role}
        </h3>
        <p className="text-sm font-semibold text-black/60 mb-2.5">
          {experience.company}
        </p>
        <p className="text-sm leading-5 text-black/55">{experience.impact}</p>
      </div>
    </motion.div>
  );
}
