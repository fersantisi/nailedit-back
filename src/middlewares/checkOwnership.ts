import { Response, Request, NextFunction } from 'express';
import { getTokenPayload } from '../services/token.service';
import Project from '../database/models/Project';
import { validateProjectId } from '../utils/validateProjectId';

export const checkOwnership = async (
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

        const project = await Project.findByPk(projectId);
        if (!project) {
            res.status(404).json({ message: 'Project not found.' });
            return;
        }

        if (project.userId !== userId) {
            res.status(403).json({ message: 'Forbidden: You do not own this project.' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking ownership:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};