import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { "@": `${import.meta.dirname}/src` } },
    server: {
      proxy: {
        "/backend": {
          target: env.VITE_DEV_API_TARGET || "http://127.0.0.1:8000",
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/backend/, ""),
        },
      },
    },
  }
})
