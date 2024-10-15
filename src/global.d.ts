/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string;
  readonly VITE_POCKETBASE_EMAIL: string;
  readonly VITE_POCKETBASE_PASSWORD: string;
  readonly VITE_DOCUSEAL_URL: string;
  readonly VITE_PERSONAL_PHONE_ID: string;
  readonly VITE_EMERGENCY_PHONE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  docusealForm: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    'docuseal-form': any;
  }
}