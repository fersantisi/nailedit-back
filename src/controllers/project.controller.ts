import { Request, Response } from 'express';
import { ProjectDto } from '../dtos/ProjectDto';
import { getTokenPayload } from '../services/token.service';
import {
  createProject,
  deleteProject,
  getProject,
} from '../services/project.service';
import { ProjectDataDto } from '../dtos/ProjectDataDto';

export const createNewProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const { name, description, category, image, dueDate } = req.body;

    console.log('reached 2');
    const project: ProjectDto = new ProjectDto(
      name,
      description,
      category,
      image,
      dueDate,
      userId,
    );
    await createProject(project);

    res.status(201).json({
      message: 'Project created',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const deleteAProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = req.params.id;
    console.log(projectId);
    await deleteProject(projectId);
    res.status(200).json({
      message: 'Project deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const getAProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const project: ProjectDataDto = await getProject(projectId);

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const modifyAProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  
};
