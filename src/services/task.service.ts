import Task from "../database/models/Task";
import { TaskDataDto } from "../dtos/TaskDataDto";
import { TaskDto } from "../dtos/TaskDto";
import { UpdateProjectDto } from "../dtos/UpdateProjectDto";
import { UpdateTaskDto } from "../dtos/UpdateTaskDto";


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
      projectid: task.goalId,
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

    await Task.destroy();

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
  projectId: number,
): Promise<TaskDataDto[]> => {
  try {
    const tasks = await Task.findAll({
      where: { projectid: projectId },
    });

    const taskDTOs: TaskDataDto[] = tasks.map((task) => {
      return new TaskDataDto(
        task.id,
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

export const updateTask = async(newData:UpdateTaskDto)=>{ 

  const task = await Task.findByPk(newData.taskId);
  
  if (!task) {
    throw Error("task not found");
  }

  task.name = newData.name;
  task.description = newData.description
  task.label  = newData.label
  task.duedate = newData.duedate
  await task.save();
}



