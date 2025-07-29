import { Request, Response } from 'express';
import { setAuthCookie, setRefreshCookie } from '../utils/cookie';
import { googleLogIn, logIn } from '../services/login.service';
import {
  createNewUser,
  verifyEmail,
  passwordRecovery,
  passwordRecoveryVerify,
} from '../services/users.service';
import { LoginDto } from '../dtos/loginDto';
import { validateOrReject } from 'class-validator';
import { UserDto } from '../dtos/UserDto';
import { generateRecoveryLink } from '../utils/generateRecoveryLink';

export const getLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const login: LoginDto = new LoginDto(username, password);

    await validateOrReject(logIn);

    const tokens = await logIn(login.username, login.password);
    if (tokens === null) {
      res.status(409).json({ message: 'invalid credentials.' });
    } else if (tokens) {
      const { authToken, refreshToken } = tokens;

      setAuthCookie(res, authToken);
      setRefreshCookie(res, refreshToken);

      const admin = username == 'admin';

      res.json({ message: 'Login successful', admin: admin });
    } else {
      res.status(409).json({ message: 'invalid credentials.' });
    }
  } catch (error: unknown) {
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    console.log({ username, email, password });

    const user: UserDto = new UserDto(username, email, password);

    console.log(user);

    await validateOrReject(user);

    if (await createNewUser(username, email, password)) {
      res.status(201).json({ message: 'user Created' });
    } else {
      res.status(409).json({ message: 'Email or Username alredy in use' });
    }
  } catch (error: unknown) {
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const email = req.body.email;

  if (!email) {
    res.status(500).json({ message: 'Missing mail.' });
  }

  try {
    let link: string;
    if (await verifyEmail(email)) {
      link = generateRecoveryLink(email);
    } else {
      link = 'Bad email';
    }
    // Force host to 5173 for frontend testing
    const host = 'localhost:5173';
    const protocol = req.protocol;
    const fullLink =
      link !== 'Bad email' ? `${protocol}://${host}/auth${link}` : link;
    console.log('Generated recovery link:', fullLink);
    res
      .status(200)
      .json({
        message: `Mail enviado. Por conveniencia de la materia, este es el link: ${fullLink}`,
        link: fullLink,
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const recoverPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const recoveryJwt = req.params.jwt;
  const newPassword = req.body.password;
  try {
    await passwordRecovery(recoveryJwt, newPassword);
    res.status(200).json({ message: 'Password Changed' });
  } catch (error) {
    if (error instanceof Error) {
      console.log({ message: error.message });
      res.status(500).json({
        message: 'Server ERROR. Check server logs for more information.',
      });
    }
  }
};

export const verifyRecoveryToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const recoveryJwt = req.params.jwt;
  try {
    // Just verify the token, don't need to do anything else
    const payload = await passwordRecoveryVerify(recoveryJwt);
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    console.log('Logout successful');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const google = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.body;
    const tokens = await googleLogIn(token);
    
    if(tokens){
      
      const { authToken, refreshToken } = tokens;

      setAuthCookie(res, authToken);
      setRefreshCookie(res, refreshToken);


      res.json({ message: 'Login successful', admin: false });
    }
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
