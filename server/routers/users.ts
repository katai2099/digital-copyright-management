import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { isValidRequestBody } from "../bodyValidation";
import { getUserByWalletAddress, updateUser } from "../database/user";
import { IUser, User } from "../models/User";
import { BODY_VALIDATION_FAIL, DatabaseError } from "../utils/Error";

export const userRouter = Router();

userRouter.get("/:walletAddress", async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  if (!walletAddress) {
    return res.status(400).send("Missing wallet address");
  }
  try {
    const user = await getUserByWalletAddress(walletAddress);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  if (!id) {
    return res.status(400).send("Missing id");
  }
  const user: IUser = req.body;
  if (user.id !== id) {
    return res.status(400).send("Params ID does not correspond with body ID");
  }
  //check when params id does not match body id
  const valid = isValidRequestBody(user, new User());
  if (!valid) {
    return res.status(400).send(BODY_VALIDATION_FAIL);
  }
  try {
    const updatedUser = await updateUser(user);
    return res.status(HttpStatusCode.Ok).send(updatedUser);
  } catch (error: any) {
    const err: DatabaseError = error;
    return res.status(err.errorCode).send(err.message);
  }
});
