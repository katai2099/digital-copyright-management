import { Request, Response, Router } from "express";
import {
  createAgreement,
  getAgreementByWalletAddress,
} from "../database/agreement";
import { Agreement } from "../models/Agreement";

export const agreementRouter = Router();

agreementRouter.post("/", async (req: Request, res: Response) => {
  const agreement: Agreement = req.body;
  try {
    const newAgreement = await createAgreement(agreement);
    return res.status(200).send(newAgreement);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

agreementRouter.get("/:walletAddress", async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  if (!walletAddress) {
    return res.status(400).send("Wallet address missing");
  }
  try {
    const agreements = await getAgreementByWalletAddress(walletAddress);
    return res.status(200).send(agreements);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
