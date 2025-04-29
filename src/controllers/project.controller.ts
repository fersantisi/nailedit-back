import { Request, Response } from 'express';
import { ProjectDto } from '../dtos/ProjectDto';
import { getTokenPayload } from '../services/token.service';
import {
  createProject,
  deleteProject,
  getProject,
  getProjectsByUserIdService,
  updateProjectCategory,
  updateProjectDescription,
  updateProjectDuedate,
  updateProjectImage,
  updateProjectName,
} from '../services/project.service';
import { ProjectDataDto } from '../dtos/ProjectDataDto';
import { validateOrReject } from 'class-validator';
import { log } from 'console';

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
      // Validation error from class-validator
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

export const updateAProjectName = async(req: Request, res: Response):Promise<void>=> {
  const name = req.body.name;
  const projectIdStr = req.params.projectId;
  const projectIdNumber = +projectIdStr;
  if(!name){
    res.status(400).json({message: "Invalid Name."})
  }

  try {
    updateProjectName(name, projectIdNumber);
    res.status(200).json({message: "Name changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
  

}
export const updateAProjectDescription = async(req: Request, res: Response):Promise<void>=> {

  const description = req.body.description;
  const projectIdStr = req.params.projectId;
  const projectIdNumber = +projectIdStr;
  if(!description){
    res.status(400).json({message: "Invalid description."})
  }

  try {
    updateProjectDescription(description, projectIdNumber);
    res.status(200).json({message: "Description changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
}
export const updateAProjectCategory = async(req: Request, res: Response):Promise<void>=> {
  const category = req.body.category;
  const projectIdStr = req.params.projectId;
  const projectIdNumber = +projectIdStr;
  if(!category){
    res.status(400).json({message: "Invalid Category."})
  }

  try {
    updateProjectCategory(category, projectIdNumber);
    res.status(200).json({message: "Name changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
}
export const updateAProjectImage = async(req: Request, res: Response):Promise<void>=> {
  const image = req.body.image;
  const projectIdStr = req.params.projectId;
  const projectIdNumber = +projectIdStr;
  if(!image){
    res.status(400).json({message: "Invalid Image."})
  }

  try {
    updateProjectImage(image, projectIdNumber);
    res.status(200).json({message: "Inmage changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
}
export const updateAProjectDuedate = async(req: Request, res: Response):Promise<void>=> {
  const duedate = req.body.image;
  const projectIdStr = req.params.projectId;
  const projectIdNumber = +projectIdStr;
  if(!duedate){
    res.status(400).json({message: "Invalid Image."})
  }

  try {
    updateProjectDuedate(duedate , projectIdNumber);
    res.status(200).json({message: "Inmage changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
}