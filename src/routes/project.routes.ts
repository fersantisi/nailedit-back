import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
} from '../controllers/project.controller';
import { createNewGoal, deleteAGoal, getAGoal, getGoalsByProjectId } from '../controllers/goal.controller';
import { createNewTask, deleteATask, getATask, getTasksByGoalId } from '../controllers/task.controller';


const router = Router();
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.put('/update', )
router.get('/list', getProjectsByUserId);

router.post('/:projectId/createGoal', createNewGoal )
router.delete('/:projectId/goal/:goalId', deleteAGoal)
router.get('/:projectId/goal/:goalId',getAGoal)
router.get('/:projectId/goal/list', getGoalsByProjectId);

router.post('/:projectId/goal/:goalId/createTask', createNewTask)
router.get('/:projectId/goal/:goalId/task/:taskId', getATask)
router.delete('/:projectId/goal/:goalId/task/:taskId', deleteATask)
router.get('/:projectId/goal/:goalId/task/list', getTasksByGoalId);


export default router;
