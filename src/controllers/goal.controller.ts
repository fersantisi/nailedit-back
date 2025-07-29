import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { GoalDto } from '../dtos/GoalDto';
import {
  createGoal,
  deleteGoal,
  getGoal,
  getGoalsByProjectIdService,
  updateGoal,
  getGoalWithProjectId,
  getAllGoals,
  /* updateGoalReminder,
  removeGoalReminder, */
  //createGoalReminder,
} from '../services/goals.service';
import { GoalDataDto } from '../dtos/GoalDataDto';
import { UpdateGoalDto } from '../dtos/UpdateGoalDto';
import { validateGoalDueDate } from '../utils/validateDueDate';

export const createNewGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('createNewGoal');

  try {
    const projectIdSTR = req.params.projectId;
    const projectIdNumber = +projectIdSTR;

    const { name, description, dueDate } = req.body;

    const goal: GoalDto = new GoalDto(
      name,
      description,
      dueDate,
      projectIdNumber,
    );

    console.log(goal.dueDate);

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
      res.status(404).json({ message: error.message });
    }
  }
};

export const getAGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const goalId = req.params.goalId;
    const goal: GoalDataDto = await getGoal(goalId);

    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const getGoalsByProjectId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log(
    'getGoalsByProjectIdfbjsdafbnsjkafnskdfnbsjdafbhsafs;abf;kjsdbfjsdbfk;jbfjaksfbsjkabfsk;ajbfsjfbsfsa',
    req.params.projectId,
  );
  try {
    const projectIdStr = req.params.projectId;
    const projectIdNumber = +projectIdStr;

    const goals: GoalDataDto[] =
      await getGoalsByProjectIdService(projectIdNumber);

    res.status(200).json(goals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateAGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, category, image, dueDate } = req.body;
    const goalIdStr = req.params.goalId;
    const goalIdNumber = +goalIdStr;

    // Get the goal to find its project ID
    const goal = await getGoalWithProjectId(goalIdStr);
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    // Get the project ID from the goal
    const projectId = goal.projectId;

    // Validate that goal due date is not later than project due date
    const isDueDateValid = await validateGoalDueDate(projectId, dueDate);
    if (!isDueDateValid) {
      res.status(400).json({
        message: 'Goal due date cannot be later than the project due date',
      });
      return;
    }

    const goalUpdate: UpdateGoalDto = new UpdateGoalDto(
      name,
      description,
      dueDate,
      goalIdNumber,
    );

    await validateOrReject(goalUpdate);

    await updateGoal(goalUpdate);

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
};

export const getAllGoalsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get userId from req.user (set by auth middleware)
    const userId = (req as any).user?.id;
    const goals = await getAllGoals(userId);

    // Transform the response to match frontend expectations
    const transformedGoals = goals.map((goal) => ({
      id: goal.id,
      projectId: goal.projectId,
      name: goal.name,
      description: goal.description,
      dueDate: goal.dueDate,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }));

    res.status(200).json(transformedGoals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const setGoalCompleted = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    const goalId = req.params.goalId;
    const { completed } = req.body;
    const goal = await getGoalWithProjectId(goalId);
    if (!goal || String(goal.projectId) !== String(projectId)) {
      res.status(404).json({ message: 'Goal not found for this project' });
      return;
    }
    goal.completed = completed;
    await goal.save();
    res.status(200).json({ message: 'Goal completion updated', completed });
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal completion' });
  }
};

/* export const createNewGoalReminder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalId = Number(req.params.goalId);
    const notificationTime = req.body;

    //await createGoalReminder(goalId, notificationTime);

    res.status(200).json({
      message: 'Reminder created.',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
}; */

/* export const updateAGoalReminder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {

    const {reminderId , notificationTime} = req.body;
    await updateGoalReminder(reminderId, notificationTime);

    res.status(200).json({
      message: 'Reminder updated.',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
}; */

/* export const deleteAGoalReminder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const remainderId = req.body;

    await removeGoalReminder(remainderId);

    res.status(200).json({
      message: 'Reminder deleted.',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
}; */
