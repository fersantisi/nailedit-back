import { Request, Response } from 'express';
import User from '../database/models/User';
import {
  getAllUsers,
  deleteUser,
} from '../services/users.service';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
    console.log(users)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        message:
          'internal server error, check server console for more information',
      });
    }
  }
};

export const deleteAUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    // validate data

    const userDeleted = await deleteUser(id)
    if(userDeleted){
      res.status(204).json({message: "User Deleted"});
    }else{
      res.status(409).json({message: "User not found"});
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
      res.status(500).json({ message: "Server erros, check server console for more info" });
    }
  }
};
