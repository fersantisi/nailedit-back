import { error } from 'console';
import Project from '../database/models/Project';
import ReservedStock from '../database/models/ReservedStock';
import sequelize from '../database/database';

import { UpdateProjectDto } from '../dtos/UpdateProjectDto';
import { ProjectDto } from '../dtos/ProjectDto';
import { ProjectDataDto } from '../dtos/ProjectDataDto';
import { unreserveStock } from './stock.service';

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
  const transaction = await sequelize.transaction();
  
  try {
    const project = await Project.findByPk(projectId, { transaction });
    if (!project) {
      throw new Error('Project not found');
    }

    // Get all reserved stock for this project
    const reservedStocks = await ReservedStock.findAll({
      where: { projectId: projectId },
      transaction
    });

    // Unreserve all stock items (this restores stock quantities)
    console.log(
      `Found ${reservedStocks.length} reserved stock items to clean up for project ${projectId}`,
    );

    for (const reservedStock of reservedStocks) {
      console.log(
        `Unreserving stock item ${reservedStock.id} (stockId: ${reservedStock.stockId}, quantity: ${reservedStock.quantity})`,
      );
      await unreserveStock(reservedStock.id);
    }

    // Now delete the project
    await project.destroy({ transaction });
    
    // Commit the transaction if everything succeeded
    await transaction.commit();
    console.log(
      `Project ${projectId} deleted successfully with ${reservedStocks.length} reserved stock items cleaned up`,
    );
    
  } catch (error) {
    // Rollback the transaction if anything failed
    await transaction.rollback();
    
    if (error instanceof Error) {
      console.log(`Error deleting project ${projectId}:`, error);
      throw error; // Re-throw to let controller handle the error response
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

    const projectDataDTO: ProjectDataDto = new ProjectDataDto(
      project.id,
      project.name,
      project.description,
      project.category,
      project.image,
      project.dueDate,
      project.created_at,
      project.updated_at,
    );

    return projectDataDTO;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getProjectsByUserIdService = async (
  userId: number,
): Promise<ProjectDataDto[]> => {
  try {
    const projects = await Project.findAll({
      where: { userId: userId },
    });

    const projectDataDTOs: ProjectDataDto[] = projects.map((project) => {
      return new ProjectDataDto(
        project.id,
        project.name,
        project.description,
        project.category,
        project.image,
        project.dueDate,
        project.created_at,
        project.updated_at,
      );
    });

    return projectDataDTOs;
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
