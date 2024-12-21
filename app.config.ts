import { defineConfig } from "@solidjs/start/config";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa"

const vitePWAManifest: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
  devOptions: {
    enabled: true,
  },
  manifest: {
    name: "Indy Boxing and Grappling App",
    short_name: "IBG",
    description: "An app to manage gym memberships.",
    start_url: "/",
    display: "standalone",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }
}

export default defineConfig({
  ssr: false,
  vite: {
    plugins: [VitePWA(vitePWAManifest)]
  },
});
