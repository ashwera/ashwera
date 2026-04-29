import React from "react";
import { motion } from "framer-motion";

type Achievement = {
  title: string;
  description: string;
};

const achievements: Achievement[] = [
  {
    title: "BRAND & CREATIVE",
    description:
      "We find your truth. Then define your brand identity and creative structure.",
  },
  {
    title: "CAMPAIGN & FILM",
    description:
      "We tell stories that connect emotionally and perform commercially.",
  },
  {
    title: "DIGITAL PRODUCT",
    description:
      "We shape useful systems with sharp interfaces and measurable outcomes.",
  },
];

const accents = [
  "bg-[#151515] text-white",
  "bg-[#f4f0e8] text-black",
  "bg-[#253447] text-white",
];

export default function AchievementsSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const showPrevious = () => {
    setActiveIndex((index) =>
      index === 0 ? achievements.length - 1 : index - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % achievements.length);
  };

  return (
    <section className="relative w-full overflow-hidden px-4 py-20 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/42">
            Recognition
          </p>
          <h2 className="mt-1 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-8xl lg:text-8.5xl">
            Achievements & <br /> Recognition
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed tracking-[0.01em] text-black/70 sm:text-lg">
            Still learning, always shipping.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.55,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mt-12 flex w-full max-w-5xl items-center justify-center"
        >
          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-0 z-30 grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/55 text-xl leading-none text-black/70 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur transition hover:bg-white hover:text-black sm:left-6"
            aria-label="Previous achievement"
          >
            ‹
          </button>

          <div className="relative mx-auto flex h-[380px] w-full max-w-[820px] items-center justify-center">
            {achievements.map((achievement, index) => {
              const position =
                (index - activeIndex + achievements.length) %
                achievements.length;
              const isFront = position === 0;
              const stackPosition = position > 2 ? -1 : position;

              return (
                <AchievementCard
                  key={achievement.title}
                  achievement={achievement}
                  index={index}
                  stackPosition={stackPosition}
                  isFront={isFront}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={showNext}
            className="absolute right-0 z-30 grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/55 text-xl leading-none text-black/70 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur transition hover:bg-white hover:text-black sm:right-6"
            aria-label="Next achievement"
          >
            ›
          </button>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {achievements.map((achievement, index) => (
            <button
              key={achievement.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-7 bg-black"
                  : "w-2.5 bg-black/22 hover:bg-black/38"
              }`}
              aria-label={`Show achievement ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementCard({
  achievement,
  index,
  stackPosition,
  isFront,
}: {
  achievement: Achievement;
  index: number;
  stackPosition: number;
  isFront: boolean;
}) {
  const visiblePosition = stackPosition < 0 ? 2 : stackPosition;
  const y = visiblePosition * 22;
  const scale = visiblePosition === 0 ? 1 : visiblePosition === 1 ? 0.95 : 0.9;
  const opacity =
    visiblePosition === 0 ? 1 : visiblePosition === 1 ? 0.72 : 0.42;

  return (
    <motion.article
      className={`absolute left-1/2 top-1/2 flex min-h-[280px] w-[min(88vw,760px)] -translate-x-1/2 -translate-y-1/2 flex-col justify-between overflow-hidden rounded-[22px] border border-black/10 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.18)] will-change-transform sm:p-10 md:min-h-[360px] md:w-[min(76vw,820px)] ${
        accents[index % accents.length]
      }`}
      animate={{
        x: "-50%",
        y: `calc(-50% + ${y}px)`,
        scale,
        opacity,
        zIndex: achievements.length - visiblePosition,
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!isFront}
    >
      <span className="text-xs font-bold uppercase tracking-[0.28em] opacity-55">
        0{index + 1}
      </span>
      <div>
        <h3 className="font-['Bebas_Neue'] text-5xl font-normal uppercase leading-none sm:text-7xl md:text-8xl">
          {achievement.title}
        </h3>
        <p className="mt-5 max-w-xl text-base font-semibold leading-7 opacity-70 sm:text-xl">
          {achievement.description}
        </p>
      </div>
    </motion.article>
  );
}
