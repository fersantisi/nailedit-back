import Goal from '../database/models/Goal'
import { GoalDataDto } from '../dtos/GoalDataDto';
import { GoalDto } from '../dtos/GoalDto';

export const createGoal = async (goal: GoalDto) => {

  try {
    const existingGoal = await Goal.findOne({
      where: { name: goal.name },
    });
  
    if (existingGoal) {
      throw new Error('Goal name already in use.');
    }
  
    const newGoal = await Goal.create({
      name: goal.name,
      description: goal.description,
      duedate: goal.duedate,
      projectid: goal.projectId,
    });
    console.log(newGoal);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('Goal name already in use.');
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

export const getGoal = async (
  goalId: string,
): Promise<GoalDataDto> => {
  try {
    const goal = await Goal.findByPk(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    const goalDto: GoalDataDto = new GoalDataDto(
      goal.id,
      goal.name,
      goal.description,
      goal.duedate,
      goal.created_at,
      goal.updated_at,
    );

    return goalDto

  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error("Server error, check server console for more information")
  }
};

export const getGoalsByProjectIdService = async (
  projectId: number,
): Promise<GoalDataDto[]> => {
  try {
    const goals = await Goal.findAll({
      where: { projectid: projectId },
    });

    const goalDTOs: GoalDataDto[] = goals.map((goal) => {
      return new GoalDataDto(
        goal.id,
        goal.name,
        goal.description,
        goal.duedate,
        goal.created_at,
        goal.updated_at,
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

export const updateGoalName = async(name:string, projectId: number)=>{ 
  const goal = await Goal.findByPk(projectId);
  if (!goal) {
    throw Error("Project not found");
  }

  goal.name = name;

  await goal.save();
}

export const updateGoalDescription = async(description:string, projectId: number)=>{ 
  const goal = await Goal.findByPk(projectId);
  if (!goal) {
    throw Error("Project not found");
  }

  goal.description = description;
  await goal.save();
}

export const updateGoalDuedate = async(dueDate:string, projectId: number)=>{ 
  const goal = await Goal.findByPk(projectId);
  if (!goal) {
    throw Error("Project not found");
  }

  goal.duedate = dueDate;
  await goal.save();
}