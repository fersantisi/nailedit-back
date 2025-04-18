import User from '../database/models/User';
import bcrypt from 'bcrypt';

export const createNewUser = async (
  name: string,
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    /**
     * verify if email is in use.
     */
    const user = await User.findOne({ where: { email } });
    if (user) {
      return false;
    }

    const newUser = await User.create({
      name,
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
      name: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};
