// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const envApiBase = env.VITE_API_URL || "";
  const target = envApiBase.replace(/\/api\/v1\/?$/, "");

  return {
    base: "",
    plugins: [react(), tailwindcss(), svgr()],
    server: {
      proxy: {
        "/api/v1": {
          target,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: "",
          headers: { origin: target },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              // 일부 서버는 origin 헤더를 직접 세팅해야 통과
              proxyReq.setHeader("origin", target);
            });
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@components": fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
        "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
        "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
        "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
        "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
        "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
      },
    },
  };
});
