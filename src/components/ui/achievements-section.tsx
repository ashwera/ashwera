import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRefs = React.useRef<HTMLElement[]>([]);

  React.useLayoutEffect(() => {
    let context: gsap.Context | undefined;
    let cancelled = false;

    const initStack = async () => {
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      if (cancelled || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean);

        gsap.set(cards, {
          y: 100,
          opacity: 0,
          scale: 0.96,
          zIndex: (i) => i + 1,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            end: () => `+=${cards.length * window.innerHeight * 0.7}`,
          },
        });

        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
            },
            i * 0.82,
          );
        });

        ScrollTrigger.refresh();
      }, sectionRef);
    };

    initStack();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-x-hidden px-6 py-20 text-black"
    >
      {/* MAIN LAYOUT */}
      <div className="w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* LEFT */}
          <div className="md:sticky md:top-[20vh]">
            {/* <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/40">
              Recognition
            </p> */}

            <h2 className="mt-1 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl lg:text-8xl">
              Achievements & <br /> Recognition
            </h2>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-black/70">
              Still learning, always shipping.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full flex justify-end">
            <div className="relative w-[480px] max-w-[90%]">
              <div
                className="relative w-full"
                style={{ aspectRatio: "16/10", minHeight: "280px" }}
              >
                {achievements.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.title}
                    ref={(node) => {
                      if (node) cardRefs.current[index] = node;
                    }}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const AchievementCard = React.forwardRef<
  HTMLElement,
  { achievement: Achievement; index: number }
>(function AchievementCard({ achievement, index }, ref) {
  return (
    <article
      ref={ref}
      className={`absolute left-0 top-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-black/10 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.18)] will-change-transform sm:p-10 ${
        accents[index % accents.length]
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-[0.28em] opacity-55">
        0{index + 1}
      </span>

      <div>
        <h3 className="font-['Bebas_Neue'] text-5xl uppercase leading-none sm:text-7xl md:text-8xl">
          {achievement.title}
        </h3>

        <p className="mt-5 max-w-xl text-base font-semibold leading-7 opacity-70 sm:text-xl">
          {achievement.description}
        </p>
      </div>
    </article>
  );
});
