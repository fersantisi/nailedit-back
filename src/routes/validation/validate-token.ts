import {Response,Request, NextFunction} from "express";
import jwt from "jsonwebtoken"



export const validateToken = (req:Request, res: Response, next: NextFunction)=>{

    const hearderToken = req.headers['authorization'];

    if (hearderToken != undefined){

        const bearerToken = hearderToken.split(" ");
        const token = bearerToken[1];

        try {
            
            const tokenValido = jwt.verify(token,process.env.SECRET_KEY || "123" )
            console.log(tokenValido);
            next();
        } catch (error) {
            res.status(401).json({message: "Token invalido"})
        }

    }else{
        res.status(401).json({message: "Acces Denied."})
    }
}

export const validateAdminToken = (req:Request, res: Response, next: NextFunction)=>{

    const hearderToken = req.headers['authorization'];

    if (hearderToken != undefined){

        const bearerToken = hearderToken.split(" ");
        const token = bearerToken[1];

        try {
            
            const tokenValido = jwt.verify(token,process.env.ADMIN_KEY || "admin" )
            console.log(tokenValido);
            next();
        } catch (error) {
            res.status(401).json({message: "Token invalido"})
        }

    }else{
        res.status(401).json({message: "Acces Denied."})
    }
}

