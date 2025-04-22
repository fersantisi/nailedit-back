import { Response, Request, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../dtos/loginDto';
import { error } from 'console';

export const validateLogin = async(
  data:string
):Promise<LoginDto> => {

  const dtoInstance = plainToInstance(LoginDto, data);

  const errors = await validate(dtoInstance)


  if (errors.length > 0) {

    const errorMessages = errors.map(err => {
      const constraints = err.constraints ? Object.values(err.constraints).join(', ') : 'Invalid value';
      return `${err.property}: ${constraints}`;
    });

  }
  
  return dtoInstance;
      
  
};
