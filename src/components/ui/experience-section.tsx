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
      "Co-leading flagship events for 500+ freshmen to foster Competitive Programming and Open Source culture.",
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
  const text = bullets.slice(0, 2).map(polishImpactStatement).join(" ");

  return text;
}

function polishImpactStatement(bullet: string) {
  return bullet
    .replace(/^Co-leading/i, "Co-led")
    .replace(/^Assisting/i, "Supported")
    .replace(/^Engineered/i, "Built")
    .replace(/^Developed and optimized/i, "Designed")
    .replace(/\.$/, ".")
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

  return (
    <section
      className="w-full overflow-hidden px-4 py-14 text-black sm:px-6 sm:py-18 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-18% 0px" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl"
        >
          Experience
        </motion.h2>

        <div className="space-y-1.5">
          {experiences.map((experience, index) => (
            <ExperienceItem
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

export function ExperienceItem({
  experience,
  index,
}: {
  experience: ParsedExperience;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{
        duration: 0.36,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group grid gap-3 rounded-xl border border-transparent px-2 py-3 transition duration-300 ease-out hover:scale-[1.01] hover:border-black/[0.05] hover:bg-white/55 sm:grid-cols-[minmax(320px,0.62fr)_1fr] sm:gap-10 sm:px-3 sm:py-4 lg:grid-cols-[minmax(380px,0.55fr)_1fr] lg:gap-16"
    >
      <div className="flex gap-3">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-black/12 via-white to-[#6f95c7]/24 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition duration-300 group-hover:shadow-[0_0_22px_rgba(111,149,199,0.22)]">
          <div className="grid h-full w-full place-items-center rounded-xl bg-[#f7f7f5] text-xs font-bold text-black/75">
            {experience.logo}
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold leading-5 tracking-normal text-black sm:text-base">
            {experience.role}
          </h3>
          <p className="mt-0.5 text-sm font-medium leading-5 text-black/45">
            {experience.company}
          </p>
          <p className="text-sm font-medium leading-5 text-black/35">
            {experience.dates}
          </p>
        </div>
      </div>

      <p className="text-[15px] leading-6 text-black/58 sm:pt-0.5">
        {experience.impact}
      </p>
    </motion.article>
  );
}
