declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_USER: string;
      AUTH_PASS: string;
      AUTH_REALM: string;
      COMPOSE_DIR: string;
      PORT: number;
    }
  }
}
export {};
