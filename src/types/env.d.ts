declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CONFIGCAT_SDK_KEY: string;
    }
  }
}

export {};
