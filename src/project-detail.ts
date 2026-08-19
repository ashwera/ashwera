import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import ProjectDetailPage from "@/components/ui/project-detail-page";
import "./tailwind.css";

const root = createRoot(document.getElementById("root")!);
root.render(createElement(StrictMode, null, createElement(ProjectDetailPage)));
