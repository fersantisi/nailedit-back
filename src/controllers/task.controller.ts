import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { TaskDto } from '../dtos/TaskDto';
import { TaskDataDto } from '../dtos/TaskDataDto';
import {
  createTask,
  deleteTask,
  gettask,
  getTaskByGoalIdService,
} from '../services/task.service';
import { log } from 'console';

export const createNewTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalIdSTR = req.params.goalId;
    const goalIdNumber = +goalIdSTR;
    

    const { name, description, label, dueDate } = req.body;
    
    console.log(dueDate);
    

    const task: TaskDto = new TaskDto(
      name,
      description,
      label,
      dueDate,
      goalIdNumber,
    );

    await validateOrReject(task);

    await createTask(task);

    res.status(201).json({
      message: 'Task created',
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

export const deleteATask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const taskId = req.params.taskId;
    console.log(taskId);
    await deleteTask(taskId);
    res.status(200).json({
      message: 'Task deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const getATask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.taskId;
    const task: TaskDataDto = await gettask(taskId);

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const modifyATask = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getTasksByGoalId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalIdStr = req.params.goalId;
    const goalIdNumber = +goalIdStr;

    const tasks: TaskDataDto[] = await getTaskByGoalIdService(goalIdNumber);
    console.log(tasks);
    
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};
