import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  server: {
    routeRules: {
      "/_build/assets/**/*.css": {
        headers: {
          "Content-Type": "text/css"
        }
      }
    }
  },
});
