import { Request, Response, Router } from "express";
import { getLicenserRequests, getLicensingRequests } from "../database/request";
import { toJSON } from "../utils/utils";

export const requestRouter = Router();

requestRouter.get("/licenser/", async (req: Request, res: Response) => {
  const { address } = req.query;
  try {
    const request = await getLicenserRequests(address as string);
    return res.status(200).send(toJSON(request));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Internal Error");
  }
});

requestRouter.get("/licensing/", async (req: Request, res: Response) => {
  const { address } = req.query;
  try {
    const request = await getLicensingRequests(address as string);
    return res.status(200).send(toJSON(request));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Internal Error");
  }
});
