/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JWT_PRIVATE_KEY: string;
  readonly VITE_POWERSYNC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
