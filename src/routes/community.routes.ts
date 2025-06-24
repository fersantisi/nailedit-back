import { Router } from 'express';
import { getAllExistingProjects, requestParticipation } from '../controllers/community.controller';


const router = Router();

router.put('/browse', getAllExistingProjects);
router.get('/project/:projectId', requestParticipation);
