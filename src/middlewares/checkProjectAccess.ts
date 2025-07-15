import { Response, Request, NextFunction } from 'express';
import { getTokenPayload } from '../services/token.service';
import { checkProjectPermissions } from '../services/project.service';
import { validateProjectId } from '../utils/validateProjectId';

export const checkProjectAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const projectId = validateProjectId(req.params.projectId);

    if (projectId === null) {
      res.status(400).json({ message: 'Invalid project ID provided.' });
      return;
    }

    const permissions = await checkProjectPermissions(projectId, userId);

    if (!permissions.hasAccess) {
      res.status(403).json({
        message: 'Forbidden: You do not have access to this project.',
      });
      return;
    }

    // Add permission info to request for use in controllers
    (req as any).projectPermissions = permissions;
    next();
  } catch (error) {
    console.error('Error checking project access:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const checkProjectOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const projectId = validateProjectId(req.params.projectId);

    if (projectId === null) {
      res.status(400).json({ message: 'Invalid project ID provided.' });
      return;
    }

    const permissions = await checkProjectPermissions(projectId, userId);

    if (!permissions.hasAccess) {
      res.status(403).json({
        message: 'Forbidden: You do not have access to this project.',
      });
      return;
    }

    if (permissions.role !== 'owner') {
      res.status(403).json({
        message: 'Forbidden: Only project owners can perform this action.',
      });
      return;
    }

    // Add permission info to request for use in controllers
    (req as any).projectPermissions = permissions;
    next();
  } catch (error) {
    console.error('Error checking project ownership:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
