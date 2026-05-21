import { StrictMode, createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import MyWorksScrollDemo from "@/components/ui/demo";
import GithubGraphSection from "@/components/ui/github-graph-section";
import AchievementsSection from "@/components/ui/achievements-section";
import ExperienceSection from "@/components/ui/experience-section";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createAdaptivePreloader } from "@/lib/boot-preloader";
import { setupSmoothScroll } from "@/lib/smooth-scroll";
import "./tailwind.css";

const formatTime = (): string => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  return `${formatter.format(now)} GMT+5:30`;
};

const waitForDomReady = (): Promise<void> => {
  if (document.readyState !== "loading") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve(), {
      once: true,
    });
  });
};

const waitForFontsReady = async (): Promise<void> => {
  if ("fonts" in document) {
    await document.fonts.ready;
  }
};

const waitForImageDecode = async (image: HTMLImageElement): Promise<void> => {
  // Already loaded
  if (image.complete) {
    if (typeof image.decode === "function" && image.naturalWidth > 0) {
      await Promise.race([
        image.decode().catch(() => undefined),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    }
    return;
  }

  // Wait for load/error OR timeout
  await Promise.race([
    new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    }),
    new Promise<void>((resolve) => {
      setTimeout(resolve, 3000);
    }),
  ]);

  if (typeof image.decode === "function" && image.naturalWidth > 0) {
    await Promise.race([
      image.decode().catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
  }
};

const waitForDocumentImages = async (
  loader: ReturnType<typeof createAdaptivePreloader>,
): Promise<void> => {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>("img"),
  ).filter((image) => !image.closest("#preloader") && image.loading !== "lazy");

  if (images.length === 0) {
    return;
  }

  await Promise.all(
    images.map((image, index) =>
      loader.trackPromise(
        `image:${index}:${image.currentSrc || image.src}`,
        waitForImageDecode(image),
        {
          kind: "images",
          weight: 1,
          estimateMs: 520 + index * 18,
        },
      ),
    ),
  );
};

const mountReactRoots = (): void => {
  const worksRoot = document.getElementById("works-root");
  if (worksRoot) {
    flushSync(() => {
      createRoot(worksRoot).render(
        createElement(StrictMode, null, createElement(MyWorksScrollDemo)),
      );
    });
  }

  const githubGraphRoot = document.getElementById("github-graph-root");
  if (githubGraphRoot) {
    flushSync(() => {
      createRoot(githubGraphRoot).render(
        createElement(StrictMode, null, createElement(GithubGraphSection)),
      );
    });
  }

  const experienceRoot = document.getElementById("experience-root");
  if (experienceRoot) {
    flushSync(() => {
      createRoot(experienceRoot).render(
        createElement(StrictMode, null, createElement(ExperienceSection)),
      );
    });
  }

  const achievementsRoot = document.getElementById("achievements-root");
  if (achievementsRoot) {
    flushSync(() => {
      createRoot(achievementsRoot).render(
        createElement(StrictMode, null, createElement(AchievementsSection)),
      );
    });
  }
};

const initializeLiveTime = (): void => {
  const timeLabel = document.getElementById("live-time");

  if (timeLabel) {
    timeLabel.textContent = formatTime();
    window.setInterval(() => {
      timeLabel.textContent = formatTime();
    }, 1000 * 30);
  }
};

const buildFlipCharacters = (nameElement: HTMLElement): void => {
  const rows = nameElement.querySelectorAll<HTMLElement>(".name-row");
  let charIndex = 0;

  rows.forEach((row) => {
    const rowText = row.textContent ?? "";
    row.textContent = "";

    rowText.split("").forEach((letter) => {
      const char = document.createElement("span");
      char.className = "flip-char";
      char.style.setProperty("--char-index", String(charIndex));

      if (letter === " ") {
        char.classList.add("is-space");
        char.innerHTML = "&nbsp;";
      } else {
        char.textContent = letter;
      }

      row.append(char);
      charIndex += 1;
    });
  });
};

const enableCharacterFlip = (nameElement: HTMLElement): void => {
  const chars = nameElement.querySelectorAll<HTMLElement>(
    ".flip-char:not(.is-space)",
  );

  chars.forEach((char) => {
    char.addEventListener("pointerenter", () => {
      char.getAnimations().forEach((animation) => animation.cancel());
      char.animate(
        [
          { transform: "rotateY(0deg)" },
          { transform: "rotateY(-86deg)" },
          { transform: "rotateY(0deg)" },
        ],
        {
          duration: 430,
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          fill: "none",
        },
      );
    });
  });
};

const initializeHeroInteractions = (): void => {
  const heroName = document.getElementById("hero-name") as HTMLElement | null;
  const cursor = document.getElementById("name-cursor") as HTMLElement | null;
  const nameGlow = document.getElementById("name-glow") as HTMLElement | null;

  if (heroName) {
    buildFlipCharacters(heroName);
    enableCharacterFlip(heroName);
  }

  if (cursor) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let glowX = targetX;
    let glowY = targetY;
    let rafId = 0;

    const updateCursor = (): void => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (nameGlow) {
        nameGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      }

      const cursorSettled =
        Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1;
      const glowSettled =
        Math.abs(targetX - glowX) < 0.1 && Math.abs(targetY - glowY) < 0.1;

      if (cursorSettled && glowSettled) {
        rafId = 0;
        return;
      }

      rafId = window.requestAnimationFrame(updateCursor);
    };

    updateCursor();

    window.addEventListener("pointermove", (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (rafId === 0) {
        rafId = window.requestAnimationFrame(updateCursor);
      }
    }, { passive: true });
  }

  if (heroName && cursor) {
    heroName.addEventListener("pointermove", (event: PointerEvent) => {
      const rect = heroName.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      heroName.style.setProperty("--mx", `${relativeX}px`);
      heroName.style.setProperty("--my", `${relativeY}px`);
    });

    heroName.addEventListener("pointerenter", () => {
      heroName.classList.add("is-hovered");
      cursor.classList.add("active");
    });

    heroName.addEventListener("pointerleave", () => {
      heroName.classList.remove("is-hovered");
      cursor.classList.remove("active");
    });
  }
};

