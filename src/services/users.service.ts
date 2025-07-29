import User from '../database/models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserProfileDto } from '../dtos/UserProfileDto';
import { sendMail } from './mailer.service';

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

    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (user) {
      return false;
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      notification_time: -1
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

export const getUserDataJwt = async (token: string): Promise<User | null> => {
  try {
    const payload = jwt.verify(
      token,
      process.env.SECRET_KEY || '123',
    ) as JwtPayload;
    const userId = payload.userId;
    const user = await User.findByPk(userId);
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

export const deleteUser = async (id: string): Promise<boolean> => {
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
    return true;
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
    const hashedPassword = bcrypt.hashSync('fer123', 10);

    const newUser = await User.create({
      username: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      notification_time: -1
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const verifyEmail = async (email: string): Promise<boolean> => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const sendRecoveryLink = async (
  link: string,
  recipient: string,
): Promise<void> => {
  try {
    await sendMail(
              recipient,
              `Recover your password`,
              `We heard that you lost your GitHub password. Sorry about that!\n\n
               But don’t worry! You can use the following button to reset your password:`
          );
  } catch (error) {
    throw error;
  }
};

export const passwordRecovery = async (
  token: string,
  password: string,
): Promise<void> => {
  try {
    const payload = (await jwt.verify(
      token,
      process.env.PASSWORD_RECOVERY_KEY || '123',
    )) as JwtPayload;

    const { email, ...rest } = payload;

    console.log(email);

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      throw new Error('User not Found');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    user.password = hashedPassword;

    await user.save();
  } catch (error) {
    throw error;
  }
};



export const getUserProfile = async (
  userId: number,
): Promise<UserProfileDto | null> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }

    return new UserProfileDto(user.id, user.username, user.email);
  } catch (error) {
    throw error;
  }
};

export const updateUserPasswordWithValidation = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return false;
    }

    // Verify current password
    const isCurrentPasswordValid = bcrypt.compareSync(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return false;
    }

    // Hash new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  username: string,
  email: string,
): Promise<boolean> => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return false;
    }

    // Check if email or username already exists for other users
    const { Op } = require('sequelize');
    const existingUser = await User.findOne({
      where: {
        [Op.and]: [
          { [Op.or]: [{ email }, { username }] },
          { id: { [Op.ne]: userId } },
        ],
      },
    });

    if (existingUser) {
      return false; // Email or username already exists
    }

    user.username = username;
    user.email = email;

    await user.save();
    return true;
  } catch (error) {
    throw error;
  }
};

export const passwordRecoveryVerify = async (token: string): Promise<any> => {
  try {
    const payload = jwt.verify(
      token,
      process.env.PASSWORD_RECOVERY_KEY || '123',
    ) as JwtPayload;
    return payload;
  } catch (error) {
    throw error;
  }
};

export const setReminderTime = async (userId: number, reminderTime: number): Promise<void> => {

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not Found');
    }
    user.notification_time = reminderTime;
    user.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to get user participation requests: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while getting user participation requests',
      );
    }
  }

}
