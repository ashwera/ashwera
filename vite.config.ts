import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: "clean-local-routes",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/resume") {
            res.statusCode = 302;
            res.setHeader("Location", "/resume/ashwerahasan.pdf");
            res.end();
            return;
          }

          if (req.url === "/talk") {
            res.statusCode = 302;
            res.setHeader("Location", "https://meet.google.com/vdr-rvqp-ddd");
            res.end();
            return;
          }

          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "about/index.html"),
      },
    },
  },
}));
