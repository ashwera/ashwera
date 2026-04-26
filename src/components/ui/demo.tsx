import { ProjectsSection } from "@/components/ui/projects-section";

export default function MyWorksScrollDemo() {
  return (
    <div className="w-full overflow-visible bg-transparent">
      <div className="mx-auto max-w-5xl px-3 pb-0 pt-4 text-center sm:pt-8">
        <h2 className="font-['Bebas_Neue'] text-6xl font-normal uppercase leading-none text-black sm:text-7xl lg:text-8xl">
          Works
        </h2>
      </div>
      <ProjectsSection />
    </div>
  );
}
