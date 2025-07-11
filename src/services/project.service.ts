import { error } from 'console';
import Project from '../database/models/Project';

import { UpdateProjectDto } from '../dtos/UpdateProjectDto';
import { ProjectDto } from '../dtos/ProjectDto';

export const createProject = async (project: ProjectDto) => {
  try {
    const existingProject = await Project.findOne({
      where: { name: project.name },
    });

    if (existingProject) {
      throw new Error('Project name already in use.');
    }

    const newProject = await Project.create({
      name: project.name,
      description: project.description,
      category: project.category,
      image: project.image,
      dueDate: project.dueDate,
      userId: project.userId,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    await project.destroy();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const getProject = async (
  projectIdNumber: number,
): Promise<ProjectDataDto> => {
  try {
    const project = await Project.findByPk(projectIdNumber);
    if (!project) {
      throw new Error('Project not found');
    }

    const projectDTO: ProjectDto = new ProjectDto(
      project.id,
      project.userid,
      project.name,
      project.description,
      project.category,
      project.image,
      project.dueDate,
      project.created_at,
      project.updated_at,
    );

    

    return projectDTO;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getProjectsByUserIdService = async (
  userId: number,
): Promise<ProjectDto[]> => {
  try {
    const projects = await Project.findAll({
      where: { userId: userId },
    });

    const projectDTOs: ProjectDto[] = projects.map((project) => {
      return new ProjectDto(
        project.id,
        project.userid,
        project.name,
        project.description,
        project.category,
        project.image,
        project.dueDate,
        project.created_at,
        project.updated_at,
      );
    });

    return projectDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const updateProject = async (newData: UpdateProjectDto) => {
  const project = await Project.findByPk(newData.projectId);

  if (!project) {
    throw error('Project not found');
  }
  project.name = newData.name;
  project.description = newData.description;
  project.category = newData.category;
  project.image = newData.image;
  project.dueDate = newData.dueDate;
  await project.save();
};

export const getProjectByIdService = async (
  projectId: string,
): Promise<Project | null> => {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};
