import { Request, Response, Router } from "express";
import {
  createEvent,
  getEventsByContentId,
  getEventsByTimestamp,
  getEventsByWalletAddress,
} from "../database/event";
import { IEvent, IEventFilter } from "../models/Event";
import { toJSON } from "../utils/utils";
import { ContentType } from "../models/Content";

export const eventRouter = Router();

//event on content detail page
eventRouter.get("/content/", async (req: Request, res: Response) => {
  //TODO: check if page query is less than 1 if throw cause prisma cant skip negative values
  const { id, page } = req.query;
  if (!id) {
    return res.status(400).send("ID is missing");
  }
  if (isNaN(Number(id))) {
    return res.status(400).send("Bad format");
  }
  try {
    const events = await getEventsByContentId(Number(id), Number(page));
    return res.status(200).send(toJSON(events));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//event on profile page
eventRouter.get("/user/", async (req: Request, res: Response) => {
  const { CREATED, UPDATED, LICENSING, page, address, content } = req.query;
  const filter = {
    CREATED: String(CREATED).toLowerCase() == "true",
    UPDATED: String(UPDATED).toLowerCase() == "true",
    LICENSING: String(LICENSING).toLowerCase() == "true",
    page: Number(page),
  } as unknown as IEventFilter;

  if (!address || !content || !page) {
    return res.status(400).send("Missing parameters");
  }
  if (isNaN(Number(page))) {
    return res.status(400).send("page is must be a number");
  }
  try {
    const events = await getEventsByWalletAddress(
      address.toString(),
      filter,
      content as ContentType
    );
    return res.status(200).send(toJSON(events));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

eventRouter.post("/", async (req: Request, res: Response) => {
  try {
    const data: IEvent = req.body;
    const event = await createEvent(data);
    return res.status(200).send(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error ");
  }
});

eventRouter.get("/withdraw/", async (req: Request, res: Response) => {
  const { timestamp, address } = req.query;
  try {
    const events = await getEventsByTimestamp(
      timestamp as string,
      address as string
    );
    return res.status(200).send(toJSON(events));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
