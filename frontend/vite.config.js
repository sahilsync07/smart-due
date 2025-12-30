// Rename to vite.config.mjs or add "type": "module" to package.json
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue()],
    server: {
      port: 3000,
      open: true,
    },
    base: env.NODE_ENV === "production" ? "/sf-admin-nexus/" : "/",
  };
});
