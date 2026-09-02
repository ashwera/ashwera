import React from "react";
import { createPortal } from "react-dom";
import { FaAws, FaCode, FaGithub, FaNodeJs, FaReact } from "react-icons/fa";
import { SiMongodb, SiNextdotjs, SiPostgresql, SiRedis, SiTailwindcss, SiTypescript } from "react-icons/si";
import type { ProjectDetail } from "@/lib/project-details";

type ProjectModalProps = { project: ProjectDetail; onClose: () => void };
const isUsableUrl = (url?: string) => Boolean(url && url !== "#");
const DESKTOP_PREVIEW_WIDTH = 1440;
const DESKTOP_PREVIEW_HEIGHT = 810;

const techIcons: Record<string, React.ElementType> = {
  React: FaReact, "Node.js": FaNodeJs, MongoDB: SiMongodb, "Next.js": SiNextdotjs,
  PostgreSQL: SiPostgresql, Tailwind: SiTailwindcss, TypeScript: SiTypescript,
  Redis: SiRedis, AWS: FaAws, SVG: FaCode, Motion: FaCode,
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const liveUrl = isUsableUrl(project.liveLink) ? project.liveLink : isUsableUrl(project.href) ? project.href : undefined;
  const githubUrl = isUsableUrl(project.githubLink) ? project.githubLink : undefined;
  const [iframeLoaded, setIframeLoaded] = React.useState(false);
  const [iframeUnavailable, setIframeUnavailable] = React.useState(!liveUrl);
  const previewFrameRef = React.useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = React.useState(1);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = previousOverflow; };
  }, [onClose]);

  React.useEffect(() => {
    if (!liveUrl || iframeLoaded) return;
    const timeout = window.setTimeout(() => setIframeUnavailable(true), 7000);
    return () => window.clearTimeout(timeout);
  }, [iframeLoaded, liveUrl]);

  React.useEffect(() => {
    const frame = previewFrameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const { width, height } = frame.getBoundingClientRect();
      setPreviewScale(Math.min(width / DESKTOP_PREVIEW_WIDTH, height / DESKTOP_PREVIEW_HEIGHT));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const openInNewTab = () => { if (liveUrl) window.open(liveUrl, "_blank", "noopener,noreferrer"); };
  const openGithub = () => { if (githubUrl) window.open(githubUrl, "_blank", "noopener,noreferrer"); };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="project-modal-title" className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden border border-white/25 bg-[#efefee] text-[#060606] shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center bg-black text-2xl leading-none text-white transition-opacity hover:opacity-75" aria-label="Close project preview">×</button>

        <div className="project-modal-layout grid min-h-[30rem]">
          <div className="border-b border-[#060606]/25 p-5 md:border-b-0 md:border-r md:p-6">
            <div
              ref={previewFrameRef}
              className="relative mx-auto w-[96%] overflow-hidden rounded-sm border border-[#060606]/40 bg-[#060606] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
              style={{ aspectRatio: "16 / 9" }}
            >
              {!iframeUnavailable && liveUrl ? (
                <div
                  className="absolute left-1/2 top-1/2 overflow-hidden bg-white"
                  style={{
                    width: DESKTOP_PREVIEW_WIDTH,
                    height: DESKTOP_PREVIEW_HEIGHT,
                    transform: `translate(-50%, -50%) scale(${previewScale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <iframe
                    src={liveUrl}
                    title={`${project.name} live preview`}
                    className="h-full border-0 bg-white"
                    style={{ width: DESKTOP_PREVIEW_WIDTH + 18 }}
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setIframeUnavailable(true)}
                    allow="clipboard-read; clipboard-write; fullscreen"
                  />
                </div>
              ) : (
                <div className="relative h-full overflow-hidden text-[#efefee]">
                  {project.image && <img src={project.image} alt={`${project.name} project snapshot`} className="absolute inset-0 h-full w-full object-cover" />}
                  {liveUrl && <button type="button" onClick={openInNewTab} className="absolute bottom-3 right-3 bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-75">Open live site ↗</button>}
                </div>
              )}
            </div>
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#060606]/50">Tech stack</p>
              <div className="project-tech-carousel mt-2 overflow-hidden" aria-label={`${project.name} technology stack`}>
                <div className="project-tech-track flex w-max gap-2">
                  {[...project.tech, ...project.tech].map((tech, index) => {
                    const Icon = techIcons[tech] ?? FaCode;
                    return <span key={`${tech}-${index}`} title={tech} className="grid h-9 w-9 shrink-0 place-items-center border border-[#060606]/45 text-lg"><Icon aria-hidden="true" /><span className="sr-only">{tech}</span></span>;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-5 pr-16 sm:p-6 sm:pr-16 md:pr-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#060606]/50">{project.type}</p>
            <h2 id="project-modal-title" className="mt-3 font-['Bebas_Neue'] text-5xl uppercase leading-[0.9] sm:text-6xl">{project.name}</h2>
            <div className="mt-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#060606]/50">Overview</p><p className="mt-3 text-sm leading-6 text-[#060606]/70">{project.description}</p></div>
            <div className="mt-8 flex flex-wrap gap-3">
              {liveUrl && <button type="button" onClick={openInNewTab} className="bg-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-75">Live site ↗</button>}
              {githubUrl && <button type="button" onClick={openGithub} className="inline-flex items-center gap-2 border border-[#060606]/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-black hover:text-white"><FaGithub aria-hidden="true" /> GitHub ↗</button>}
            </div>
          </div>
        </div>
        <style>{`
          .project-modal-layout { grid-template-columns: minmax(0, 1fr); }
          @media (min-width: 768px) {
            .project-modal-layout { grid-template-columns: minmax(0, 1.8fr) minmax(18rem, 0.8fr); }
          }
          @keyframes project-tech-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .project-tech-track { animation: project-tech-scroll 14s linear infinite; }
          .project-tech-carousel:hover .project-tech-track { animation-play-state: paused; }
        `}</style>
      </section>
    </div>,
    document.body,
  );
}
