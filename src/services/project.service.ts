import { error } from 'console';
import Project from '../database/models/Project';
import { ProjectDto } from '../dtos/ProjectDto';
import { ProjectDataDto } from '../dtos/ProjectDataDto';

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
      dueDate: project.duedate,
      userid: project.userId,
    });
    console.log(newProject);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('Project name already in use.');
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
  projectId: string,
): Promise<ProjectDataDto> => {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const projectDTO: ProjectDataDto = new ProjectDataDto(
      project.id,
      project.name,
      project.description,
      project.category,
      project.image,
      project.duedate,
      project.created_at,
      project.updated_at,
    );

    return projectDTO

  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error("Server error, check server console for more information")
  }
};

export const getProjectsByUserIdService = async (
  userId: number,
): Promise<ProjectDataDto[]> => {
  try {
    const projects = await Project.findAll({
      where: { userid: userId },
    });

    const projectDTOs: ProjectDataDto[] = projects.map((project) => {
      return new ProjectDataDto(
        project.id,
        project.name,
        project.description,
        project.category,
        project.image,
        project.duedate,
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

export const updateProjectName = async(name:string, projectId: number)=>{ 
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw error("Project not found");
  }

  project.name = name;

  await project.save();
}

export const updateProjectDescription = async(description:string, projectId: number)=>{ 
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw error("Project not found");
  }

  project.description = description;

  await project.save();
}
export const updateProjectCategory = async(category:string, projectId: number)=>{ 
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw error("Project not found");
  }

  project.category = category;

  await project.save();
}
export const updateProjectImage = async(image:string, projectId: number)=>{ 
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw error("Project not found");
  }
  project.image = image;
  await project.save();
}
export const updateProjectDuedate = async(dueDate: string, projectId: number)=>{ 
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw error("Project not found");
  }

  project.duedate = dueDate;

  await project.save();
}