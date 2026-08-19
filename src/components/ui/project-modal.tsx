import React from "react";
import { createPortal } from "react-dom";
import { FaAws, FaCode, FaGithub, FaNodeJs, FaReact } from "react-icons/fa";
import {
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { ProjectDetail } from "@/lib/project-details";

type ProjectModalProps = {
  project: ProjectDetail;
  onClose: () => void;
};

const isEmbeddableUrl = (url?: string) => Boolean(url && url !== "#");

const techIcons: Record<string, React.ElementType> = {
  React: FaReact,
  "Node.js": FaNodeJs,
  MongoDB: SiMongodb,
  "Next.js": SiNextdotjs,
  PostgreSQL: SiPostgresql,
  Tailwind: SiTailwindcss,
  TypeScript: SiTypescript,
  Redis: SiRedis,
  AWS: FaAws,
  SVG: FaCode,
  Motion: FaCode,
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const liveUrl = isEmbeddableUrl(project.liveLink)
    ? project.liveLink
    : isEmbeddableUrl(project.href)
      ? project.href
      : undefined;
  const [iframeLoaded, setIframeLoaded] = React.useState(false);
  const [iframeUnavailable, setIframeUnavailable] = React.useState(!liveUrl);
  const githubUrl = isEmbeddableUrl(project.githubLink)
    ? project.githubLink
    : undefined;

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Browsers do not expose X-Frame-Options/CSP rejection to page JavaScript.
  // Treat a frame that never finishes loading as unavailable rather than leaving
  // the user with a permanent blank preview.
  React.useEffect(() => {
    if (!liveUrl || iframeLoaded) return;

    const timeout = window.setTimeout(() => setIframeUnavailable(true), 7000);
    return () => window.clearTimeout(timeout);
  }, [iframeLoaded, liveUrl]);

  const openInNewTab = () => {
    if (liveUrl) window.open(liveUrl, "_blank", "noopener,noreferrer");
  };

  const openGithub = () => {
    if (githubUrl) window.open(githubUrl, "_blank", "noopener,noreferrer");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden border border-white/25 bg-[#efefee] text-[#060606] shadow-2xl"
      >
        {githubUrl && (
          <button
            type="button"
            onClick={openGithub}
            className="absolute right-16 top-3 z-10 grid h-10 w-10 place-items-center bg-black text-lg text-white transition-opacity hover:opacity-75"
            aria-label={`Open ${project.name} GitHub repository`}
          >
            <FaGithub aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-black text-2xl leading-none text-white transition-opacity hover:opacity-75"
          aria-label="Close project preview"
        >
          ×
        </button>

        <div className="relative h-[46vh] min-h-[15rem] shrink-0 bg-[#060606] sm:h-[56vh] sm:max-h-[36rem]">
          {!iframeUnavailable && liveUrl ? (
            <iframe
              src={liveUrl}
              title={`${project.name} live preview`}
              className="absolute inset-0 h-full w-full border-0 bg-white"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeUnavailable(true)}
              allow="clipboard-read; clipboard-write; fullscreen"
            />
          ) : (
            <div className="relative h-full overflow-hidden text-[#efefee]">
              {project.image && (
                <img
                  src={project.image}
                  alt={`${project.name} project snapshot`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {liveUrl && (
                <button
                  type="button"
                  onClick={openInNewTab}
                  className="absolute bottom-4 right-4 bg-black px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-75"
                >
                  Open in new tab ↗
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#060606]/25 px-5 py-3 sm:px-6">
          <h2 id="project-modal-title" className="font-['Bebas_Neue'] text-4xl uppercase leading-none sm:text-5xl">
            {project.name}
          </h2>
          <div className="mt-1 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#060606]/50">
                Tech stack
              </p>
              <div className="project-tech-carousel mt-2 overflow-hidden" aria-label={`${project.name} technology stack`}>
                <div className="project-tech-track flex w-max gap-2">
                  {[...project.tech, ...project.tech].map((tech, index) => {
                    const Icon = techIcons[tech] ?? FaCode;
                    return (
                      <span
                        key={`${tech}-${index}`}
                        title={tech}
                        className="grid h-9 w-9 shrink-0 place-items-center border border-[#060606]/45 text-lg"
                      >
                        <Icon aria-hidden="true" />
                        <span className="sr-only">{tech}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="border-l-2 border-[#060606]/25 pl-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#060606]/50">
                Overview
              </p>
              <p className="mt-1 max-w-md text-sm leading-5 text-[#060606]/70">{project.description}</p>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes project-tech-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          .project-tech-track {
            animation: project-tech-scroll 14s linear infinite;
          }

          .project-tech-carousel:hover .project-tech-track {
            animation-play-state: paused;
          }
        `}</style>
      </section>
    </div>,
    document.body,
  );
}
