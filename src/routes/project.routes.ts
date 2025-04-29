import { Router } from 'express';
import { createNewProject, deleteAProject} from '../controllers/project.controller';
import { createNewGoal } from '../controllers/goal.controller';


const router = Router();
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.put('/update', )
router.post('/projectId/createGoal', createNewGoal )
router.delete('/projectId/:goalId', deleteAProject)

export default router;
