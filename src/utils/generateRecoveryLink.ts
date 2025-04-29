import jwt from "jsonwebtoken"


export const generateRecoveryLink = (email:string)=>{

    const recovery = jwt.sign({email}, process.env.PASSWORD_RECOVERY_KEY || "RECOVERY",{ expiresIn: "15m" })

    const link: string = `/recoverPassword/${recovery}`;

    return link

}