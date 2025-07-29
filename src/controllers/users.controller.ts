import { Request, Response } from 'express';
import {
  getUserData,
  updateUserPassword,
  getUserProfile,
  updateUserPasswordWithValidation,
  setReminderTime,
} from '../services/users.service';
import jwt from 'jsonwebtoken';
import { getTokenPayload } from '../services/token.service';
import { validateOrReject } from 'class-validator';
import { UpdatePasswordDto } from '../dtos/UserProfileDto';
import { getSharedProjects } from '../services/project.service';
import { getUserParticipationRequests } from '../services/community.service';

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

export const loggedIn = async (req: Request, res: Response): Promise<void> => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  if (!authToken || !refreshToken) {
    res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const userData = jwt.verify(authToken, process.env.SECRET_KEY || '123');
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const getUserProfileController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(userProfile);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        message:
          'Internal server error, check server console for more information',
      });
    }
  }
};

export const updateUserPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const { currentPassword, newPassword } = req.body;

    const passwordUpdate = new UpdatePasswordDto(currentPassword, newPassword);
    await validateOrReject(passwordUpdate);

    const isUpdated = await updateUserPasswordWithValidation(
      userId,
      currentPassword,
      newPassword,
    );

    if (!isUpdated) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        message:
          'Internal server error, check server console for more information',
      });
    }
  }
};

export const getParticipatedProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const participatedProjects = await getSharedProjects(userId);

    res.status(200).json(participatedProjects);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        message:
          'Internal server error, check server console for more information',
      });
    }
  }
};

export const getUserPendingRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const pendingRequests = await getUserParticipationRequests(userId);

    res.status(200).json(pendingRequests);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({
        message:
          'Internal server error, check server console for more information',
      });
    }
  }
};

export const setNotificationTimer = async(
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const timer = req.body.NotificationTimer;

    await setReminderTime(userId,timer);

    res.status(200).json("Notification time set.")
  } catch (error) {
    
  }
}

