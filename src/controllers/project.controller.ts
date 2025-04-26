import { Request, Response } from 'express';
import Project from '../database/models/Project';
import { ProjectDto } from '../dtos/ProjectDto';
import { getUserData } from '../services/users.service';

export const create = async (req: Request, res: Response): Promise<void> => {



  try {

    const userId = getUserDataJwt(req.cookies.authToken);

    const { name, description, category, image, dueDate } = req.body;

    const project:ProjectDto = new ProjectDto(name, description, category, image, dueDate, userId)


    const existingProject = await Project.findOne({ where: { name } });
    if (existingProject) {
      res.status(418).json({ message: 'Project name already in use.' });
      return;
    }

    const newProject = await Project.create({
      name,
      description,
      category,
      image,
      dueDate,
    });


    res.status(201).json({
      message: 'Project created',
      name,
      description,
      category,
      image,
      dueDate,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};


