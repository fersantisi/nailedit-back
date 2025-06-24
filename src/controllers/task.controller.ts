import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { TaskDto } from '../dtos/TaskDto';
import { TaskDataDto } from '../dtos/TaskDataDto';
import {
  createTask,
  deleteTask,
  gettask,
  getTaskByGoalIdService,
  updateTask,
  getAllTasks,
  getTaskWithGoalId,
} from '../services/task.service';
import { UpdateTaskDto } from '../dtos/UpdateTaskDto';
import { validateTaskDueDate } from '../utils/validateDueDate';

export const createNewTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalIdSTR = req.params.goalId;
    const goalIdNumber = +goalIdSTR;

    const { name, description, label, dueDate } = req.body;

    console.log(dueDate);

    // Validate that task due date is not later than goal due date only if dueDate is provided
    if (dueDate) {
      const isDueDateValid = await validateTaskDueDate(goalIdNumber, dueDate);
      if (!isDueDateValid) {
        res.status(400).json({
          message: 'Task due date cannot be later than the goal due date',
        });
        return;
      }
    }

    const task: TaskDto = new TaskDto(
      name,
      description || '',
      label || '',
      dueDate || '',
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
    console.log('////////////////////', task);

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

export const updateATask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, label, dueDate } = req.body;
    const taskIdStr = req.params.taskId;
    const taskIdNumber = +taskIdStr;

    // Get the task to find its goal ID
    const task = await getTaskWithGoalId(taskIdStr);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Get the goal ID from the task
    const goalId = task.goalId;

    // Validate that task due date is not later than goal due date only if dueDate is provided
    if (dueDate) {
      const isDueDateValid = await validateTaskDueDate(goalId, dueDate);
      if (!isDueDateValid) {
        res.status(400).json({
          message: 'Task due date cannot be later than the goal due date',
        });
        return;
      }
    }

    const taskUpdate: UpdateTaskDto = new UpdateTaskDto(
      name,
      description || '',
      label || '',
      dueDate || '',
      taskIdNumber,
    );

    await validateOrReject(taskUpdate);

    await updateTask(taskUpdate);

    res.status(201).json({
      message: 'Task updated',
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

export const getAllTasksController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await getAllTasks();

    // Transform the response to match frontend expectations
    const transformedTasks = tasks.map((task) => ({
      id: task.id,
      goalId: task.goalId,
      projectId: task.projectId,
      name: task.name,
      description: task.description,
      label: task.label,
      dueDate: task.dueDate,
    }));

    res.status(200).json(transformedTasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};
