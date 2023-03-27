import axios from "axios";
import { Router } from "express";
import { getLatestContents } from "../database/content";
import { Content, ContentType } from "../models/content";
import { ILatestContents } from "../utils/common";
import { convert } from "../utils/utils";
export const contentRouter = Router();

contentRouter.get("/latestContents", async (req, res) => {
  const { content } = req.query;
  console.log(content);
  if (!content) {
    console.log("all");
  }
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

contentRouter.get("/coin", async (req, res) => {
  const price = await axios.get(
    "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=9ZRCY23TJ6WFRBKDI9VFTHST4J7H89NFBY"
  );
  res.send(price.data);
});
