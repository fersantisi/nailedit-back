import User from '../database/models/User';
import bcrypt from 'bcrypt';
import { tokenGenerator } from '../utils/jwt';
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const logIn = async (
  username: string,
  password: string,
): Promise<{ authToken: string; refreshToken: string } | null> => {
  const user = await User.findOne({ where: { username } });
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

export const googleLogIn = async (
  token: string
): Promise<{ authToken: string; refreshToken: string } | null> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) return null;

    let user = await User.findOne({ where: { email: payload.email } });

    if (!user) {
        const randomPassword = Math.random().toString(36).substring(2,12);

        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const googleUsername = payload.email.split('@')[0];

        user = await User.create({
          username: googleUsername || payload.email, 
          email: payload.email,
          password: hashedPassword,
          notification_time: -1,
        });
    }
    return await tokenGenerator(user);
  } catch (error) {
    console.error('Error in googleLogIn:', error);
    return null;
  }
};