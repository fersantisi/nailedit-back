import { Request, Response } from 'express';
import User from '../database/models/User';

export const getUsers = async(req: Request, res: Response):Promise<void> =>{
    const users = await User.findAll()
    
    res.json(users)
    
}

export const getUser = async (req: Request, res:Response): Promise<void> =>{

    console.log("reached here")
    const id = req.params.id;
    const user = await User.findByPk(id)
    if (!user){
        res.status(404).json({message: "User not found"})
        return
    }
    res.json(user)
}

export const createUser = async(req: Request, res: Response): Promise<void> =>{
    
    try {
        const {name,email,password}= req.body;
        
        /**
        * verify if email is in use.
        */
        const user = await User.findOne({where:{email}});
        if (user){
            res.status(500).json({message: 'Email alredy in use.'})
            return
        }

        const newUser = await User.create({
        name,
        email,
        password
    })

    console.log(newUser)
    res.send('creating Users')
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    
    }
}

export const updateUser = async (req: Request, res:Response): Promise<void> =>{
    const id = req.params.id;
    const pass = req.body

    console.log(pass)
    const user = await User.findByPk(id);
    if(!user){
        res.status(404).json({message: "User not found"})
        return
    }
    
    user.password = pass.password

    await user.save();

    res.status(200).json({message: "password changed"})

}

export const deleteUser = async (req: Request, res:Response): Promise<void> =>{

    try {
        const {id} = req.params;
        
        

        await User.destroy({
        where: {
            id,
        },
        });
        res.sendStatus(204);

    } catch(error: unknown) {
        if (error instanceof Error){
        res.status(500).json({message: error.message})
        }
    }       
    
}

