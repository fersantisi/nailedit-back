import { Request, Response } from 'express';
import {
  acceptInvite,
  acceptParticipationRequest,
  deleteInvitation,
  getallParticipationRequests,
  getProjectParticipants,
  getUserInvites,
  getUserSentInvites,
  rejectInvite,
  rejectParticipationRequest,
  removeProjectParticipant,
  sendInvitation,
  sendRequestParticipation,
} from '../services/community.service';
import { getAllProjects } from '../services/project.service';
import { getTokenPayload } from '../services/token.service';

export const requestParticipation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = Number(req.params.projectId);
    const { userId } = req.body;

    await sendRequestParticipation(projectId, userId);

    res
      .status(201)
      .json({ message: 'Participation request sent successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const acceptAParticipationRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const requestId = Number(req.params.requestId);
    await acceptParticipationRequest(requestId);
    res.status(200).json({ message: 'Participation request accepted' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const rejectAParticipationRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const requestId = Number(req.params.requestId);
    await rejectParticipationRequest(requestId);
    res.status(200).json({ message: 'Participation request rejected' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const removeAParticipant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = Number(req.params.projectId);
    const participantId = Number(req.params.participantId);
    await removeProjectParticipant(projectId, participantId);
    res.status(200).json({ message: 'Participant removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getAllExistingProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;

    const result = await getAllProjects(page, limit);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getAllParticipationRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = Number(req.params.projectId);
    const requests = await getallParticipationRequests(projectId);
    res.status(200).json(requests);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getAllProjectParticipants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = Number(req.params.projectId);
    const participants = await getProjectParticipants(projectId);
    res.status(200).json(participants);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getAllInvites = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const invites = getUserInvites(userId);
    res.status(200).json(invites);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getAllSentInvites = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const invites = getUserSentInvites(userId);
    res.status(200).json(invites);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const acceptInviteToProyect = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const inviteId = Number(req.params.inviteId);
    acceptInvite(inviteId);
    res.status(200).json(`Invite accepted succesfully.`);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const rejectInviteToProyect = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const inviteId = Number(req.params.inviteId);
    rejectInvite(inviteId);
    res.status(200).json(`Invite rejected succesfully.`);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const inviteToProyect = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const fromUser = await getTokenPayload(req.cookies.authToken).userId;
    const projectId = Number(req.params.projectId);
    const { toUser } = req.body;
    sendInvitation(projectId, fromUser, toUser);
    res.status(200).json(`${toUser} invited succesfully.`);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteInvite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { inviteID } = req.body;
    deleteInvitation(inviteID);
    res.status(200).json(`Invitation deleted succesfully.`);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};