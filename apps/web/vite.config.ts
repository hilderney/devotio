import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      domain: path.resolve(__dirname, "../../packages/domain/index.ts"),
      "ui-kit": path.resolve(__dirname, "../../packages/ui-kit/index.ts"),
    },
  },
  server: {
    port: 3000,
  },
});
