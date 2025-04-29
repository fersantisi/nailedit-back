import Task from "../database/models/Task";
import { TaskDataDto } from "../dtos/TaskDataDto";
import { TaskDto } from "../dtos/TaskDto";


export const createTask = async (task: TaskDto) => {

  try {
    const existingTask = await Task.findOne({
      where: { name: task.name },
    });
  
    if (existingTask) {
      throw new Error('task name already in use.');
    }
  
    const newTask = await Task.create({
      name: task.name,
      description: task.description,
      label: task.label,
      duedate: task.duedate,
      goalid: task.goalId,
    });
    
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('Task name already in use.');
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

export const gettask = async (
  taskId: string,
): Promise<TaskDataDto> => {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error('task not found');
    }

    const taskDto: TaskDataDto = new TaskDataDto(
      task.id,
      task.goalid,
      task.name,
      task.description,
      task.label,
      task.duedate,
      task.created_at,
      task.updated_at,
    );

    return taskDto

  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error("Server error, check server console for more information")
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
      where: { goalid: goalId },
    });

    const taskDTOs: TaskDataDto[] = tasks.map((task) => {
      return new TaskDataDto(
        task.id,
        task.goalid,
        task.name,
        task.description,
        task.label,
        task.duedate,
        task.created_at,
        task.updated_at,
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