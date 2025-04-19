import { Request, Response } from 'express';
import User from '../database/models/User';
import jwt from "jsonwebtoken"


export const tokenGenerator = (user:User):{authToken: string, refreshToken: string } => {

    let authToken: string;
    let refreshToken: string;

    if (user.id == 1){
        authToken = jwt.sign({
            name: user.username,
            admin: true
        }, process.env.ADMIN_KEY || "admin",{ expiresIn: "15m" })

        refreshToken = jwt.sign({
            refresh: true,
            admin: true
        }, process.env.REFRESH_ADMIN_KEY || "refresh123",{
            expiresIn: "7d"
        }) 

    }else{
        authToken = jwt.sign({
            name: user.username,
        }, process.env.SECRET_KEY || "123",{ expiresIn: "15m" })

        refreshToken = jwt.sign({
            refresh: true
        }, process.env.REFRESH_KEY || "refresh123",{
            expiresIn: "7d"
        }) 
    }
    return {authToken,refreshToken}
}

export const regenerateToken = (payload:{name:string,admin?:boolean}): string =>{

    let authToken: string;

    authToken = jwt.sign(payload, process.env.SECRET_KEY || "123",{ expiresIn: "15m" })

    return authToken
}

export const regenerateAdminToken = (payload:{name:string,admin?:boolean}): string =>{

    let authToken: string;

    authToken = jwt.sign(payload, process.env.ADMIN_KEY || "123",{ expiresIn: "15m" })

    return authToken
}


