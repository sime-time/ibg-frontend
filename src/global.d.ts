/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly POCKETBASE_URL: string;
  readonly POCKETBASE_EMAIL: string;
  readonly POCKETBASE_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}