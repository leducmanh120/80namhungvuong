import { defineConfig } from "vite";
import { glob } from "glob";

export default defineConfig({
  root: ".",
  publicDir: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: glob.sync("**/*.html", {
        ignore: ["dist/**", "node_modules/**"],
      }),
    },
  },

  server: {
    port: 3000,
    open: true,
    host: true,
  },
});
