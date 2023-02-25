import jwt from 'jsonwebtoken';
import { LoginData } from '../models/User';

const JWT_SECRET_KEY = 'COPYRIGHT'

function sign (data: LoginData) : string{
   const token =  jwt.sign(data,JWT_SECRET_KEY);
   return token;
}

function decode (token: string) {
    jwt.verify(token,JWT_SECRET_KEY,(err,payload)=>{
        if(err){
            return new Error(err.message);
        }
        return payload;
    })
}

module.exports = {
    sign,
    decode
}