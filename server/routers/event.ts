import { Request, Response, Router } from "express";
import {
  createEvent,
  getEvents,
  getEventsByContentId,
} from "../database/event";
import { IEvent, IEventFilter } from "../models/Event";
import { toJSON } from "../utils/utils";

export const eventRouter = Router();

eventRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { CREATED, UPDATED, LICENSING, page } = req.query;
    const filter = {
      CREATED: String(CREATED).toLowerCase() == "true",
      UPDATED: String(UPDATED).toLowerCase() == "true",
      LICENSING: String(LICENSING).toLowerCase() == "true",
      page: Number(page),
    } as unknown as IEventFilter;
    const events = await getEvents(filter);
    return res.status(200).send(events);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

eventRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("ID is missing");
  }
  if (isNaN(Number(id))) {
    return res.status(400).send("Bad format");
  }
  try {
    const events = await getEventsByContentId(Number(id));
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
