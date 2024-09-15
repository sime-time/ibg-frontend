/// <reference types="@solidjs/start/env" />

import { RecordModel } from "pocketbase";

interface MemberRecord extends RecordModel {
  name: string;
  username: string;
  email: string;
}

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string;
  readonly VITE_POCKETBASE_EMAIL: string;
  readonly VITE_POCKETBASE_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}