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
    id: "mentora",
    name: "Mentora",
    type: "Learning Ops",
    tagline:
      "Student engagement tracking shaped into a clean instructor workflow.",
    tech: ["Next.js", "PostgreSQL", "Tailwind"],
    image: "/images/mentora.png",
    href: "#",
    description:
      "Mentora is a comprehensive learning operations platform that transforms how instructors track and engage with their students. Built with a focus on clean, intuitive workflows, it provides real-time visibility into student engagement metrics and enables instructors to make data-driven decisions to improve learning outcomes.",
    liveLink: "#",
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
    id: "civil-setu",
    name: "Civil Setu",
    type: "Civic Intelligence",
    tagline: "AI-assisted civic reporting for cleaner issue routing.",
    tech: ["TypeScript", "Redis", "AWS"],
    image: "/images/civil-setu.png",
    href: "#",
    description:
      "Civil Setu bridges the gap between citizens and civic authorities through intelligent issue reporting and routing. Using AI-powered categorization and prioritization, it ensures civic problems reach the right department faster, resulting in quicker resolutions and a cleaner city.",
    liveLink: "#",
    githubLink: "#",
  },
  {
    id: "city-pulse",
    name: "City Pulse",
    type: "Experience Map",
    tagline: "A cinematic interaction layer for browsing work through space.",
    tech: ["React", "SVG", "Motion"],
    image: "/images/skyline.svg",
    href: "#",
    description:
      "City Pulse creates an immersive, cinematic experience for exploring projects through an interactive spatial interface. By visualizing projects as a dynamic cityscape, users can browse and discover work in a completely new way—one that feels intuitive, engaging, and truly innovative.",
    liveLink: "#",
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
