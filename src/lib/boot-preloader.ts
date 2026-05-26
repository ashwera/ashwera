type LoaderTaskKind =
  | "dom"
  | "fonts"
  | "images"
  | "init"
  | "layout"
  | "raf"
  | "smooth-scroll";

type LoaderTaskOptions = {
  kind: LoaderTaskKind;
  weight?: number;
  estimateMs?: number;
};

type LoaderTask = {
  id: string;
  kind: LoaderTaskKind;
  weight: number;
  estimateMs: number;
  progress: number;
  startedAt: number;
  done: boolean;
};

export type AdaptivePreloaderHandle = {
  addTask: (id: string, options: LoaderTaskOptions) => void;
  setTaskProgress: (id: string, progress: number) => void;
  completeTask: (id: string) => void;
  trackPromise: <T>(
    id: string,
    promise: Promise<T>,
    options: LoaderTaskOptions,
  ) => Promise<T>;
  markReady: () => Promise<void>;
  destroy: () => void;
};

const defaultDurations: Record<LoaderTaskKind, number> = {
  dom: 180,
  fonts: 780,
  images: 620,
  init: 420,
  layout: 340,
  raf: 280,
  "smooth-scroll": 380,
};

export function createAdaptivePreloader(
  root: HTMLElement | null,
): AdaptivePreloaderHandle {
  const tasks = new Map<string, LoaderTask>();
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let displayProgress = 0;
  let rafId = 0;
  let readyRequested = false;
  let closing = false;
  let removed = false;
  let resolveRemoved: (() => void) | null = null;
  const removedPromise = new Promise<void>((resolve) => {
    resolveRemoved = resolve;
  });

  if (root) {
    root.setAttribute("aria-valuemin", "0");
    root.setAttribute("aria-valuemax", "100");
    root.setAttribute("aria-valuenow", "0");
  }

  lockScroll();
  if (root) {
    root.classList.remove("is-closing");
    root.classList.remove("is-hidden");
  }

  const normalize = (value: number) => Math.min(1, Math.max(0, value));

  const totalWeight = () =>
    Math.max(
      1,
      Array.from(tasks.values()).reduce((sum, task) => sum + task.weight, 0),
    );

  const measuredProgress = () => {
    const weight = totalWeight();
    const completed = Array.from(tasks.values()).reduce((sum, task) => {
      return sum + task.weight * (task.done ? 1 : task.progress);
    }, 0);
    return completed / weight;
  };

  const estimatedProgress = (now: number) => {
    const weight = totalWeight();
    const estimate = Array.from(tasks.values()).reduce((sum, task) => {
      if (task.done) {
        return sum + task.weight;
      }

      const elapsed = now - task.startedAt;
      const pressure = 1 - Math.exp(-elapsed / task.estimateMs);
      const visualProgress = Math.min(0.93, pressure * 0.93);
      return sum + task.weight * Math.max(task.progress, visualProgress);
    }, 0);

    return estimate / weight;
  };

  const allDone = () => {
    const list = Array.from(tasks.values());
    return list.length > 0 && list.every((task) => task.done);
  };

  const applyProgress = (progress: number) => {
    const next = normalize(progress);
    displayProgress += (next - displayProgress) * (reducedMotion ? 1 : 0.14);

    if (root) {
      root.style.setProperty("--loader-progress", displayProgress.toFixed(4));
      root.setAttribute(
        "aria-valuenow",
        String(Math.round(displayProgress * 100)),
      );
    }
  };

  const finishAndRemove = () => {
    if (removed) {
      return;
    }

    removed = true;
    root?.remove();
    unlockScroll();
    resolveRemoved?.();
  };

  const beginClose = () => {
    if (closing) {
      return;
    }

    closing = true;

    if (!root) {
      finishAndRemove();
      return;
    }

    root.classList.add("is-closing");
    root.style.setProperty("--loader-progress", "1");

    const removeAfterFade = () => {
      root.removeEventListener("transitionend", onTransitionEnd);
      window.setTimeout(finishAndRemove, reducedMotion ? 40 : 260);
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === root && event.propertyName === "opacity") {
        removeAfterFade();
      }
    };

    root.addEventListener("transitionend", onTransitionEnd);
    window.setTimeout(removeAfterFade, reducedMotion ? 80 : 800);
  };

  const frame = (now: number) => {
    if (!closing) {
      applyProgress(Math.max(measuredProgress(), estimatedProgress(now)));

      if (readyRequested && allDone() && displayProgress >= 0.995) {
        beginClose();
      }
    }

    if (!removed) {
      rafId = window.requestAnimationFrame(frame);
    }
  };

  rafId = window.requestAnimationFrame(frame);

  const addTask = (id: string, options: LoaderTaskOptions) => {
    if (tasks.has(id)) {
      return;
    }

    tasks.set(id, {
      id,
      kind: options.kind,
      weight: options.weight ?? 1,
      estimateMs: options.estimateMs ?? defaultDurations[options.kind],
      progress: 0,
      startedAt: performance.now(),
      done: false,
    });
  };

  const setTaskProgress = (id: string, progress: number) => {
    const task = tasks.get(id);
    if (!task || task.done) {
      return;
    }

    task.progress = normalize(progress);
  };

  const completeTask = (id: string) => {
    const task = tasks.get(id);
    if (!task) {
      return;
    }

    task.progress = 1;
    task.done = true;
  };

  const trackPromise = async <T>(
    id: string,
    promise: Promise<T>,
    options: LoaderTaskOptions,
  ): Promise<T> => {
    addTask(id, options);

    try {
      const result = await promise;
      completeTask(id);
      return result;
    } catch (error) {
      completeTask(id);
      throw error;
    }
  };

  const markReady = async (): Promise<void> => {
    readyRequested = true;

    if (allDone()) {
      beginClose();
    }

    await removedPromise;
  };

  const destroy = () => {
    removed = true;
    window.cancelAnimationFrame(rafId);
    resolveRemoved?.();
    unlockScroll();
    root?.remove();
  };

  return {
    addTask,
    setTaskProgress,
    completeTask,
    trackPromise,
    markReady,
    destroy,
  };
}

function lockScroll() {
  const body = document.body;
  const html = document.documentElement;

  body.classList.add("is-loading");
  html.dataset.loader = "active";
}

function unlockScroll() {
  const body = document.body;
  const html = document.documentElement;

  body.classList.remove("is-loading");
  html.removeAttribute("data-loader");
}
