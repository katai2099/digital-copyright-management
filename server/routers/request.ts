import { Request, Response, Router } from "express";
import {
  createRequest,
  createRequestEvent,
  getLicenserRequests,
  getLicensingRequests,
  updateRequest,
} from "../database/request";
import { toJSON } from "../utils/utils";
import { CreateRequestPostData, RequestEvent } from "../models/Request";
import { Request as requestModel } from "../models/Request";

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

requestRouter.post("/", async (req: Request, res: Response) => {
  const requestData: CreateRequestPostData = req.body;
  try {
    const newRequest = await createRequest(requestData.request);
    const requestEvent = new RequestEvent(
      requestData.event.transactionHash,
      newRequest.id,
      requestData.event.requestType,
      requestData.event.timestamp
    );
    const newRequestEvent = await createRequestEvent(requestEvent);
    return res.status(200).send(toJSON(newRequest));
  } catch (error) {
    console.log(error);
    return res.status(500).send("INTERNAL STATUS ERROR");
  }
});

requestRouter.put("/:id", async (req: Request, res: Response) => {
  const request: requestModel = req.body;
  let data;
  try {
    if (request.rejectReason !== "") {
      data = await updateRequest(
        request.id,
        request.requestType,
        request.rejectReason
      );
    } else {
      data = await updateRequest(request.id, request.requestType);
    }
    return res.status(200).send(toJSON(data));
  } catch (error) {
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
});
