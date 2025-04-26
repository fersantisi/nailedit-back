import User from '../database/models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const createNewUser = async (
  username: string,
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    /**
     * verify if email is in use.
     */
    const { Op } = require('sequelize');

    const user = await User.findOne({ where: {[Op.or]: [{email}, {username}]}});
    if (user) {
      return false;
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (id: string): Promise<User | null> => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserDataJwt = async (token:string): Promise<User | null> => {
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const userId = payload.userId;
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
};


export const getAllUsers = async (): Promise<User[]> => {
  try {
    const user = await User.findAll();
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserPassword = async (
  pass: string,
  UserId: string,
): Promise<boolean> => {
  const user = await User.findByPk(UserId);
  if (!user) {
    return false;
  }

  user.password = pass;

  await user.save();
  return true;
};

export const deleteUser = async (id:string): Promise<boolean> => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }
    
    await User.destroy({
      where: {
        id,
      },
    });
    return true
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (): Promise<void> => {
  const user = await User.findByPk(1);

  if (user != undefined) {
    return;
  }

  try {
    const hashedPassword = bcrypt.hashSync('admin', 10);

    const newUser = await User.create({
      username: 'admin',
      email: 'admin@admin',
      password: hashedPassword,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};
