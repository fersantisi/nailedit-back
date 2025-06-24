import ProjectParticipant from "../database/models/ProjectParticipant";
import ProjectParticipationRequest from "../database/models/ProjectParticipationRequest";

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
      throw new Error("User is already a participant in this project");
    }
    await ProjectParticipationRequest.create({
      projectId: projectId,
      userId: userId,
    });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to send participation request: ${error.message}`);
        } else {
            throw new Error("An unknown error occurred while sending participation request");
        }
    }
}

export const acceptParticipationRequest = async (
  requestId: number,
): Promise<void> => {
  try {
    const request = await ProjectParticipationRequest.findByPk(requestId);
    if (!request) {
      throw new Error("Participation request not found");
    }
    await ProjectParticipant.create({
      projectId: request.projectId,
      userId: request.userId,
    });
    await request.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to accept participation request: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while accepting participation request");
    }
  }
};

export const rejectParticipationRequest = async (
  requestId: number,
): Promise<void> => {
  try {
    const request = await ProjectParticipationRequest.findByPk(requestId);
    if (!request) {
      throw new Error("Participation request not found");
    }
    await request.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to reject participation request: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while rejecting participation request");
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
      throw new Error("An unknown error occurred while getting participation requests");
    }
  }
}

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
      throw new Error("An unknown error occurred while getting project participants");
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
      throw new Error("Participant not found");
    }
    await participant.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove participant: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while removing participant");
    }
  }
};