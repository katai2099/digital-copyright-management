import { HttpStatusCode } from "axios";
import express, { Request, Response } from "express";
import multer from "multer";
import { submitAudio, submitImage, submitText } from "../controllers/submit";
import { HashingError } from "../utils/Error";
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
      res.status(HttpStatusCode.InternalServerError).send("Error");
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
      res.status(HttpStatusCode.Created).send(response);
    } catch (error) {
      if (error instanceof HashingError) {
        return res.status(HttpStatusCode.BadRequest).send(error.content);
      }
      res.status(HttpStatusCode.InternalServerError).send("Error");
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
      res.status(HttpStatusCode.InternalServerError).send("Error");
    }
  }
);
