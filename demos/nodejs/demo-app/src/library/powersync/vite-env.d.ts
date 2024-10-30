/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_POWERSYNC_URL: string;
  readonly VITE_CHECKPOINT_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
