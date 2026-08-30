import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Optional: proxy /api to backend during dev if you prefer relative URLs
      // "/api": "http://localhost:8000",
    },
  },
});
