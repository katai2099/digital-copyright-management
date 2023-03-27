import { Response, Request, Router } from "express";
import {
  getAudioHash,
  getImageHash,
  getTextHash,
} from "../controllers/hashing";
import { HttpStatusCode } from "axios";
import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
export const hashingRouter = Router();

hashingRouter.post(
  "/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      let hash = await getImageHash(req.file?.buffer!);
      console.log(hash);
      res.send(hash);
    } catch (error) {
      res
        .status(HttpStatusCode.InternalServerError)
        .send("Internal server error");
    }
  }
);

hashingRouter.post(
  "/text",
  upload.single("text"),
  async (req: Request, res: Response) => {
    const text = Buffer.from(req.file!.buffer).toString();
    let hash = await getTextHash(text);
    console.log(hash);
    res.status(200).send(hash);
  }
);

hashingRouter.post(
  "/audio",
  upload.single("audio"),
  async (req: Request, res: Response) => {
    try {
      const tmp = await getAudioHash(req.file!.buffer, req.file!.originalname);
      res.send(tmp);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
