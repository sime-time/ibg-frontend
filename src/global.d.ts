/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string;
  readonly VITE_POCKETBASE_EMAIL: string;
  readonly VITE_POCKETBASE_PASSWORD: string;
  readonly VITE_STRIPE_CUSTOMER_URL: string;
  readonly VITE_IBG_VIDEO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
