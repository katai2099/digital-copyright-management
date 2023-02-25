import { Request, Response, NextFunction} from 'express';
import { findUserByEmail } from './controllers/db';

export async function validateJwt(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'];
    
    if(!token || token === ''){
        return res.status(401).send("TOKEN REQUIRED");
    }
    // console.log(token)
    // const user = await findUserByEmail(token as string);
    // req.tokenData.userId = user!.id;
    next();
}

