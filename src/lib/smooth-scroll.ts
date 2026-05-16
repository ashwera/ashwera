import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SmoothScrollHandle = {
  destroy: () => void;
};

export async function setupSmoothScroll(
  enabled: boolean,
): Promise<SmoothScrollHandle> {
  if (!enabled) {
    return {
      destroy: () => undefined,
    };
  }

  const [{ default: Lenis }] = await Promise.all([import("@studio-freight/lenis")]);
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    smoothTouch: false,
    duration: 1.15,
  });

  const onScroll = () => ScrollTrigger.update();
  const onRaf = (time: number) => {
    lenis.raf(time * 1000);
  };

  lenis.on("scroll", onScroll);
  gsap.ticker.add(onRaf);
  gsap.ticker.lagSmoothing(0);

  return {
    destroy: () => {
      gsap.ticker.remove(onRaf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    },
  };
}
