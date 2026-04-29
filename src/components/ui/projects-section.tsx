import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Project = {
  title: string;
  image: string;
  description: string;
  link: string;
};

const sampleData: { projects: Project[] } = {
  projects: [
    {
      title: "Decay-AI",
      image: "/images/decay-ai.png",
      description: "Trend decline signals for faster content strategy calls.",
      link: "#",
    },
    {
      title: "Mentora",
      image: "/images/mentora.png",
      description:
        "Student engagement tracking shaped into a clean instructor workflow.",
      link: "#",
    },
    {
      title: "Civil Setu",
      image: "/images/civil-setu.png",
      description: "AI-assisted civic reporting for cleaner issue routing.",
      link: "#",
    },
    {
      title: "Placeholder One",
      image: "/images/project-placeholder-1.png",
      description: "Placeholder project slot for upcoming work.",
      link: "#",
    },
    {
      title: "Placeholder Two",
      image: "/images/project-placeholder-2.png",
      description: "Placeholder project slot for upcoming work.",
      link: "#",
    },
  ],
};

export function ProjectsSection() {
  return <WorksSection projects={sampleData.projects} />;
}

export function WorksSection({ projects }: { projects: Project[] }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);

  React.useLayoutEffect(() => {
    const updateTrackDistance = () => {
      const viewport = viewportRef.current;
      const scroller = scrollerRef.current;
      if (!viewport || !scroller) return;

      setMaxTranslate(
        Math.max(0, scroller.scrollWidth - viewport.clientWidth),
      );
    };

    updateTrackDistance();

    const resizeObserver = new ResizeObserver(updateTrackDistance);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (scrollerRef.current) resizeObserver.observe(scrollerRef.current);

    window.addEventListener("resize", updateTrackDistance);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTrackDistance);
    };
  }, [projects.length]);

  const scrollByCard = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>("[data-project-card]");
    const cardWidth = card?.getBoundingClientRect().width ?? 320;
    window.scrollBy({
      top: direction * Math.min(maxTranslate, cardWidth + 20),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 text-black sm:px-6 lg:px-8"
      style={{ height: `calc(100vh + ${maxTranslate}px)` }}
      aria-label="Project showcase"
    >
      <div className="sticky top-0 flex min-h-screen w-full items-center overflow-hidden py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="mb-8 sm:mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/40">
            Selected Projects
          </p>
          <h2 className="mt-1 font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl lg:text-8xl">
            Works
          </h2>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="absolute left-0 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/90 text-xl font-bold text-black shadow-md backdrop-blur transition hover:bg-white sm:-left-1 md:-left-2"
            aria-label="Scroll left"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="absolute right-0 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/90 text-xl font-bold text-black shadow-md backdrop-blur transition hover:bg-white sm:-right-1 md:-right-2"
            aria-label="Scroll right"
          >
            ›
          </button>

          <div ref={viewportRef} className="w-full overflow-hidden">
          <motion.div
            ref={scrollerRef}
            style={{ x }}
            className="flex w-max gap-5 px-14 pb-4 will-change-transform"
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </motion.div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.a
      href={project.link}
      data-project-card
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeInOut", delay: index * 0.06 }}
      whileHover={{ y: -8, transition: { duration: 0.22, ease: "easeOut" } }}
      className="group relative w-[80vw] max-w-[480px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:w-[52vw] lg:w-[34vw]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-2 flex-1 truncate rounded-md bg-white/[0.07] px-3 py-1 text-[10px] text-white/30">
          {project.title.toLowerCase().replace(/\s+/g, "-")}.io
        </div>
        <span className="text-[10px] font-semibold text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Screenshot area */}
      <div className="relative w-full overflow-hidden bg-[#080908]" style={{ aspectRatio: "16/10" }}>
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-top opacity-85 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </motion.a>
  );
}
