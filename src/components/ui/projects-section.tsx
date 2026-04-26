import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  name: string;
  videoAsset: string;
  summary: string;
  accent: string;
};

type TileData = Project & {
  tileId: string;
  side: number;
  row: number;
  angle: number;
};

const columns = 6;
const baseProjects: Project[] = [
  {
    name: "Decay-AI",
    videoAsset: `${import.meta.env.BASE_URL}videos/decay_ai.mp4`,
    summary: "AI-assisted visual experiment with a cinematic interface.",
    accent: "#70d6b5",
  },
  {
    name: "Mentora",
    videoAsset: `${import.meta.env.BASE_URL}videos/mentora.mp4`,
    summary: "Learning companion experience built around guided momentum.",
    accent: "#7bbcff",
  },
  {
    name: "Civil Setu",
    videoAsset: `${import.meta.env.BASE_URL}videos/civil_setu.mp4`,
    summary: "Civic reporting workflow for clearer local issue tracking.",
    accent: "#f0a06a",
  },
];

const tiles: TileData[] = Array.from({ length: 12 }, (_, index) => {
  const project = baseProjects[index % baseProjects.length];
  const side = index % columns;
  const row = Math.floor(index / columns);

  return {
    ...project,
    tileId: `${project.name}-${index}`,
    side,
    row,
    angle: (side / columns) * Math.PI * 2,
  };
});

