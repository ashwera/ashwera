import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import AboutSection from "@/components/ui/about-section";
import { createAdaptivePreloader } from "@/lib/boot-preloader";
import "./tailwind.css";

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
  if (image.complete) {
    if (typeof image.decode === "function" && image.naturalWidth > 0) {
      await image.decode().catch(() => undefined);
    }
    return;
  }

  await new Promise<void>((resolve) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => resolve(), { once: true });
  });

  if (typeof image.decode === "function" && image.naturalWidth > 0) {
    await image.decode().catch(() => undefined);
  }
};

const waitForDocumentImages = async (
  loader: ReturnType<typeof createAdaptivePreloader>,
): Promise<void> => {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>("img"),
  ).filter((image) => !image.closest("#preloader"));

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

const waitForStableFrames = async (
  loader: ReturnType<typeof createAdaptivePreloader>,
  taskId: string,
  requiredStableFrames = 3,
): Promise<void> => {
  loader.addTask(taskId, {
    kind: "layout",
    weight: 1,
    estimateMs: 360,
  });

  let stableFrames = 0;
  let lastSignature = "";

  await new Promise<void>((resolve) => {
    const sample = () => {
      const root = document.documentElement;
      const body = document.body;
      const signature = [
        root.scrollWidth,
        root.scrollHeight,
        root.clientWidth,
        root.clientHeight,
        body.offsetHeight,
      ].join("x");

      if (signature === lastSignature) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
        lastSignature = signature;
      }

      loader.setTaskProgress(taskId, stableFrames / requiredStableFrames);

      if (stableFrames >= requiredStableFrames) {
        loader.completeTask(taskId);
        resolve();
        return;
      }

      window.requestAnimationFrame(sample);
    };

    window.requestAnimationFrame(sample);
  });
};

const initializeCursor = (): void => {
  const cursor = document.getElementById("name-cursor") as HTMLElement | null;
  const nameGlow = document.getElementById("name-glow") as HTMLElement | null;

  if (!cursor) {
    return;
  }

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let glowX = targetX;
  let glowY = targetY;

  const updateCursor = (): void => {
    currentX += (targetX - currentX) * 0.24;
    currentY += (targetY - currentY) * 0.24;
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;

    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;

    if (nameGlow) {
      nameGlow.style.left = `${glowX}px`;
      nameGlow.style.top = `${glowY}px`;
    }

    window.requestAnimationFrame(updateCursor);
  };

  updateCursor();

  window.addEventListener("pointermove", (event: PointerEvent) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });
};

const mountAbout = (): void => {
  const aboutRoot = document.getElementById("about-root");
  if (!aboutRoot) {
    return;
  }

  createRoot(aboutRoot).render(
    createElement(StrictMode, null, createElement(AboutSection)),
  );
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
  initializeCursor();
  mountAbout();
  loader.completeTask("init");

  await loader.trackPromise("fonts", waitForFontsReady(), {
    kind: "fonts",
    weight: 1,
  });

  await waitForDocumentImages(loader);

  await waitForStableFrames(loader, "layout-settle", 4);

  await loader.markReady();
};

void bootstrap();
