import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?:any
}


export const verifyToken = (req:Request, res:Response, next:NextFunction):void => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({
            error:"Token not found or format is incorrect asdas."
        });
        return;
    }

    const token = authHeader.split(" ")[1];
    try{
        const secretKey = process.env.SECRET_KEY as string;
        const decode    = jwt.verify(token, secretKey);
        (req as any).user = decode;
        next();
    }catch(e){
        res.status(401).json({error:"Invalid or expired token."})

    }
}