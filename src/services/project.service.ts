import { error } from 'console';
import Project from '../database/models/Project';
import ReservedStock from '../database/models/ReservedStock';
import sequelize from '../database/database';
import User from '../database/models/User';
import File from '../database/models/File';
import fs from 'fs';
import path from 'path';

import { UpdateProjectDto } from '../dtos/UpdateProjectDto';
import { ProjectDto } from '../dtos/ProjectDto';
import { ProjectDataDto } from '../dtos/ProjectDataDto';
import { UserBasicDto } from '../dtos/UserBasicDto';
import { unreserveStock } from './stock.service';
import { Op } from 'sequelize';
import ProjectParticipant from '../database/models/ProjectParticipant';

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
      privacy: project.privacy
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

    // 1. Get all files for this project and delete them from filesystem
    const projectFiles = await File.findAll({
      where: { projectId: projectId },
      transaction,
    });

    console.log(
      `Found ${projectFiles.length} files to clean up for project ${projectId}`,
    );

    // Delete physical files from filesystem
    for (const file of projectFiles) {
      try {
        const fullPath = path.join(
          process.cwd(),
          file.path.startsWith('/') ? file.path.slice(1) : file.path,
        );
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        }
      } catch (fileError) {
        console.warn(`Failed to delete file ${file.path}:`, fileError);
        // Continue with deletion even if some files can't be deleted
      }
    }

    // Delete project upload directory if it exists
    try {
      const projectUploadDir = path.join(
        process.cwd(),
        'uploads',
        'projects',
        projectId,
      );
      if (fs.existsSync(projectUploadDir)) {
        fs.rmSync(projectUploadDir, { recursive: true, force: true });
        console.log(`Deleted project upload directory: ${projectUploadDir}`);
      }
    } catch (dirError) {
      console.warn(`Failed to delete project directory:`, dirError);
    }

    // 2. Remove all project participants (team members)
    const projectParticipants = await ProjectParticipant.findAll({
      where: { projectId: projectId },
      transaction,
    });

    console.log(
      `Found ${projectParticipants.length} project participants to remove for project ${projectId}`,
    );

    await ProjectParticipant.destroy({
      where: { projectId: projectId },
      transaction,
    });

    // 3. Get all reserved stock for this project and unreserve them
    const reservedStocks = await ReservedStock.findAll({
      where: { projectId: projectId },
      transaction,
    });

    console.log(
      `Found ${reservedStocks.length} reserved stock items to clean up for project ${projectId}`,
    );

    // Unreserve all stock items (this restores stock quantities)
    for (const reservedStock of reservedStocks) {
      console.log(
        `Unreserving stock item ${reservedStock.id} (stockId: ${reservedStock.stockId}, quantity: ${reservedStock.quantity})`,
      );
      await unreserveStock(reservedStock.id);
    }

    // 4. Finally delete the project (this will cascade delete files due to FK constraints)
    await project.destroy({ transaction });

    // Commit the transaction if everything succeeded
    await transaction.commit();
    console.log(
      `Project ${projectId} deleted successfully with cleanup completed:
      - ${projectFiles.length} files deleted from filesystem
      - ${projectParticipants.length} project participants removed
      - ${reservedStocks.length} reserved stock items cleaned up`,
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
    const project = await Project.findByPk(projectIdNumber, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
    if (!project) {
      throw new Error('Project not found');
    }

    const ownerDto = new UserBasicDto(
      project.user.id,
      project.user.username,
      project.user.email,
    );

    const projectDataDTO: ProjectDataDto = new ProjectDataDto(
      project.id,
      project.name,
      project.description,
      project.category,
      project.image,
      project.dueDate,
      project.created_at,
      project.updated_at,
      project.userId,
      ownerDto,
      project.privacy
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
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    const projectDataDTOs: ProjectDataDto[] = projects.map((project) => {
      const ownerDto = new UserBasicDto(
        project.user.id,
        project.user.username,
        project.user.email,
      );

      return new ProjectDataDto(
        project.id,
        project.name,
        project.description,
        project.category,
        project.image,
        project.dueDate,
        project.created_at,
        project.updated_at,
        project.userId,
        ownerDto,
        project.privacy
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
  project.privacy = newData.privacy;
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

export const getAllProjects = async (
  page: number = 1,
  limit: number = 3,
) => {
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Project.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      offset,
      limit,
    });

    const projectDataDTOs: ProjectDataDto[] = rows.map((project) => {
      const ownerDto = new UserBasicDto(
        project.user.id,
        project.user.username,
        project.user.email,
      );

      return new ProjectDataDto(
        project.id,
        project.name,
        project.description,
        project.category,
        project.image,
        project.dueDate,
        project.created_at,
        project.updated_at,
        project.userId,
        ownerDto,
        project.privacy
      );
    });

    return {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      results: projectDataDTOs,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const searchProjects = async (
  query: string,
  page: number = 1,
  limit: number = 3,
) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Project.findAndCountAll({
    where: {
      name: {
        [Op.iLike]: `%${query}%`,
      },
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email'],
      },
    ],
    offset,
    limit,
  });

  // Convert to ProjectDataDto format
  const projectDataDTOs: ProjectDataDto[] = rows.map((project) => {
    const ownerDto = new UserBasicDto(
      project.user.id,
      project.user.username,
      project.user.email,
    );

    return new ProjectDataDto(
      project.id,
      project.name,
      project.description,
      project.category,
      project.image,
      project.dueDate,
      project.created_at,
      project.updated_at,
      project.userId,
      ownerDto,
      project.privacy
    );
  });

  return {
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
    results: projectDataDTOs,
  };
};

export const getSharedProjects = async (
  userId: number,
): Promise<ProjectDataDto[]> => {
  try {
    const sharedProjects = await ProjectParticipant.findAll({
      where: { userId },
    });
    const projectIds = sharedProjects.map(
      (participant) => participant.projectId,
    );
    const projects = await Project.findAll({
      where: { id: projectIds },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
    const projectDataDTOs: ProjectDataDto[] = projects.map((project) => {
      const ownerDto = new UserBasicDto(
        project.user.id,
        project.user.username,
        project.user.email,
      );

      return new ProjectDataDto(
        project.id,
        project.name,
        project.description,
        project.category,
        project.image,
        project.dueDate,
        project.created_at,
        project.updated_at,
        project.userId,
        ownerDto,
        project.privacy
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

export const checkProjectPermissions = async (
  projectId: number,
  userId: number,
): Promise<{ hasAccess: boolean; role: 'owner' | 'participant' | 'none' }> => {
  try {
    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return { hasAccess: false, role: 'none' };
    }

    // Check if user is the owner
    if (project.userId === userId) {
      return { hasAccess: true, role: 'owner' };
    }

    // Check if user is a participant
    const participant = await ProjectParticipant.findOne({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (participant) {
      return { hasAccess: true, role: 'participant' };
    }

    return { hasAccess: false, role: 'none' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error checking project permissions:', error);
    }
    throw new Error('Server error while checking project permissions');
  }
};
