import { Request, Response } from 'express';
import User from '../database/models/User';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { tokenGenerator } from './tokens/tokenGenerator';


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

                

                if(result){

                    const {authToken, refreshToken} = tokenGenerator(user);

                    res.status(200).cookie('authToken',authToken,{
                        maxAge: 1000 * 60 * 15,
                        httpOnly: true,
                        //secure: true
                        //agregar secure en prod
                    }).cookie('refreshToken',refreshToken,{
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                        httpOnly: true,
                        //secure: true
                        //agregar secure en prod
                    }).json({ message: "Login successful", admin: user.id == 1 });

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
    

