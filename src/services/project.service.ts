import Project from '../database/models/Project';

export const createProject = async(data:DataTransfer)=>{

    const project = await Project.findOne({ where: { name } });
    
    if (project) {
        return;
      }
  
}