export function ProjectsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [selectedTile, setSelectedTile] = React.useState<TileData | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[240vh] w-full"
      aria-label="Interactive works"
    >
      <div className="sticky top-0 hidden h-screen overflow-hidden bg-[#080908] text-white md:block">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-7 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/58">
            Selected Projects
          </p>
        </div>

        <Canvas
          camera={{ position: [0, 0, 0.1], fov: 60, near: 0.1, far: 80 }}
          dpr={[1, 1.65]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          className="h-full w-full"
        >
          <color attach="background" args={["#080908"]} />
          <fog attach="fog" args={["#080908", 11, 28]} />
          <ambientLight intensity={0.52} />
          <directionalLight position={[2.8, 4.2, 3]} intensity={0.48} />
          <HexWorksScene
            scrollTarget={sectionRef}
            selectedTile={selectedTile}
            onSelect={setSelectedTile}
          />
        </Canvas>

        {selectedTile ? (
          <ProjectOverlay
            tile={selectedTile}
            onClose={() => setSelectedTile(null)}
          />
        ) : null}
      </div>

      <div className="space-y-4 px-4 py-8 md:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/55">
          Selected Projects
        </p>
        <h2 className="font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black">
          Works
        </h2>
        {baseProjects.map((project) => (
          <MobileProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}

function HexWorksScene({
  scrollTarget,
  selectedTile,
  onSelect,
}: {
  scrollTarget: React.RefObject<HTMLElement>;
  selectedTile: TileData | null;
  onSelect: (tile: TileData) => void;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const tileRefs = React.useRef<THREE.Group[]>([]);
  const { viewport, camera } = useThree();
  const radius = THREE.MathUtils.clamp(viewport.width * 0.62, 5.8, 8.6);
  const tileWidth = Math.max(2.4, radius * 0.82);
  const tileHeight = tileWidth * 0.58;
  const rowGap = tileHeight * 1.08;

  React.useEffect(() => {
    camera.lookAt(0, 0, -1);
  }, [camera]);

  React.useEffect(() => {
    const group = groupRef.current;
    const section = scrollTarget.current;
    if (!group || !section) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(
        tileRefs.current.map((tile) => tile.position),
        { z: "-=1.1" },
      );
      gsap.set(
        tileRefs.current.map((tile) => tile.rotation),
        { z: 0.22 },
      );
      gsap.set(
        tileRefs.current.map((tile) => tile.scale),
        { x: 0.82, y: 0.82 },
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            end: "top 16%",
            scrub: 0.75,
          },
          defaults: { ease: "power3.out" },
        })
        .to(
          tileRefs.current.map((tile) => tile.position),
          { z: "+=1.1", stagger: 0.05 },
          0,
        )
        .to(
          tileRefs.current.map((tile) => tile.rotation),
          { z: 0, stagger: 0.05 },
          0,
        )
        .to(
          tileRefs.current.map((tile) => tile.scale),
          { x: 1, y: 1, stagger: 0.05 },
          0,
        );

      gsap.to(group.rotation, {
        y: -Math.PI * 2,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
        },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom 82%",
            end: "bottom 28%",
            scrub: 0.75,
          },
        })
        .to(
          tileRefs.current.map((tile) => tile.position),
          {
            z: "-=1.8",
            y: (index) => (index % 2 === 0 ? "+=0.8" : "-=0.8"),
            stagger: 0.025,
            ease: "power3.in",
          },
        )
        .to(
          tileRefs.current.map((tile) => tile.rotation),
          {
            x: (index) => (index % 2 === 0 ? 0.36 : -0.36),
            z: (index) => ((index % 3) - 1) * 0.5,
            stagger: 0.025,
            ease: "power3.in",
          },
          0,
        )
        .to(
          tileRefs.current.map((tile) => tile.scale),
          {
            x: 0.78,
            y: 0.78,
            stagger: 0.025,
            ease: "power3.in",
          },
          0,
        );
    }, section);

    return () => ctx.revert();
  }, [scrollTarget]);

  React.useEffect(() => {
    const group = groupRef.current;
    if (!group || !selectedTile) {
      return;
    }

    gsap.to(group.rotation, {
      y: -selectedTile.angle,
      duration: 0.9,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [selectedTile]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    tileRefs.current.forEach((tile, index) => {
      const wrapped = Math.atan2(
        Math.sin(tiles[index].angle + group.rotation.y),
        Math.cos(tiles[index].angle + group.rotation.y),
      );
      const focus = Math.max(0, 1 - Math.abs(wrapped) / 0.85);
      const targetScale = 1 + focus * 0.1;
      const targetZ = focus * 0.22;

      tile.scale.x += (targetScale - tile.scale.x) * 0.08;
      tile.scale.y += (targetScale - tile.scale.y) * 0.08;
      tile.position.z += (targetZ - tile.position.z) * 0.08;
    });
  });

  return (
    <group ref={groupRef}>
      {tiles.map((tile, index) => (
        <ProjectTile
          key={tile.tileId}
          ref={(element) => {
            if (element) {
              tileRefs.current[index] = element;
            }
          }}
          tile={tile}
          radius={radius}
          width={tileWidth}
          height={tileHeight}
          y={(0.5 - tile.row) * rowGap}
          dimmed={Boolean(selectedTile && selectedTile.tileId !== tile.tileId)}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

const ProjectTile = React.forwardRef<
  THREE.Group,
  {
    tile: TileData;
    radius: number;
    width: number;
    height: number;
    y: number;
    dimmed: boolean;
    onSelect: (tile: TileData) => void;
  }
>(function ProjectTile(
  { tile, radius, width, height, y, dimmed, onSelect },
  ref,
) {
  const groupRef = React.useRef<THREE.Group>(null);
  const materialRef = React.useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = React.useState(false);
  const texture = useProjectTexture(tile.videoAsset, tile.name, tile.accent);
  const geometry = React.useMemo(
    () => roundedRectGeometry(width, height, 0.16),
    [height, width],
  );
  const position: [number, number, number] = [
    Math.sin(tile.angle) * radius,
    y,
    -Math.cos(tile.angle) * radius,
  ];

  React.useImperativeHandle(ref, () => groupRef.current as THREE.Group, []);

  useFrame(() => {
    const material = materialRef.current;
    const group = groupRef.current;
    if (!material || !group) {
      return;
    }

    const opacity = dimmed ? 0.28 : 1;
    material.opacity += (opacity - material.opacity) * 0.1;
    material.emissiveIntensity +=
      ((hovered ? 0.2 : 0.04) - material.emissiveIntensity) * 0.12;

    const hoverScale = hovered ? 1.05 : 1;
    group.scale.x += (hoverScale - group.scale.x) * 0.14;
    group.scale.y += (hoverScale - group.scale.y) * 0.14;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, -tile.angle, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(tile);
      }}
    >
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[width + 0.08, height + 0.08]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
      </mesh>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          color="#ffffff"
          emissive={tile.accent}
          emissiveIntensity={0.04}
          roughness={0.62}
          metalness={0.04}
          transparent
        />
      </mesh>
    </group>
  );
});

function useProjectTexture(src: string, title: string, accent: string) {
  const [texture, setTexture] = React.useState<THREE.Texture>(() =>
    createProjectTexture(title, accent),
  );

  React.useEffect(() => {
    const fallbackTexture = createProjectTexture(title, accent);
    setTexture(fallbackTexture);

    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.crossOrigin = "anonymous";

    const nextTexture = new THREE.VideoTexture(video);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.minFilter = THREE.LinearFilter;
    nextTexture.magFilter = THREE.LinearFilter;
    nextTexture.generateMipmaps = false;
    const useVideo = () => {
      fallbackTexture.dispose();
      setTexture(nextTexture);
      void video.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });

    observer.observe(document.body);
    video.addEventListener("canplay", useVideo, { once: true });
    video.addEventListener(
      "error",
      () => {
        nextTexture.dispose();
      },
      { once: true },
    );
    video.load();

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", useVideo);
      video.pause();
      video.removeAttribute("src");
      video.load();
      nextTexture.dispose();
      fallbackTexture.dispose();
    };
  }, [accent, src, title]);

  return texture;
}

function createProjectTexture(title: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#111111");
    gradient.addColorStop(0.48, accent);
    gradient.addColorStop(1, "#050505");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.28;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    for (let index = -canvas.height; index < canvas.width; index += 68) {
      context.beginPath();
      context.moveTo(index, canvas.height);
      context.lineTo(index + canvas.height, 0);
      context.stroke();
    }

    context.globalAlpha = 1;
    context.fillStyle = "rgba(0, 0, 0, 0.48)";
    context.fillRect(
      0,
      canvas.height * 0.62,
      canvas.width,
      canvas.height * 0.38,
    );
    context.fillStyle = "#ffffff";
    context.font = "700 86px Space Grotesk, Arial, sans-serif";
    context.textBaseline = "bottom";
    context.fillText(
      title.toUpperCase(),
      64,
      canvas.height - 72,
      canvas.width - 128,
    );
    context.fillStyle = "rgba(255, 255, 255, 0.7)";
    context.font = "600 24px Space Grotesk, Arial, sans-serif";
    context.fillText("INTERACTIVE PROJECT", 68, canvas.height - 34);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function roundedRectGeometry(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ShapeGeometry(shape, 16);
  geometry.computeVertexNormals();
  return geometry;
}

function ProjectOverlay({
  tile,
  onClose,
}: {
  tile: TileData;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      className="absolute bottom-7 left-1/2 z-20 w-[min(92vw,560px)] -translate-x-1/2 rounded-lg border border-white/18 bg-black/66 px-5 py-4 text-left text-white shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-md"
      onClick={onClose}
    >
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
        Focused Project
      </span>
      <span className="mt-2 block font-['Bebas_Neue'] text-5xl uppercase leading-none">
        {tile.name}
      </span>
      <span className="mt-2 block text-sm leading-6 text-white/76">
        {tile.summary}
      </span>
    </button>
  );
}

function MobileProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-lg border border-black/12 bg-[#111] text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <div
        className="grid aspect-video w-full place-items-end bg-black p-4"
        style={{
          backgroundImage: `linear-gradient(135deg, #111 0%, ${project.accent} 48%, #050505 100%)`,
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
          Interactive Project
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-['Bebas_Neue'] text-4xl uppercase leading-none">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/72">
          {project.summary}
        </p>
      </div>
    </article>
  );
}
