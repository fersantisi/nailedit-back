import { Request, Response } from 'express';
import {
  acceptParticipationRequest,
  getallParticipationRequests,
  getProjectParticipants,
  rejectParticipationRequest,
  removeProjectParticipant,
  sendRequestParticipation,
} from '../services/community.service';
import { getAllProjects } from '../services/project.service';

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
    const userId = Number(req.params.id);
    const projects = await getAllProjects();
    res.status(200).json(projects);
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
