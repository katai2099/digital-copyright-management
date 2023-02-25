import { Response, Request, Router } from "express";
import { getImageHash, getTextHash } from "../controllers/hashing";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const hashingRouter = Router();

hashingRouter.post("/imageHash", upload.single("image"), async (req, res) => {
  let tmp = await getImageHash(req.file!.buffer);
  console.log(tmp);
  res.send(tmp);
});

hashingRouter.post("/textHash", upload.single("txt"), async (req, res) => {
  const tmp = Buffer.from(req.file!.buffer).toString();
  console.log(tmp);

  let hash = await getTextHash(tmp);
  console.log(hash);

  res.status(200).send(tmp);
});
