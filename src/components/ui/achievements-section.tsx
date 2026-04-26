import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const introCopy = "saregamapadhanisa";

const rotations = [-6, 5, -4];
const landings = [
  { x: "-5%", y: 0, rotate: -4 },
  { x: "0%", y: 18, rotate: 3 },
  { x: "5%", y: 36, rotate: -2 },
];

const accents = [
  "bg-[#151515] text-white",
  "bg-[#f4f0e8] text-black",
  "bg-[#253447] text-white",
];

export default function AchievementsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const slabsRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const slabs = slabsRef.current;

    if (!section || !text || !slabs) {
      return;
    }

    const cards = gsap.utils.toArray<HTMLElement>(
      slabs.querySelectorAll("[data-achievement-card]"),
    );
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        gsap.set(cards, {
          yPercent: -120,
          xPercent: 0,
          rotation: (index) => rotations[index],
          scale: 0.98,
          opacity: 0,
          zIndex: 10,
          transformOrigin: "50% 50%",
          willChange: "transform, opacity",
        });

        gsap.set(text, {
          filter: "blur(0px)",
          y: 0,
          opacity: 1,
          willChange: "transform, filter, opacity",
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=520%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        timeline.to(
          text,
          {
            y: 0,
            ease: "none",
            duration: 0.9,
          },
          0,
        );

        timeline.to(
          text,
          {
            y: -34,
            filter: "blur(8px)",
            opacity: 0.42,
            ease: "power2.inOut",
            duration: 1.1,
          },
          1.8,
        );

        cards.forEach((card, index) => {
          const startAt = 2.35 + index * 2.15;
          const settleAt = startAt + 0.72;
          const stackAt = settleAt + 0.42;

          timeline.set(card, { zIndex: 80 }, startAt);

          timeline.to(
            card,
            {
              yPercent: 0,
              x: landings[index].x,
              y: landings[index].y,
              rotation: landings[index].rotate,
              scale: 1,
              opacity: 1,
              ease: "power3.out",
              duration: 0.72,
            },
            startAt,
          );

          timeline.to(
            card,
            {
              scale: 1.03,
              duration: 0.18,
              ease: "power2.out",
            },
            settleAt,
          );

          timeline.to(
            card,
            {
              scale: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            settleAt + 0.18,
          );

          timeline.set(card, { zIndex: 30 + index }, stackAt);

          if (index > 0) {
            timeline.to(
              cards.slice(0, index),
              {
                y: (cardIndex) => landings[cardIndex].y + 8,
                scale: (cardIndex) => 1 - (index - cardIndex) * 0.012,
                duration: 0.32,
                ease: "power2.out",
              },
              stackAt,
            );
          }
        });

        return () => {
          timeline.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(cards, {
          yPercent: -120,
          x: 0,
          rotation: (index) => (index % 2 ? 3 : -3),
          scale: 0.96,
          opacity: 0,
          zIndex: 10,
          willChange: "transform, opacity",
        });

        gsap.set(text, {
          filter: "blur(0px)",
          y: 0,
          opacity: 1,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=540%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        timeline.to(
          text,
          {
            y: 0,
            ease: "none",
            duration: 0.9,
          },
          0,
        );

        timeline.to(
          text,
          {
            y: -28,
            filter: "blur(8px)",
            opacity: 0.45,
            ease: "power2.inOut",
            duration: 1.1,
          },
          1.8,
        );

        cards.forEach((card, index) => {
          const startAt = 2.35 + index * 2.05;
          const settleAt = startAt + 0.72;

          timeline.set(card, { zIndex: 80 }, startAt);

          timeline.to(
            card,
            {
              yPercent: 0,
              y: index * 16,
              rotation: index % 2 ? 2 : -2,
              scale: 1 - index * 0.025,
              opacity: 1,
              ease: "power3.out",
              duration: 0.72,
            },
            startAt,
          );

          timeline.to(
            card,
            {
              scale: 1.02 - index * 0.025,
              duration: 0.18,
              ease: "power2.out",
            },
            settleAt,
          );

          timeline.to(
            card,
            {
              scale: 1 - index * 0.025,
              duration: 0.28,
              ease: "power2.out",
            },
            settleAt + 0.18,
          );

          timeline.set(card, { zIndex: 30 + index }, settleAt + 0.48);
        });

        return () => {
          timeline.kill();
        };
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden px-4 py-16 text-black sm:px-6 lg:px-8"
    >
      <div
        ref={textRef}
        className="relative z-10 mx-auto max-w-6xl pt-8 md:pt-16"
      >
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/58">
          Recognition
        </p>

        <h2 className="mt-1 max-w-5xl font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-8xl lg:text-8.5xl">
          Achievements & <br></br>Recognition
        </h2>
        <p className="mt-0 mb-2 max-w-2xl text-left text-base leading-relaxed tracking-[0.01em] text-black/75 sm:text-lg">
          Still learning, always shipping.
        </p>
      </div>

      <div
        ref={slabsRef}
        className="pointer-events-none absolute inset-x-0 top-[11vh] z-20 mx-auto h-[78vh] w-full max-w-6xl px-4 md:top-[8vh]"
      >
        {achievements.map((achievement, index) => (
          <AchievementSlab
            key={achievement.title}
            achievement={achievement}
            index={index}
            slabClassName={accents[index % accents.length]}
          />
        ))}
      </div>
    </section>
  );
}

export function AchievementSlab({
  achievement,
  index,
  slabClassName,
}: {
  achievement: Achievement;
  index: number;
  slabClassName: string;
}) {
  return (
    <article
      data-achievement-card
      className={`absolute left-1/2 top-0 flex min-h-[280px] w-[min(88vw,760px)] -translate-x-1/2 flex-col justify-between overflow-hidden rounded-[22px] border border-black/10 p-8 opacity-0 will-change-transform sm:p-10 md:min-h-[360px] md:w-[min(76vw,820px)] ${slabClassName}`}
      style={{ zIndex: 20 + index }}
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
    </article>
  );
}
