import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirect all 404s to index.html during development
    historyApiFallback: true,
  },
  preview: {
    // Same for preview server
    historyApiFallback: true,
  },
});
 