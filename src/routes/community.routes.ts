import { Router } from 'express';
import { getAllExistingProjects, requestParticipation } from '../controllers/community.controller';
import { searchProjectsCommunity } from '../controllers/project.controller';


const router = Router();

router.put('/browse', getAllExistingProjects);
router.get('/project/:projectId', requestParticipation);
router.get('/search', searchProjectsCommunity);