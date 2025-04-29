import { Response, Request, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { regenerateToken, regenerateAdminToken } from '../utils/jwt';
import { getTokenPayload } from '../services/token.service';

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  if (authToken != undefined) {
    try {
      const tokenValido = jwt.verify(
        authToken,
        process.env.SECRET_KEY || '123',
      );

      next();
    } catch (error) {
      if (refreshSession(authToken, refreshToken, req, res)) {
        next();
      }
    }
  } else {
    res.status(401).json({ message: 'Acces Denied.' });
  }
};

export const validateAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  if (authToken != undefined) {
    try {
      const tokenValido = jwt.verify(authToken, process.env.ADMIN_KEY || '123');

      next();
    } catch (error) {
      if (refreshAdminSession(authToken, refreshToken, req, res)) {
        next();
      }
    }
  } else {
    res.status(401).json({ message: 'Acces Denied.' });
  }
};

function refreshSession(
  token: string,
  refreshToken: string,
  req: Request,
  res: Response,
): boolean {
  if (refreshToken != undefined) {
    try {
      const refreshValidate = jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY || 'refresh123',
      );

      const payload = getTokenPayload(token);

      const { iat, exp, ...cleanPayload } = payload;
      const newToken = regenerateToken({
        name: cleanPayload.name,
        userId: cleanPayload.userId,
      });

      res.cookie('authToken', newToken, {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
      });

      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

function refreshAdminSession(
  token: string,
  refreshToken: string,
  req: Request,
  res: Response,
): boolean {
  if (refreshToken != undefined) {
    try {
      const refreshValidate = jwt.verify(
        refreshToken,
        process.env.REFRESH_ADMIN_KEY || 'refresh123',
      );
      const payload = jwt.verify(token, process.env.ADMIN_KEY || '123', {
        ignoreExpiration: true,
      }) as JwtPayload;
      const { iat, exp, ...cleanPayload } = payload;
      const newToken = regenerateAdminToken({ name: cleanPayload.name });

      res.status(200).cookie('authToken', newToken, {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        //secure: true
        //agregar secure en prod
      });

      return true;
    } catch (error) {
      res.status(401).json({ message: 'Acces Denied' });
    }
  } else {
    res.status(401).json({ message: 'Acces Denied' });
  }
  return false;
}
