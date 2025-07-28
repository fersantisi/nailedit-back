import { Request, Response } from 'express';
import { getTokenPayload } from '../services/token.service';
import {
  createProject,
  deleteProject,
  getProject,
  getProjectsByUserIdService,
  getSharedProjects,
  searchProjects,
  updateProject,
  checkProjectPermissions,
  createProjectReminder,
  updateProjectReminder,
  removeProjectReminder,
} from '../services/project.service';
import { validateProjectId } from '../utils/validateProjectId';
import { validateOrReject } from 'class-validator';
import { UpdateProjectDto } from '../dtos/UpdateProjectDto';

import { ProjectDto } from '../dtos/ProjectDto';
import { ProjectDataDto } from '../dtos/ProjectDataDto';

export const createNewProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const { name, description, category, image, dueDate, privacy } = req.body;

    console.log(dueDate);

    const project: ProjectDto = new ProjectDto(
      name,
      description,
      category,
      image,
      dueDate,
      userId,
      privacy
    );

    await validateOrReject(project);

    await createProject(project);

    res.status(201).json({
      message: 'Project created',
    });
  } catch (error: unknown) {
    console.log(error);
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

export const deleteAProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    console.log(projectId);
    await deleteProject(projectId);
    res.status(200).json({
      message: 'Project deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const getAProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    const projectIdNumber = +projectId;

    console.log(projectId);

    const project: ProjectDataDto = await getProject(projectIdNumber);
    console.log(project);

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const getProjectsByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const projects: ProjectDataDto[] = await getProjectsByUserIdService(userId);
    console.log(projects);

    res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateAProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, privacy, description, category, image, dueDate } = req.body;

    const projectIdStr = req.params.projectId;
    const projectIdNumber = +projectIdStr;

    const project: UpdateProjectDto = new UpdateProjectDto(
      name,
      privacy,
      description,
      category,
      image,
      dueDate,
      projectIdNumber,
    );

    await validateOrReject(project);

    await updateProject(project);

    res.status(201).json({
      message: 'Project updated',
    });
  } catch (error: unknown) {
    console.log(error);
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

export const searchProjectsCommunity = async (req: Request, res: Response) => {
  const q = req.query.q?.toString() || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const result = await searchProjects(q, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ message: 'Error searching projects' });
  }
};

export const getAllSharedProjects = async (req: Request, res: Response) => {
  const userId = await getTokenPayload(req.cookies.authToken).userId;

  try {
    const sharedProjects = await getSharedProjects(userId);

    res.status(200).json(sharedProjects);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const checkProjectPermissionsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = validateProjectId(req.params.projectId);
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    if (projectId === null) {
      res.status(400).json({ message: 'Invalid project ID provided.' });
      return;
    }

    const permissions = await checkProjectPermissions(projectId, userId);

    res.status(200).json({
      projectId,
      userId,
      hasAccess: permissions.hasAccess,
      role: permissions.role,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const createNewProjectReminder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = Number(req.params.projectId);
    const notificationTime = req.body;

    await createProjectReminder(projectId, notificationTime);

    res.status(200).json({
      message: 'Reminder created.',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const updateAProjectReminder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {

    const {reminderId , notificationTime} = req.body;
    await updateProjectReminder(reminderId, notificationTime);

    res.status(200).json({
      message: 'Reminder updated.',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const deleteAProjectReminder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const remainderId = req.body;

    await removeProjectReminder(remainderId);

    res.status(200).json({
      message: 'Reminder deleted.',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};