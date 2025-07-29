import Goal from '../database/models/Goal';
import { GoalDataDto } from '../dtos/GoalDataDto';
import { GoalDto } from '../dtos/GoalDto';
import { UpdateGoalDto } from '../dtos/UpdateGoalDto';
import Project from '../database/models/Project';
import { validateGoalDueDateUpdate, validateGoalDueDate } from '../utils/validateDueDate';
import GoalNotification from '../database/models/GoalNotification';
import { NotificationDto } from '../dtos/NotificationDto';

export const createGoal = async (goal: GoalDto) => {
  try {
    const existingGoal = await Goal.findOne({
      where: { name: goal.name },
    });

    if (existingGoal) {
      throw new Error('Goal name already in use.');
    }

    // Validate that the goal due date doesn't exceed the project's due date
    const isDueDateValid = await validateGoalDueDate(goal.projectId, goal.dueDate);
    if (!isDueDateValid) {
      throw new Error('Goal due date cannot be later than the project due date');
    }

    const newGoal = await Goal.create({
      name: goal.name,
      description: goal.description,
      dueDate: goal.dueDate,
      projectId: goal.projectId,
    });
    console.log(newGoal);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

export const deleteGoal = async (goalId: string) => {
  try {
    const goal = await Goal.findByPk(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    await goal.destroy();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const getGoal = async (goalId: string): Promise<GoalDataDto> => {
  try {
    const goal = await Goal.findByPk(goalId,
      {include: [{model: GoalNotification}]}
    );
    if (!goal) {
      throw new Error('Goal not found');
    }


    const goalDto: GoalDataDto = new GoalDataDto(
      goal.id,
      goal.name,
      goal.description,
      goal.dueDate,
      goal.created_at,
      goal.updated_at,
      goal.completed,
      goal.notifications.map((n) => new NotificationDto(n.id, n.notificationTime))
    );

    return goalDto;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getGoalsByProjectIdService = async (
  projectId: number,
): Promise<GoalDataDto[]> => {
  try {
    const goals = await Goal.findAll({
      where: { projectId: projectId },
    });

    const goalDTOs: GoalDataDto[] = goals.map((goal) => {
      return new GoalDataDto(
        goal.id,
        goal.name,
        goal.description,
        goal.dueDate,
        goal.created_at,
        goal.updated_at,
        goal.completed,
      );
    });

    return goalDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const updateGoal = async (newData: UpdateGoalDto) => {
  const goal = await Goal.findByPk(newData.goalId);

  if (!goal) {
    throw Error('Goal not found');
  }

  // Validate that the new goal due date doesn't conflict with existing tasks
  const validation = await validateGoalDueDateUpdate(
    newData.goalId,
    newData.dueDate,
  );
  if (!validation.isValid) {
    throw new Error(
      `Cannot update goal due date. ${validation.conflicts.join(', ')}`,
    );
  }

  goal.name = newData.name;
  goal.description = newData.description;
  goal.dueDate = newData.dueDate;
  await goal.save();
};

export const getGoalWithProjectId = async (goalId: string) => {
  try {
    const goal = await Goal.findByPk(goalId,{
      include: [{model: GoalNotification}],
    });
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getAllGoals = async (userId?: number): Promise<any[]> => {
  try {
    const goals = await Goal.findAll({
      include: [
        {
          model: Project,
          as: 'project',
          where: userId ? { userId } : undefined,
          required: true,
        },
      ],
    });

    const goalDTOs = goals.map((goal) => {
      return {
        id: goal.id,
        projectId: goal.projectId,
        name: goal.name,
        description: goal.description,
        dueDate: goal.dueDate,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
      };
    });

    return goalDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const createGoalReminder = async (
  goalId: number,
  notificationTime: number,
):Promise<void> => {
  try {
    const existingReminder = await GoalNotification.findOne({where: {goalId: goalId, notificationTime: notificationTime }});

    if (existingReminder) {
      throw new Error('Reminder already exists.');
    };

    GoalNotification.create({
      goalId,
      notificationTime,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

export const updateGoalReminder = async (
  reminderId: number,
  notificationTime: number,
):Promise<void> => {
  try {

    const existingReminder = await GoalNotification.findByPk(reminderId);
    if (!existingReminder) {
      throw new Error('Reminder not found.');
    };

    existingReminder.notificationTime = notificationTime;
    await existingReminder.save();

  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

export const removeGoalReminder= async(
  reminderId: number
):Promise<void> => {
  try {

    const existingReminder = await GoalNotification.findByPk(reminderId);
    if (!existingReminder) {
      throw new Error('Reminder not found.');
    };

    existingReminder.destroy();

  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}