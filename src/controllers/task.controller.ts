import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { TaskDto } from '../dtos/TaskDto';
import { TaskDataDto } from '../dtos/TaskDataDto';
import { createTask, deleteTask, gettask, getTaskByGoalIdService, updateTaskDescription, updateTaskDuedate, updateTaskLabel,  updateTaskName } from '../services/task.service';


export const createNewTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  
  try {
    const goalIdSTR = req.params.goalId;
    const goalIdNumber = +goalIdSTR;

    const { name, description, label, dueDate } = req.body;


    const task: TaskDto = new TaskDto(
      name,
      description,
      label,
      dueDate,
      goalIdNumber
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

export const getATask = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

export const getTasksByGoalId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const goalIdStr = req.params.goaltId;
    const goalIdNumber = +goalIdStr;

    const tasks: TaskDataDto[] = await getTaskByGoalIdService(goalIdNumber);
    
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const updateATaskName = async(req: Request, res: Response):Promise<void>=> {
  const label = req.body.label;
  const taskIdStr = req.params.taskId;
  const tasktIdNumber = +taskIdStr;
  if(!label){
    res.status(400).json({message: "Invalid Name."})
  }

  try {
    updateTaskName(label, tasktIdNumber);
    res.status(200).json({message: "Label changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
  

}

export const updateATaskDescription = async(req: Request, res: Response):Promise<void>=> {
  const description = req.body.description;
  const taskIdStr = req.params.taskId;
  const tasktIdNumber = +taskIdStr;
  if(!description){
    res.status(400).json({message: "Invalid description."})
  }

  try {
    updateTaskDescription(description, tasktIdNumber);
    res.status(200).json({message: "Description change succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
  

}


export const updateATaskLabel = async(req: Request, res: Response):Promise<void>=> {
  const name = req.body.name;
  const taskIdStr = req.params.taskId;
  const tasktIdNumber = +taskIdStr;
  if(!name){
    res.status(400).json({message: "Invalid Label."})
  }

  try {
    updateTaskLabel(name, tasktIdNumber);
    res.status(200).json({message: "Name changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
  

}

export const updateATaskDuedate = async(req: Request, res: Response):Promise<void>=> {
  const dueDate = req.body.dueDate;
  const taskIdStr = req.params.taskId;
  const tasktIdNumber = +taskIdStr;
  if(!dueDate){
    res.status(400).json({message: "Invalid duedate."})
  }

  try {
    updateTaskDuedate(dueDate, tasktIdNumber);
    res.status(200).json({message: "Duedate changed succesfully"})
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
  

}