import { Response, Request, Router } from "express";
import {
  compareImageHash,
  compareTextHash,
  getAudioHash,
  getImageHash,
  getTextHash,
  recognizeAudioHash,
} from "../controllers/hashing";
import multer from "multer";
import { convert, handleDCMError } from "../utils/utils";
import { AxiosError } from "axios";
import { getAudioByHash } from "../database/content";
import { Content } from "../models/Content";
import { HashingError } from "../utils/Error";
import { IErrorResponse } from "../models/common";
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
export const hashingRouter = Router();

hashingRouter.post(
  "/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      let hash = await getImageHash(req.file?.buffer!);
      await compareImageHash(hash);
      return res.send(hash);
    } catch (error) {
      handleDCMError(error, res);
    }
  }
);

hashingRouter.post(
  "/text",
  upload.single("text"),
  async (req: Request, res: Response) => {
    try {
      const text = Buffer.from(req.file!.buffer).toString();
      let hash = await getTextHash(text);
      await compareTextHash(hash);
      return res.status(200).send(hash);
    } catch (error) {
      handleDCMError(error, res);
    }
  }
);

hashingRouter.post(
  "/audio",
  upload.single("audio"),
  async (req: Request, res: Response) => {
    try {
      const hash = await recognizeAudioHash(
        req.file!.buffer,
        req.file!.originalname
      );
      return res.send(hash);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 400) {
          const sha = error.response.data;
          const audio = await getAudioByHash(sha);
          const content = convert<Content>(audio);
          return res.status(409).send({
            message: "Audio with similar content already exists",
            statusCode: 409,
            contentId: content.id,
          } as IErrorResponse);
        }
      }
    }
  }
);
