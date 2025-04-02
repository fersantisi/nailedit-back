import { Request, Response } from 'express';
import User from '../database/models/User';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const getLogin = async(req: Request, res: Response) => {

    const {username, password} = req.body;
    try {
        console.log(username)
        const user = await User.findOne({where: {email: username}})

        if(!user){
            res.status(401).json({message: "User not found"})
            return
        }

        await bcrypt.compare(password, user.password).then((result)=>{

                let token: string;

                if(result){
                    console.log(user)
                    if (user.id == 1){
                        token = jwt.sign({
                            name: "fer",
                            admin: true
                        }, process.env.ADMIN_KEY || "admin")
                    }else{
                        token = jwt.sign({
                            name: "fer",
                        }, process.env.SECRET_KEY || "123")
                    }
                    
                    res.status(200).json(token)

                }else{
                    res.status(401).json({message: "wrong password"})
                }
        })
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    
    }
}
    

