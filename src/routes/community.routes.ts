import { Router } from 'express';
import {
  getAllExistingProjects,
  inviteToProject,
  requestParticipation,
  getAllInvites,
  getAllSentInvites,
  acceptInviteToProject,
  rejectInviteToProject,
  deleteInvite,
  getAllProjectInvites,
} from '../controllers/community.controller';
import { searchProjectsCommunity } from '../controllers/project.controller';


const router = Router();

// Project discovery - browse and search all projects
router.get('/browse', getAllExistingProjects);
router.get('/search', searchProjectsCommunity);

// Initial participation request (before it's managed within project context)
router.post('/projects/:projectId/request', requestParticipation);

router.post('/projects/:projectId/invite', inviteToProject);
router.get('/invites', getAllInvites);
router.get('/sent-invites', getAllSentInvites);
router.post('/invites/:inviteId/accept', acceptInviteToProject);
router.post('/invites/:inviteId/reject', rejectInviteToProject);
router.delete('/invites/:inviteId', deleteInvite);
router.get('/projects/:projectId/invites', getAllProjectInvites);

export default router;
