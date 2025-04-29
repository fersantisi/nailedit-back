import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
} from '../controllers/project.controller';
import { createNewGoal, deleteAGoal, getAGoal } from '../controllers/goal.controller';
import { createNewTask, deleteATask, getATask } from '../controllers/task.controller';


const router = Router();
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.put('/update', )
router.get('/list', getProjectsByUserId);

router.post('/:projectId/createGoal', createNewGoal )
router.delete('/:projectId/:goalId', deleteAGoal)
router.get('/:projectId/:goalId',getAGoal)

router.post('/:projectId/:goalId/createTask', createNewTask)
router.get('/:projectId/:goalId/:taskId', getATask)
router.delete('/:projectId/:goalId/:taskId', deleteATask)


export default router;
