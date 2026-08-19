import React from "react";
import { projectDetailsData } from "@/lib/project-details";

const PROJECT_DETAILS_MAP = new Map(
  projectDetailsData.map((project) => [project.id, project]),
);

export default function ProjectDetailPage() {
  const [project, setProject] = React.useState<
    (typeof projectDetailsData)[0] | null
  >(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    if (projectId) {
      setProject(PROJECT_DETAILS_MAP.get(projectId) || null);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#efefee] font-['Space_Grotesk'] text-[#060606]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-px w-52 overflow-hidden bg-[#060606]/15">
            <div className="h-full w-2/3 animate-pulse bg-[#060606]" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#060606]/50">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[#efefee] px-6 font-['Space_Grotesk'] text-[#060606]">
        <div className="bg-texture" aria-hidden="true" />
        <div className="relative z-10 text-center">
          <h1
            className="font-['Bebas_Neue'] text-[clamp(4.4rem,14vw,12rem)] font-normal uppercase leading-[0.88] text-[#060606]"
            style={{ letterSpacing: "0.01em" }}
          >
            Project Not Found
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-[clamp(0.95rem,1.5vw,1.2rem)] font-medium leading-[1.6] text-[#080808]/70">
            The project you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-9 inline-flex rounded-full border border-[#060606]/80 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-widest text-[#060606] transition-all hover:bg-[#060606] hover:text-[#efefee]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#efefee] font-['Space_Grotesk'] text-[#060606] selection:bg-black selection:text-white">
      <div className="bg-texture" aria-hidden="true" />

      <header className="topbar relative z-20">
        <div className="topbar-left">
          <span>Mumbai, India</span>
          <span>19.0760° N, 72.8777° E</span>
        </div>

        <nav className="topbar-nav" aria-label="Primary navigation">
          <a href="/">HOME</a>
          <a href="/#projects">WORKS</a>
          <a href="#">BREAK</a>
          <a href="/resume" target="_blank" rel="noreferrer">
            RESUME
          </a>
          <a href="/about">ABOUT</a>
        </nav>
      </header>

      <main className="home relative z-10">
        <section className="hero pb-12" aria-labelledby="project-title">
          <div className="flex items-start justify-between gap-6">
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.28em] text-black/40">
              {project.type}
            </p>
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = "/#projects";
                }
              }}
              className="rounded-full border border-[#060606]/80 bg-transparent px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#060606] transition-all hover:bg-[#060606] hover:text-[#efefee]"
            >
              Back
            </button>
          </div>

          <h1
            id="project-title"
            className="mt-8 font-['Bebas_Neue'] text-[clamp(5rem,20vw,18rem)] font-normal uppercase leading-[0.86] text-[#060606]"
            style={{ letterSpacing: "0.01em" }}
          >
            {project.name}
          </h1>

          <div className="hero-lower mt-[clamp(3rem,10vh,7rem)]">
            <p className="role role-left opacity-100">{project.type}</p>
            <p className="role role-right opacity-100">Case Study</p>
          </div>

          <p className="hero-summary translate-y-0 opacity-100">
            {project.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#060606]/80 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-widest text-[#060606] transition-all hover:bg-[#060606] hover:text-[#efefee]"
              >
                Visit Live
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#060606]/80 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-widest text-[#060606] transition-all hover:bg-[#060606] hover:text-[#efefee]"
              >
                GitHub
              </a>
            )}
          </div>
        </section>

        {project.image && (
          <section className="mb-16 overflow-hidden border-y border-[#060606]/25 bg-[#060606]/5">
            <img
              src={project.image}
              alt={project.name}
              loading="eager"
              className="h-[clamp(18rem,52vw,40rem)] w-full object-cover"
              sizes="(max-width: 1600px) 96vw, 1400px"
            />
          </section>
        )}

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-20 pt-4 text-center md:px-8 md:pb-28 md:pt-10">
          <div className="mb-8 h-[2px] w-12 rounded-full bg-[#0d0d0d]/30 md:mb-12 md:w-20" />
          <p className="text-[clamp(1.1rem,2vw,1.75rem)] font-medium uppercase leading-[1.6] tracking-wide text-[#232323]">
            {project.description}
          </p>
          <div className="mt-8 h-[2px] w-12 rounded-full bg-[#0d0d0d]/30 md:w-20" />
        </section>

        <section className="grid gap-10 pb-24 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <h2 className="font-['Bebas_Neue'] text-[clamp(3.5rem,8vw,7.5rem)] font-normal uppercase leading-[0.9] text-[#060606]">
            Stack
          </h2>
          <div className="flex flex-wrap content-start gap-3 pt-1 md:pt-5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#060606]/50 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#060606]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {project.videoUrl && (
          <section className="pb-24">
            <h2 className="mb-8 font-['Bebas_Neue'] text-[clamp(3.5rem,8vw,7.5rem)] font-normal uppercase leading-[0.9] text-[#060606]">
              Demo
            </h2>
            <div className="overflow-hidden border border-[#060606]/25 bg-[#060606]">
              <iframe
                src={project.videoUrl}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Project demo video"
                loading="lazy"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
