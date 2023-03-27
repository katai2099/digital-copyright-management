import axios from "axios";
import { Request, Response, Router } from "express";
import {
  getContentByhash,
  getContents,
  getLatestContents,
} from "../database/content";
import { IContentFilter, ILatestContents } from "../models/common";
import { Content, ContentType } from "../models/content";
import { convert } from "../utils/utils";
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

contentRouter.get("/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  if (!hash) {
    return res.status(400).send("Missing content hash");
  }
  try {
    const content = await getContentByhash(hash);
    return res.status(200).send(content);
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
    return res.status(200).send(contents);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
  res.send(filter);
});
