import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { GoalDto } from '../dtos/GoalDto';
import { createGoal, deleteGoal, getGoal, getGoalsByProjectIdService, updateGoal} from '../services/goals.service';
import { GoalDataDto } from '../dtos/GoalDataDto';
import { UpdateGoalDto } from '../dtos/UpdateGoalDto';

export const createNewGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('createNewGoal');
  
  try {
    const goalIdSTR = req.params.goalId
    const goalIdNumber = +goalIdSTR

    const { name, description, dueDate } = req.body;


    const goal: GoalDto = new GoalDto(
      name,
      description,
      dueDate,
      goalIdNumber,
    );

    console.log(goal.duedate);
    

    await validateOrReject(goal);

    await createGoal(goal);

    res.status(201).json({
      message: 'Goal created',
    });
  } catch (error: unknown) {
    console.log(error);
    if (Array.isArray(error)) {
      // Validation error from class-validator
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const deleteAGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalId = req.params.goalId;
    console.log(goalId);
    await deleteGoal(goalId);
    res.status(200).json({
      message: 'Goal deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const getAGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalId = req.params.goalId;
    const goal: GoalDataDto = await getGoal(goalId);

    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const getGoalsByProjectId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('getGoalsByProjectIdfbjsdafbnsjkafnskdfnbsjdafbhsafs;abf;kjsdbfjsdbfk;jbfjaksfbsjkabfsk;ajbfsjfbsfsa', req.params.projectId);
  try {
    
    const projectIdStr = req.params.projectId;
    const projectIdNumber = +projectIdStr;

    const goals: GoalDataDto[] = await getGoalsByProjectIdService(goalIdNumber);
    
    res.status(200).json(goals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const updateAGoal = async(req: Request, res: Response):Promise<void>=> {
  try{
    const { name, description, category, image, dueDate } = req.body;
    const goalIdStr = req.params.goalId;
    const goalIdNumber = +goalIdStr;

    const goal: UpdateGoalDto = new UpdateGoalDto(
      name,
      description,
      dueDate,
      goalIdNumber,
    );

    await validateOrReject(goal);

    await updateGoal(goal);

    res.status(201).json({
      message: 'Goal updated',
    });
  } catch (error: unknown) {
    console.log(error);
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    } 
  }
}

