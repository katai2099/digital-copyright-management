import { Response,Request, Router } from "express";
import { getImageHash } from "../controllers/hashing";
import multer from 'multer';

const storage = multer.memoryStorage()
const upload = multer({storage : storage})

export const hashingRouter = Router();

hashingRouter.post("/imageHash",upload.single('image'),async (req,res)=>{
    let tmp = await getImageHash(req.file!.buffer);
    console.log(tmp);
    res.send(tmp);
})