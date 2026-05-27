/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:3000";

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/api": apiProxyTarget,
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/__tests__/setup.ts"],
      include: ["src/__tests__/**/*.test.{ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/__tests__/**",
          "src/main.tsx",
          "src/vite-env.d.ts",
          "src/App.tsx",
          "src/components/**",
          "src/types/**",
          "src/config/constants.ts",
          "src/providers/**",
        ],
      },
    },
  };
});
