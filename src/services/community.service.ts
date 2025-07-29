import ProjectParticipant from '../database/models/ProjectParticipant';
import ProjectParticipationRequest from '../database/models/ProjectParticipationRequest';
import Project from '../database/models/Project';
import User from '../database/models/User';
import ProjectInvitation from '../database/models/ProjectInvite';
import { sendMail } from './mailer.service';

export const sendRequestParticipation = async (
  projectId: number,
  userId: number,
): Promise<void> => {
  try {
    const participant = await ProjectParticipant.findOne({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });
    if (participant) {
      throw new Error('User is already a participant in this project');
    }
    await ProjectParticipationRequest.create({
      projectId: projectId,
      userId: userId,
    });
    const project = await Project.findByPk(projectId,{include: [{model: User}]})
    if(project){
      await sendMail(
          project.user.email,
          `New participation request!!`,
          `You have a new participation reques to the project: ${project.name}. Go catch them all!!!`
      );
    }
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send participation request: ${error.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while sending participation request',
      );
    }
  }
};

export const acceptParticipationRequest = async (
  requestId: number,
): Promise<void> => {
  try {
    const request = await ProjectParticipationRequest.findByPk(requestId, {
      include: [
        { model: Project, include: [{ model: User }] },
        { model: User },
      ],
    });
    console.log(request);
    
    if (!request) {
      throw new Error('Participation request not found');
    }

    // Check if user is already a participant
    const existingParticipant = await ProjectParticipant.findOne({
      where: {
        projectId: request.projectId,
        userId: request.userId,
      },
    });

    if (existingParticipant) {
      throw new Error('User is already a participant in this project');
    }

    await ProjectParticipant.create({
      projectId: request.projectId,
      userId: request.userId,
    });
    
    await sendMail(
          request.user.email,
          `You been accepted to ${request.project.name}!!!!`,
          `You have been accepted to the project: ${request.project.name}. Go catch them all!!!`
    );

    await request.destroy();
  } catch (error) {
    if (error instanceof Error) {
      // Handle unique constraint violation more gracefully
      if (
        error.message.includes('already exists') ||
        error.message.includes('unique')
      ) {
        throw new Error('User is already a participant in this project');
      }
      throw new Error(
        `Failed to accept participation request: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while accepting participation request',
      );
    }
  }
};

export const rejectParticipationRequest = async (
  requestId: number,
): Promise<void> => {
  try {
    const request = await ProjectParticipationRequest.findByPk(requestId);
    if (!request) {
      throw new Error('Participation request not found');
    }
    await request.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to reject participation request: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while rejecting participation request',
      );
    }
  }
};

export const getallParticipationRequests = async (
  projectId: number,
): Promise<ProjectParticipationRequest[]> => {
  try {
    const requests = await ProjectParticipationRequest.findAll({
      where: { projectId: projectId },
    });
    return requests;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get participation requests: ${error.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while getting participation requests',
      );
    }
  }
};

export const getProjectParticipants = async (
  projectId: number,
): Promise<ProjectParticipant[]> => {
  try {
    const participants = await ProjectParticipant.findAll({
      where: { projectId: projectId },
    });
    return participants;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get project participants: ${error.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while getting project participants',
      );
    }
  }
};

export const removeProjectParticipant = async (
  projectId: number,
  userId: number,
): Promise<void> => {
  try {
    const participant = await ProjectParticipant.findOne({
      where: { projectId: projectId, userId: userId },
    });
    if (!participant) {
      throw new Error('Participant not found');
    }
    await participant.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove participant: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while removing participant');
    }
  }
};

export const getUserParticipationRequests = async (
  userId: number,
): Promise<ProjectParticipationRequest[]> => {
  try {
    const requests = await ProjectParticipationRequest.findAll({
      where: { userId: userId },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description', 'category', 'image'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return requests;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to get user participation requests: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while getting user participation requests',
      );
    }
  }
};

export const sendInvitation = async (
  projectId: number,
  fromUser: number,
  toUser: number,
): Promise<void> => {
  try {
    const user = await User.findOne({
      where: {
        username: toUser,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const participant = await ProjectParticipant.findOne({
      where: {
        projectId: projectId,
        userId: user.id,
      },
    });
    if (participant) {
      throw new Error('User is already a participant in this project');
    }
    const existingInvite = await ProjectInvitation.findOne({
      where: {
        projectId: projectId,
        toUser: user.id,
      },
    });
    if (existingInvite) {
      throw new Error('User already has an invitation to this project');
    }
    
    await ProjectInvitation.create({
      projectId: projectId,
      toUser: user.id,
      fromUser: fromUser,
    });

    const project = await Project.findByPk(projectId)

    await sendMail(
          user.email,
          `Project Invitation`,
          `You have been invitated to the project: ${project?.name}. Go catch them all!!`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send invitation: ${error.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while sending invitation',
      );
    }
  }
};

export const getUserInvites = async (
  userId: number,
): Promise<ProjectInvitation[]> => {
  try {
    const invites = await ProjectInvitation.findAll({
      where: { toUser: userId },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description', 'category', 'image'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'fromUserData',        
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User,
          as: 'toUserData',          
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return invites;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to get user invites: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while getting user invites',
      );
    }
  }
};

export const getUserSentInvites = async (
  userId: number,
): Promise<ProjectInvitation[]> => {
  try {
    const invites = await ProjectInvitation.findAll({
      where: { fromUser: userId },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description', 'category', 'image'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'fromUserData',        
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User,
          as: 'toUserData',          
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return invites;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to get user sent invites: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while getting user sent invites',
      );
    }
  }
};

export const acceptInvite = async (
  invitationId: number,
): Promise<void> => {
  try {
    const invitation = await ProjectInvitation.findByPk(invitationId,{
      include: [
        {model: User, as: 'fromUserData'},{model: User, as: 'toUserData'},{model: Project}]
    });
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Check if user is already a participant
    const existingParticipant = await ProjectParticipant.findOne({
      where: {
        projectId: invitation.projectId,
        userId: invitation.toUser,
      },
    });

    if (existingParticipant) {
      throw new Error('User is already a participant in this project');
    }

    await ProjectParticipant.create({
      projectId: invitation.projectId,
      userId: invitation.toUser,
    });
    await invitation.destroy();

    await sendMail(
          invitation.fromUserData.email,
          `Your invitation has been accepted.`,
          `${invitation.toUserData.username.charAt(0).toUpperCase() 
            + invitation.toUserData.username.slice(1).toLowerCase()} has accepted your invitation to project ${invitation.project.name}. You better watchout.`
          );

  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('already exists') ||
        error.message.includes('unique')
      ) {
        throw new Error('User is already a participant in this project');
      }
      throw new Error(
        `Failed to accept invitation: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while accepting invitation',
      );
    }
  }
};

export const rejectInvite = async (
  invitationId: number,
): Promise<void> => {
  try {
    const invitation = await ProjectInvitation.findByPk(invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    await invitation.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to reject invitation: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while rejecting invitation',
      );
    }
  }
};

export const deleteInvitation = async (
  inviteId: number,
): Promise<void> => {
  try {
    const invitation = await ProjectInvitation.findByPk(inviteId);
    if (!invitation) {
      throw new Error('Invitation not found.');
    }
    await invitation.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete invitation: ${error.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while deleting invitation',
      );
    }
  }
};

export const getProjectInvites = async (
  projectId: number,
): Promise<ProjectInvitation[]> => {
  try {
    const invites = await ProjectInvitation.findAll({
      where: { projectId: projectId },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'description', 'category', 'image'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'fromUserData',        
          attributes: ['id', 'username', 'email'],
        },
        {
          model: User,
          as: 'toUserData',          
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return invites;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to get user invites: ${error.message}`,
      );
    } else {
      throw new Error(
        'An unknown error occurred while getting user invites',
      );
    }
  }
};