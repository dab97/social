import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Инлайнит CSS-бандл в index.html: страница рендерится без блокирующего запроса стилей
function inlineCss(): Plugin {
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      for (const [fileName, file] of Object.entries(ctx.bundle)) {
        if (file.type !== "asset" || !fileName.endsWith(".css")) continue;
        const linkRe = new RegExp(`<link[^>]*href="/${fileName}"[^>]*>`);
        if (linkRe.test(html)) {
          html = html.replace(linkRe, `<style>${file.source}</style>`);
          delete ctx.bundle[fileName];
        }
      }
      return html;
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // слушать на всех интерфейсах: доступны и localhost, и IP в локальной сети
    port: 3001,
  },
  build: {
    // Один CSS-бандл на весь проект: инлайнится в index.html плагином inlineCss
    cssCodeSplit: false,
  },
});
