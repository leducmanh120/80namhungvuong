import { defineConfig } from "vite";
import { glob } from "glob";
import { resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: ".",
  publicDir: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync("**/*.html", {
            ignore: ["dist/**", "node_modules/**"],
          })
          .map((file) => [relative(__dirname, file).slice(0, -extname(file).length), resolve(__dirname, file)])
      ),
    },
  },

  server: {
    port: 3000,
    open: true,
    host: true,
  },
});
