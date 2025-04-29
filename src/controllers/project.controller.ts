import { Request, Response } from 'express';
import { ProjectDto } from '../dtos/ProjectDto';
import { getTokenPayload } from '../services/token.service';
import {
  createProject,
  deleteProject,
  getProject,
  getProjectsByUserIdService,
  updateProject,
} from '../services/project.service';
import { ProjectDataDto } from '../dtos/ProjectDataDto';
import { validateOrReject } from 'class-validator';
import { UpdateProjectDto } from '../dtos/UpdateProjectDto';

export const createNewProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const { name, description, category, image, dueDate } = req.body;

    console.log(dueDate);
    

    const project: ProjectDto = new ProjectDto(
      name,
      description,
      category,
      image,
      dueDate,
      userId,
    );

    console.log(project);

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
      res.status(418).json({ message: error.message });
    }
  }
};

export const updateAProject = async(req: Request, res: Response):Promise<void>=> {
  try{
    const { name, description, category, image, dueDate } = req.body;
    const projectIdStr = req.params.projectId;
    const projectIdNumber = +projectIdStr;

    const project: UpdateProjectDto = new UpdateProjectDto(
      name,
      description,
      category,
      image,
      dueDate,
      projectIdNumber,
    );

    await validateOrReject(project);

    await updateProject(project);

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
}
