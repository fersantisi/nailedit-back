import {Response,Request, NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { regenerateToken } from "../../controllers/tokens/tokenGenerator";


export const validateToken = (req:Request, res: Response, next: NextFunction)=>{

    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;

    if (authToken != undefined){

        try { 
            const tokenValido = jwt.verify(authToken,process.env.SECRET_KEY || "123" )
            next();
        } catch (error) {
            refreshSession(authToken, refreshToken,req,res);
        }

    }else{
        res.status(401).json({message: "Acces Denied."})
    }
}

export const validateAdminToken = (req:Request, res: Response, next: NextFunction)=>{

    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;

    if (authToken != undefined){

        try { 
            
            const tokenValido = jwt.verify(authToken,process.env.ADMIN_KEY || "123" )
            
            next();
        } catch (error) {
            refreshSession(authToken,refreshToken,req,res);
        }

    }else{
        res.status(401).json({message: "Acces Denied."})
    }
}

function refreshSession(token:string, refreshToken:string, req:Request, res:Response):void{

    if(refreshToken != undefined){
        try {
            const refreshValidate = jwt.verify(refreshToken,process.env.REFRESH_KEY || "refresh123")
            const payload = jwt.verify(token,process.env.SECRET_KEY || "123", {ignoreExpiration: true})as JwtPayload;
            const { iat, exp, ...cleanPayload } = payload;
            const newToken = regenerateToken(cleanPayload);
            res.status(200).json()

        } catch (error) {
            res.status(401).json({message: "Acces Denied"})
        }
    }else{
        res.status(401).json({message: "Acces Denied"})
    }
}

