import Task from '../database/models/Task';
import { TaskDataDto } from '../dtos/TaskDataDto';
import { TaskDto } from '../dtos/TaskDto';
import { UpdateProjectDto } from '../dtos/UpdateProjectDto';
import { UpdateTaskDto } from '../dtos/UpdateTaskDto';
import Goal from '../database/models/Goal';
import Project from '../database/models/Project';
import { validateTaskDueDate } from '../utils/validateDueDate';

export const createTask = async (task: TaskDto) => {
  try {
    const existingTask = await Task.findOne({
      where: { name: task.name },
    });

    if (existingTask) {
      throw new Error('task name already in use.');
    }

    // Validate that the task due date doesn't exceed the goal's due date
    const isDueDateValid = await validateTaskDueDate(task.goalId, task.dueDate);
    if (!isDueDateValid) {
      throw new Error('Task due date cannot be later than the goal due date');
    }

    const newTask = await Task.create({
      name: task.name,
      description: task.description ?? null,
      label: task.label ?? null,
      dueDate: task.dueDate ?? null,
      goalId: task.goalId,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    await task.destroy();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const gettask = async (taskId: string): Promise<TaskDataDto> => {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error('task not found');
    }

    const taskDto: TaskDataDto = new TaskDataDto(
      task.id,
      task.goalId,
      task.name,
      task.description,
      task.label,
      task.dueDate,
      task.created_at,
      task.updated_at,
      task.completed,
    );

    return taskDto;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getTaskByGoalIdService = async (
  goalId: number,
): Promise<TaskDataDto[]> => {
  try {
    if (isNaN(goalId)) {
      throw new Error('Invalid goalId: must be a valid number');
    }

    const tasks = await Task.findAll({
      where: { goalId: goalId },
    });

    const taskDTOs: TaskDataDto[] = tasks.map((task) => {
      return new TaskDataDto(
        task.id,
        task.goalId,
        task.name,
        task.description,
        task.label,
        task.dueDate,
        task.created_at,
        task.updated_at,
        task.completed,
      );
    });

    return taskDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const updateTask = async (newData: UpdateTaskDto) => {
  const task = await Task.findByPk(newData.taskId);

  if (!task) {
    throw Error('task not found');
  }

  // Validate that the new task due date doesn't exceed the goal's due date
  const isDueDateValid = await validateTaskDueDate(
    task.goalId,
    newData.dueDate,
  );
  if (!isDueDateValid) {
    throw new Error('Task due date cannot be later than the goal due date');
  }

  task.name = newData.name;
  task.description = newData.description;
  task.label = newData.label;
  task.dueDate = newData.dueDate;
  await task.save();
};

export const getAllTasks = async (userId?: number): Promise<any[]> => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: Goal,
          as: 'goal',
          required: true,
          include: [
            {
              model: Project,
              as: 'project',
              where: userId ? { userId } : undefined,
              required: true,
            },
          ],
        },
      ],
    });

    const taskDTOs = tasks.map((task) => {
      return {
        id: task.id,
        goalId: task.goalId,
        projectId: task.goal?.project?.id,
        name: task.name,
        description: task.description,
        label: task.label,
        dueDate: task.dueDate,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        completed: task.completed,
      };
    });

    return taskDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getTaskWithGoalId = async (taskId: string) => {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};
