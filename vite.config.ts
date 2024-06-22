import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: {
        manifest_version: 3,
        name: "summary bot for website",
        version: "1.0",
        description:
          "Use llm model to help you summary the content of website.",
        action: {},
        permissions: ["storage", "tabs"],
        background: {
          service_worker: "src/background",
        },
        content_scripts: [
          {
            matches: ["<all_urls>"],
            js: ["src/content"],
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: ["src/background.ts", "src/content.tsx"],
      output: {
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash].[ext]",
        entryFileNames: "[name].js",
        dir: "dist",
      },
    },
  },
});
