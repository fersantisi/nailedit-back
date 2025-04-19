import { Request, Response } from 'express';
import Project from '../database/models/Project';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, image, duedate } = req.body;

    console.log(duedate);

    

    
    if (project) {
      res.status(418).json({ message: 'Project name already in use.' });
      return;
    }

    const newProject = await Project.create({
      name,
      description,
      category,
      image,
      duedate,
    });

    res.status(201).json({
      message: 'Project created',
      ...newProject,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  const project = await Project.findByPk(id);
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }
  await Project.destroy({ where: { id } });
  res.json({ message: 'Project deleted' });
};
