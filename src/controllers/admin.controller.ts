import { Request, Response } from 'express';
import User from '../database/models/User';
import { getAllUsers, deleteUser } from '../services/users.service';
import {
  getUserData,
} from '../services/users.service';
import jwt from 'jsonwebtoken';

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
      console.log(error.message);
      res
        .status(500)
        .json({ message: 'Server erros, check server console for more info' });
    }
  }
};

export const isAdminLogged = async (req: Request, res: Response): Promise<void> => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  if (!authToken || !refreshToken) {
    res.status(401).json({ message: 'Not logged in' });
    return;
  }

  try {
    const userData = jwt.verify(authToken, process.env.ADMIN_KEY || '123');
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const getAdmin = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  //verify data
  try {
    const user = await getUserData(id);
    if (user != null) {
      //do stuff
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: 'user not found' });
    }
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
 