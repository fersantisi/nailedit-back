import { Request, Response } from 'express';
import Project from '../database/models/Project';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, image, dueDate } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Name field is required' });
      return;
    }

    const project = await Project.findOne({ where: { name } });
    if (project) {
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
