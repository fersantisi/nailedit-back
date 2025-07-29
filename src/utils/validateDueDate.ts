import Project from '../database/models/Project';
import Goal from '../database/models/Goal';
import Task from '../database/models/Task';

export const validateGoalDueDate = async (
  projectId: number,
  goalDueDate: string,
): Promise<boolean> => {
  try {
    // Handle undefined, null, or empty due dates
    if (
      goalDueDate == undefined ||
      goalDueDate === null ||
      goalDueDate === ''
    ) {
      return true;
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // If project has no due date, any goal due date is valid
    if (
      project.dueDate == undefined ||
      project.dueDate === null ||
      project.dueDate === ''
    ) {
      return true;
    }

    const projectDueDate = new Date(project.dueDate);
    const goalDate = new Date(goalDueDate);

    // Goal due date should be before or equal to project due date
    return goalDate <= projectDueDate;
  } catch (error) {
    console.error('Error validating goal due date:', error);
    return false;
  }
};

export const validateTaskDueDate = async (
  goalId: number,
  taskDueDate: string,
): Promise<boolean> => {
  try {
    // Handle undefined, null, or empty due dates
    if (
      taskDueDate == undefined ||
      taskDueDate === null ||
      taskDueDate === ''
    ) {
      return true;
    }
    const goal = await Goal.findByPk(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    // If goal has no due date, any task due date is valid
    if (
      goal.dueDate == undefined ||
      goal.dueDate === null ||
      goal.dueDate === ''
    ) {
      return true;
    }

    const goalDueDate = new Date(goal.dueDate);
    const taskDate = new Date(taskDueDate);

    // Task due date should be before or equal to goal due date
    return taskDate <= goalDueDate;
  } catch (error) {
    console.error('Error validating task due date:', error);
    return false;
  }
};

export const validateProjectDueDateUpdate = async (
  projectId: number,
  newProjectDueDate: string,
): Promise<{ isValid: boolean; conflicts: string[] }> => {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Handle undefined, null, or empty due dates - if project has no due date, any goal/task due date is valid
    if (
      newProjectDueDate == undefined ||
      newProjectDueDate === null ||
      newProjectDueDate === ''
    ) {
      return { isValid: true, conflicts: [] };
    }

    const newDueDate = new Date(newProjectDueDate);
    const conflicts: string[] = [];

    // Check all goals in this project
    const goals = await Goal.findAll({
      where: { projectId: projectId },
    });

    for (const goal of goals) {
      if (goal.dueDate && goal.dueDate !== null && goal.dueDate !== '') {
        const goalDueDate = new Date(goal.dueDate);
        if (goalDueDate > newDueDate) {
          conflicts.push(
            `Goal "${goal.name}" has due date ${goal.dueDate} which is later than the new project due date`,
          );
        }
      }

      // Check all tasks in this goal
      const tasks = await Task.findAll({
        where: { goalId: goal.id },
      });

      for (const task of tasks) {
        if (task.dueDate && task.dueDate !== null && task.dueDate !== '') {
          const taskDueDate = new Date(task.dueDate);
          if (taskDueDate > newDueDate) {
            conflicts.push(
              `Task "${task.name}" in goal "${goal.name}" has due date ${task.dueDate} which is later than the new project due date`,
            );
          }
        }
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts,
    };
  } catch (error) {
    console.error('Error validating project due date update:', error);
    return {
      isValid: false,
      conflicts: ['Error validating project due date update'],
    };
  }
};

export const validateGoalDueDateUpdate = async (
  goalId: number,
  newGoalDueDate: string,
): Promise<{ isValid: boolean; conflicts: string[] }> => {
  try {
    const goal = await Goal.findByPk(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Handle undefined, null, or empty due dates - if goal has no due date, any task due date is valid
    if (
      newGoalDueDate == undefined ||
      newGoalDueDate === null ||
      newGoalDueDate === ''
    ) {
      return { isValid: true, conflicts: [] };
    }

    const newDueDate = new Date(newGoalDueDate);
    const conflicts: string[] = [];

    // Check all tasks in this goal
    const tasks = await Task.findAll({
      where: { goalId: goalId },
    });

    for (const task of tasks) {
      if (task.dueDate && task.dueDate !== null && task.dueDate !== '') {
        const taskDueDate = new Date(task.dueDate);
        if (taskDueDate > newDueDate) {
          conflicts.push(
            `Task "${task.name}" has due date ${task.dueDate} which is later than the new goal due date`,
          );
        }
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts,
    };
  } catch (error) {
    console.error('Error validating goal due date update:', error);
    return {
      isValid: false,
      conflicts: ['Error validating goal due date update'],
    };
  }
};
