import { Router } from 'express';
import {
  getAllExistingProjects,
  requestParticipation,
} from '../controllers/community.controller';
import { searchProjectsCommunity } from '../controllers/project.controller';

const router = Router();

// Project discovery - browse and search all projects
router.get('/browse', getAllExistingProjects);
router.get('/search', searchProjectsCommunity);

// Initial participation request (before it's managed within project context)
router.post('/projects/:projectId/request', requestParticipation);

export default router;
