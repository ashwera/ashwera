export type ProjectDetail = {
  id: string;
  name: string;
  type: string;
  tagline: string;
  tech: string[];
  image: string;
  href: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
  videoUrl?: string;
};

export const projectDetailsData: ProjectDetail[] = [
  {
    id: "safeeyah",
    name: "Safeeyah",
    type: "Quranic Q&A",
    tagline: "A calm, Quran-grounded space for thoughtful questions.",
    tech: ["Node.js", "Express", "Gemini", "Pinecone"],
    image: "/images/skyline.svg",
    href: "https://safeeyah.onrender.com/",
    description:
      "Safeeyah is a Quran-grounded question-and-answer application that retrieves relevant passages and uses AI to provide thoughtful, context-aware responses.",
    liveLink: "https://safeeyah.onrender.com/",
    githubLink: "#",
  },
  {
    id: "decay-ai",
    name: "Decay-AI",
    type: "Signal Engine",
    tagline: "Trend decline signals for faster content strategy calls.",
    tech: ["React", "Node.js", "MongoDB"],
    image: "/images/decay-ai.png",
    href: "#",
    description:
      "Decay-AI is an intelligent signal engine that detects trend decline patterns early, enabling content strategists to pivot strategies before it's too late. By analyzing content performance across multiple dimensions, it provides actionable insights that help teams stay ahead of the curve.",
    liveLink: "https://decay-ai-nsay.onrender.com/",
    githubLink: "#",  
  },
  {
    id: "sandhaan",
    name: "Sandhaan",
    type: "Web Experience",
    tagline: "A focused digital experience built for clear interaction.",
    tech: ["React", "TypeScript", "Tailwind"],
    image: "/images/skyline.svg",
    href: "https://sandhaan.vercel.app/",
    description:
      "Sandhaan is a polished web experience designed around focused content, intuitive navigation, and a responsive interface.",
    liveLink: "https://sandhaan.vercel.app/",
    githubLink: "#",
  },
  {
    id: "collabhub",
    name: "CollabHub",
    type: "Team Collaboration",
    tagline:
      "A contribution-first talent network where builders showcase real work, collaborate on projects, and grow their reputation through impact instead of resumes.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    image: "/images/collabhub.png",
    href: "https://collabhub-sigma.vercel.app/",
    description:
      "CollabHub revolutionizes how teams discover talent and collaborate on projects. Instead of resumes, builders showcase real work and tangible contributions. The platform uses a reputation system built on verified impact, making it easy to find the right collaborators for any project. With instant team formation, dynamic allocation, and performance-first design, CollabHub removes friction from collaboration.",
    liveLink: "https://collabhub-sigma.vercel.app/",
    githubLink: "https://github.com/your-username/collabhub",
  },
];
