import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { isValidRequestBody } from "../bodyValidation";
import { createUser, getUserByWalletAddress } from "../database/user";
import { IUser, User } from "../models/User";
import { BODY_VALIDATION_FAIL, DatabaseError } from "../utils/Error";

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const user: IUser = req.body;
  const valid = isValidRequestBody(user, new User());
  if (!valid) {
    return res.status(400).send(BODY_VALIDATION_FAIL);
  }
  try {
    const newUser = await createUser(user);
    return res.status(HttpStatusCode.Created).send(newUser);
  } catch (error: any) {
    return res.status(error.errorCode).send(error.message);
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  const valid = walletAddress && walletAddress.length !== 0;
  if (!valid) {
    return res.status(400).send(BODY_VALIDATION_FAIL);
  }
  try {
    const user = await getUserByWalletAddress(walletAddress);
    return res.status(HttpStatusCode.Ok).send(user);
  } catch (error: any) {
    const err = error as DatabaseError;
    return res.status(err.errorCode).send(err.message);
  }
});
