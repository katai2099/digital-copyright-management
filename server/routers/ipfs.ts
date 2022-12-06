import { Router,Request,Response } from "express";
import { uploadNewFile } from "../controllers/ipfs";
import multer from 'multer';
import { CID } from "ipfs-http-client";
const storage = multer.memoryStorage()
const upload = multer({storage : storage})


export const ipfsRouter = Router();

ipfsRouter.post('/uploadFile',upload.single('image'),async (req,res)=>{
    let cid : string= await uploadNewFile(req.file!.buffer);
    res.send(cid);
})