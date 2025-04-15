import { Response } from 'express';

export const setAuthCookie = (res: Response, authToken: string) => {
  res.status(200).cookie('authToken', authToken, {
    maxAge: 1000 * 60 * 15,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

export const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.status(200).cookie('refreshToken', refreshToken, {
    maxAge: 1000 * 60 * 60 * 24* 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};
