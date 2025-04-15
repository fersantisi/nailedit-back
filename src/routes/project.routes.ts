import { Router } from 'express';
const router = Router();
import { createProject, deleteProject } from '../controllers/project.controller';

router.post('/create/', createProject);
router.delete('/delete/:id', deleteProject);

export default router;
