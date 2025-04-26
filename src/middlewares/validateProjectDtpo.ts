import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProjectDto } from '../dtos/ProjectDto';

export const validateLogin = async(
  data:string
):Promise<ProjectDto> => {

  const dtoInstance = plainToInstance(ProjectDto, data);

  const errors = await validate(dtoInstance)

  if (errors.length > 0) {

    const errorMessages = errors.map(err => {
      const constraints = err.constraints ? Object.values(err.constraints).join(', ') : 'Invalid value';
      return `${err.property}: ${constraints}`;
    });

  }
  
  return dtoInstance;
      
  
};
