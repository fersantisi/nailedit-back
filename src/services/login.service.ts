import User from '../database/models/User';
import bcrypt from 'bcrypt';
import { tokenGenerator } from '../utils/jwt';

export const logIn = async (
  username: string,
  password: string,
): Promise<{ authToken: string; refreshToken: string } | null> => {
  const user = await User.findOne({ where: { email: username } });
  if (!user) {
    return null;
  }
  const validatePassword = await bcrypt.compare(password, user.password);

  if (validatePassword) {
    return tokenGenerator(user);
  } else {
    return null;
  }
};
