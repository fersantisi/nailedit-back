import { Request, Response } from 'express';

export const getUsers = (req: Request,res: Response) =>{
    console.log(req,res);
    res.send('getting Users')
    
}


export const createUser = (req: Request,res: Response) =>{
    res.send('creating Users')
}