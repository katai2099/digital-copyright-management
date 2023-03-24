import { Router, Request, Response } from "express";
import { uploadFileToIPFS } from "../controllers/ipfs";
import multer from "multer";
import { HttpStatusCode } from "axios";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const ipfsRouter = Router();

ipfsRouter.post(
  "/uploadFile",
  upload.fields([{ name: "image" }, { name: "audio" }, { name: "text" }]),
  async (req, res) => {
    const files = req.files! as { [fieldname: string]: Express.Multer.File[] };
    let file: Express.Multer.File;
    if (files["image"][0]) {
      file = files["image"][0];
    } else if (files["audio"][0]) {
      file = files["audio"][0];
    } else if (files["text"][0]) {
      file = files["text"][0];
    } else {
      return res.status(HttpStatusCode.BadRequest).send("No file provided");
    }
    let cid: string = await uploadFileToIPFS(file!.buffer);
    res.send(cid);
  }
);
