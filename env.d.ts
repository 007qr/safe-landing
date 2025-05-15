interface ImportMetaEnv {
    readonly VITE_TINYBIRD_TOKEN: string;
    readonly VITE_STOPPER_API_ENDPOINT: string;
    readonly VITE_USER_SERVICE_ENDPOINT: string;
    readonly VITE_INTERNAL_HASHER_SECRET: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
