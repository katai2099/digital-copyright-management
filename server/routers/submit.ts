import { HttpStatusCode } from "axios";
import express, { Request, Response } from "express";
import multer from "multer";
import { submitAudio, submitImage, submitText } from "../controllers/submit";
import { handleDCMError } from "../utils/utils";
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const submitRouter = express.Router();

submitRouter.post(
  "/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const response = await submitImage(req.file!.buffer);
      res.status(HttpStatusCode.Created).send(response);
    } catch (error) {
      handleDCMError(error, res);
    }
  }
);
submitRouter.post(
  "/audio",
  upload.single("audio"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file!;
      const response = await submitAudio(file.buffer, file.originalname);
      return res.status(HttpStatusCode.Created).send(response);
    } catch (error) {
      handleDCMError(error, res);
    }
  }
);
submitRouter.post(
  "/text",
  upload.single("text"),
  async (req: Request, res: Response) => {
    try {
      const response = await submitText(req.file!.buffer);
      res.status(HttpStatusCode.Created).send(response);
    } catch (error) {
      handleDCMError(error, res);
    }
  }
);
