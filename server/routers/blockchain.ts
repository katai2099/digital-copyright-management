import { Response, Request, Router } from "express";
import { getAccounts } from "../controllers/web3";

export const blockchainRouter = Router();

blockchainRouter.get("/accounts", async (req, res) => {
  let tmp = await getAccounts();
  console.log(tmp);
  res.status(200).send(tmp.toString());
});