export const initAnimations = (): void => {
  gsap.registerPlugin(ScrollTrigger);

  const heroLower = document.querySelector(".hero-lower") as HTMLElement | null;
  const heroSummary = document.querySelector(
    ".hero-summary",
  ) as HTMLElement | null;

  if (heroLower && heroSummary) {
    const roleLeft = document.querySelector(".role-left") as HTMLElement | null;
    const roleRight = document.querySelector(
      ".role-right",
    ) as HTMLElement | null;

    gsap.set(heroSummary, {
      y: 40,
      opacity: 0,
      willChange: "transform, opacity",
    });

    if (roleLeft && roleRight) {
      gsap.set(roleLeft, {
        x: -100,
        opacity: 0,
        willChange: "transform, opacity",
      });
      gsap.set(roleRight, {
        x: 100,
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.to(heroSummary, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap
        .timeline({
          defaults: { duration: 1.15 },
          scrollTrigger: {
            trigger: heroLower,
            start: "top 75%",
            end: "top 10%",
            scrub: 1,
          },
        })
        .to(roleLeft, { x: 0, opacity: 1, ease: "power3.out" }, 0)
        .to(roleRight, { x: 0, opacity: 1, ease: "power3.out" }, 0)
        .to(roleLeft, { x: 120, opacity: 0, ease: "power3.in" }, 1.25)
        .to(roleRight, { x: -120, opacity: 0, ease: "power3.in" }, 1.25)
        .to(heroSummary, { y: -24, opacity: 0, ease: "power3.in" }, 1.45);
    }
  }

  ScrollTrigger.refresh();
};

const bootstrap = async (): Promise<void> => {
  const preloader = document.getElementById("preloader");
  const loader = createAdaptivePreloader(preloader);

  await loader.trackPromise("dom", waitForDomReady(), {
    kind: "dom",
    weight: 1,
  });

  loader.addTask("init", {
    kind: "init",
    weight: 1,
    estimateMs: 440,
  });
  mountReactRoots();
  initializeLiveTime();
  initializeHeroInteractions();
  loader.completeTask("init");

  const shouldEnableLenis = false;

  await loader.trackPromise(
    "smooth-scroll",
    setupSmoothScroll(shouldEnableLenis).catch(() => ({
      destroy: () => undefined,
    })),
    {
      kind: "smooth-scroll",
      weight: 1,
      estimateMs: 420,
    },
  );

  await loader.trackPromise("fonts", waitForFontsReady(), {
    kind: "fonts",
    weight: 1,
  });

  await waitForDocumentImages(loader);

  initAnimations();

  await loader.markReady();
};

void bootstrap();
