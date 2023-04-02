import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import {
  getContentById,
  getContentByhash,
  getContents,
  getContentsByWalletAddress,
  getLatestContents,
} from "../database/content";
import { ILatestContents } from "../models/common";
import { Content, ContentType, IContentFilter } from "../models/Content";
import { convert, toJSON } from "../utils/utils";
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
