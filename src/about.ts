import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import AboutSection from "@/components/ui/about-section";
import "./tailwind.css";



const cursor = document.getElementById("name-cursor") as HTMLElement | null;
const nameGlow = document.getElementById("name-glow") as HTMLElement | null;

if (cursor) {
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
}

const aboutRoot = document.getElementById("about-root");
if (aboutRoot) {
  createRoot(aboutRoot).render(
    createElement(StrictMode, null, createElement(AboutSection)),
  );
}
