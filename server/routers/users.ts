import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { isValidRequestBody } from "../bodyValidation";
import { updateUser } from "../database/user";
import { IUser, User } from "../models/User";
import { BODY_VALIDATION_FAIL, DatabaseError } from "../utils/Error";

export const userRouter = Router();

userRouter.get("/:wallet-address");

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
