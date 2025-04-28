import { Request, Response } from 'express';
import User from '../database/models/User';
import {
  createNewUser,
  getUserData,
  updateUserPassword,
} from '../services/users.service';

export const getUser = async (req: Request, res: Response): Promise<void> => {
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


export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  const pass = req.body.password;
  //add validation
  try {
    await updateUserPassword(pass, id);
    res.status(200).json({ message: 'password changed' });
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

