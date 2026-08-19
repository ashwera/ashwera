import React from "react";

const year = new Date().getFullYear();

const STYLE_ID = "footer-section-css";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .site-footer {
      width: 100%;
      background: #0a0a0a;
    }
    .footer-bar {
      width: 100%;
      margin: 0 auto;
      padding: 24px 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      text-align: center;
    }
    .footer-nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 24px;
    }
    .footer-nav a {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: rgba(255,255,255,0.45);
      text-decoration: none;
      text-transform: uppercase;
      transition: color 0.25s ease;
    }
    .footer-nav a:hover {
      color: rgba(255,255,255,0.85);
    }
    .footer-icons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    .footer-icons a {
      color: rgba(255,255,255,0.35);
      transition: color 0.25s ease;
      display: flex;
    }
    .footer-icons a:hover {
      color: rgba(255,255,255,0.8);
    }
    .footer-icons svg {
      width: 10px;
      height: 10px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .footer-copy {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 400;
      letter-spacing: 0.06em;
      color: rgba(255,255,255,0.16);
    }
  `;
  document.head.appendChild(style);
}

export default function FooterSection() {
  React.useEffect(() => { injectStyles(); }, []);

  return (
    <div className="footer-bar">
      <nav className="footer-nav" aria-label="Footer navigation">
        <a href="/">Home</a>
        <a href="/#projects">Works</a>
        <a href="#">Break</a>
        <a href="/resume" target="_blank" rel="noreferrer">Resume</a>
        <a href="/about">About</a>
      </nav>

      <div className="footer-icons">
        <a href="mailto:syedashwerahasan@gmail.com" aria-label="Email">
          <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
        </a>
        <a href="https://github.com/ashwera" target="_blank" rel="noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
        </a>
        <a href="https://linkedin.com/in/ashwera" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
        </a>
      </div>

      <span className="footer-copy">Ashwera Hasan</span>
    </div>
  );
}
