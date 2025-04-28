import { Request, Response } from 'express';
import { setAuthCookie, setRefreshCookie } from '../utils/cookie';
import { logIn } from '../services/login.service';
import { createNewUser } from '../services/users.service';
import { LoginDto } from '../dtos/loginDto';
import { validateOrReject } from 'class-validator';
import { UserDto } from '../dtos/UserDto';


export const getLogin = async (req: Request, res: Response) => {
  try {

    const { username, password } = req.body;
    const login: LoginDto = new LoginDto(username, password)

    await validateOrReject(logIn);

    const tokens = await logIn(login.username, login.password);
    if (tokens === null) {
      res.status(409).json({ message: 'invalid credentials.' });
    } else if (tokens) {
      const { authToken, refreshToken } = tokens;

      setAuthCookie(res, authToken);
      setRefreshCookie(res, refreshToken);

      res.json({ message: 'Login successful' });
    } else {
      res.status(409).json({ message: 'invalid credentials.' });
    }

  } catch (error: unknown) {
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map(err => ({
          property: err.property,
          constraints: err.constraints
        }))
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
    
    const user:UserDto = new UserDto(username, email, password)

    await validateOrReject(user);

    if (await createNewUser(username, email, password)) {
      res.status(201).json({ message: 'user Created' });
    } else {
      res.status(409).json({ message: 'Email alredy in use' });
    }
  } catch (error: unknown) {
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map(err => ({
          property: err.property,
          constraints: err.constraints
        }))
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};
