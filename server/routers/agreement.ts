import { Request, Response, Router } from "express";
import {
  createAgreement,
  getLicenserAgreement,
  getLicensingAgreement,
} from "../database/agreement";
import { Agreement } from "../models/Agreement";
import { toJSON } from "../utils/utils";

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

agreementRouter.get("/licensing/", async (req: Request, res: Response) => {
  const { address, page } = req.query;
  try {
    const agreements = await getLicensingAgreement(
      address as string,
      Number(page)
    );
    return res.status(200).send(toJSON(agreements));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

agreementRouter.get("/licenser/", async (req: Request, res: Response) => {
  const { address, page } = req.query;
  try {
    const agreements = await getLicenserAgreement(
      address as string,
      Number(page)
    );
    return res.status(200).send(toJSON(agreements));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
