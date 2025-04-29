import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { GoalDto } from '../dtos/GoalDto';
import { createGoal, deleteGoal, getGoal } from '../services/goals.service';
import { GoalDataDto } from '../dtos/GoalDataDto';

export const createNewGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectIdSTR = req.params.projectId
    const projectIdNumber = +projectIdSTR

    const { name, description, dueDate } = req.body;

    const goal: GoalDto = new GoalDto(
      name,
      description,
      dueDate,
      projectIdNumber,
    );


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
    const goalId = req.params.id;
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
    const goalId = req.params.id;
    const goal: GoalDataDto = await getGoal(goalId);

    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const modifyAGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  
};
