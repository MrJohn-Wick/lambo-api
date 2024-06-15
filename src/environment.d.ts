import { User } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT?: string;
      JWT_SECRET: string;
      PASS_SALT: string;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
      user: User;
  }
}


export {}