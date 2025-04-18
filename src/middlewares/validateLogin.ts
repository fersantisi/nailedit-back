import { Response, Request, NextFunction } from 'express';
import { valitdatePasswordLogin } from '../validators/validatePassword';
import { validateEmail } from '../validators/validateEmail';
import { emitWarning } from 'process';

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Missing parameters' });
    return;
  }

  if (!valitdatePasswordLogin(password)) {
    res.status(400).json({ message: 'Invalid password' });
    return;
  }

  if (!validateEmail(username)) {
    res.status(400).json({ message: 'Invalid email' });
    return;
  }

  next();
};
