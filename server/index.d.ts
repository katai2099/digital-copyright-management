import { Express } from "express-serve-static-core";


interface TokenData {
  userId: number;
}

declare module "express-serve-static-core" {
  interface Request {
    tokenData: TokenData;
  }
}
