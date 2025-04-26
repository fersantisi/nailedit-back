import { error } from 'console';
import Project from '../database/models/Project';
import { ProjectDto } from '../dtos/ProjectDto';


export const createProject = async(project:ProjectDto)=>{

    const existingProject = await Project.findOne({ where: { name: project.name } });

    if (existingProject) {
      throw new Error('Project name already in use.');
    }
  
}

