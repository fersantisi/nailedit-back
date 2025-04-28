import jwt from "jsonwebtoken"


export const generateRecoveryLink = (userId:string)=>{

    const recovery = jwt.sign({}, process.env.PASSWORD_RECOVERY_KEY || "RECOVERY",{ expiresIn: "15m" })


    const link:string = `${process.env.BASE_URL || "http://localhost"}/auth/recoverPassword/${recovery}`

    return link


}