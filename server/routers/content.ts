import { NextFunction, Request, Response, Router } from "express";
import {
  createContent,
  getContentById,
  getContentByhash,
  getContents,
  getContentsByWalletAddress,
  getLatestContents,
  updateContent,
} from "../database/content";
import { ILatestContents } from "../models/common";
import {
  Content,
  ContentType,
  CreateContentPostData,
  IContentFilter,
} from "../models/Content";
import { convert, toJSON } from "../utils/utils";
import { Event } from "../models/Event";
import { EventType } from "../models/Event";
import { createEvent } from "../database/event";

export const contentRouter = Router();

contentRouter.get("/latestContents", async (req: Request, res: Response) => {
  try {
    const imagesRaw = await getLatestContents(ContentType.IMAGE);
    const audioRaw = await getLatestContents(ContentType.AUDIO);
    const textsRaw = await getLatestContents(ContentType.TEXT);
    const images = convert<Content[]>(imagesRaw);
    const audio = convert<Content[]>(audioRaw);
    const texts = convert<Content[]>(textsRaw);
    const response = {
      all: [images.slice(0, 5), audio.slice(0, 5), texts.slice(0, 5)].flat(),
      images: images,
      audio: audio,
      texts: texts,
    } as ILatestContents;
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("INTERNAL SERVER ERROR");
  }
});

contentRouter.get(
  "/user/:walletAddress/",
  async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params;
    const query = req.query;
    const filter = query as unknown as IContentFilter;

    if (!params || params.walletAddress.length === 0) {
      return res.status(400).send("BAD REQUEST");
    }
    if (JSON.stringify(query) === "{}") {
      return next();
    }
    console.log(query);
    try {
      const contents = await getContentsByWalletAddress(
        params.walletAddress,
        filter
      );
      return res.status(200).send(toJSON(contents));
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

contentRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Missing ID");
  }
  if (isNaN(Number(id))) {
    return res.status(400).send("Bad format");
  }
  try {
    const content = await getContentById(Number(id));
    return res.status(200).send(toJSON(content));
  } catch (error) {
    //TODO: handle case where database row is not found
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
contentRouter.get("/", async (req: Request, res: Response) => {
  const query = req.query;
  const filter = query as unknown as IContentFilter;
  try {
    const contents = await getContents(filter);
    return res.status(200).send(toJSON(contents));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

contentRouter.post("/", async (req: Request, res: Response) => {
  const data: CreateContentPostData = req.body;
  try {
    console.log(data.content);
    const content = await createContent(data.content);
    const event = new Event(
      data.event.transactionHash,
      content.id,
      EventType.CREATE,
      data.event.caller,
      data.event.caller,
      data.event.timestamp,
      content.price
    );
    const newEvent = await createEvent(event);
    console.log(newEvent);
    console.log(content);
    return res.send(content.id.toString());
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

contentRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Content = req.body;
  if (!id) {
    return res.status(400).send("Missing id");
  }
  try {
    const content = await updateContent(
      Number(id),
      body.price,
      body.fieldOfUse
    );
    return res.status(200).send("OK");
  } catch (error) {
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
});
