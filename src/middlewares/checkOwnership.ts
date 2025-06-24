import { Response, Request, NextFunction } from 'express';
import { getTokenPayload } from '../services/token.service';

export const checkOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const projectId = parseInt(req.params.projectId, 10);

    if (userId !== projectId) {
        res.status(403).json({ message: 'Forbidden: You do not own this project.' });
    }else {
        next();
    }
};