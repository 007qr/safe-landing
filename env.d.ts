interface ImportMetaEnv {
    readonly VITE_TINYBIRD_TOKEN: string;
    readonly VITE_STOPPER_API_ENDPOINT: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
