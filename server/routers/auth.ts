import { Router } from "express";
import { isValidRequestBody } from "../bodyValidation";
// import { createNewUser } from "../controllers/db";
import { validateJwt } from "../middleware";
import { IUser, User } from "../models/User";

export const authRouter = Router();

// authRouter.post("/login",validateJwt,(req,res)=>{
//     try{
//     }catch(err){

//     }
// })

// authRouter.post("/register",async (req,res)=>{
//     const user : IUser = req.body;
//     const isValid = isValidRequestBody(user,new User());
//     res.send(isValid)
//     // const ok = await createNewUser(user);
//     // res.send(ok);
// })
