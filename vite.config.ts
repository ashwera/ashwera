import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: "clean-local-routes",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/resume") {
            const resumePath = path.resolve(
              __dirname,
              "public/resume/ashwerahasan.pdf",
            );

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/pdf");
            fs.createReadStream(resumePath).pipe(res);
            return;
          }

          if (req.url === "/resume/") {
            res.statusCode = 302;
            res.setHeader("Location", "/resume");
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
