import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
} from '../controllers/project.controller';
import { createNewGoal } from '../controllers/goal.controller';


const router = Router();
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.put('/update', )
router.get('/list', getProjectsByUserId);
router.post('/projectId/createGoal', createNewGoal )
router.delete('/projectId/:goalId', deleteAProject)

export default router;
