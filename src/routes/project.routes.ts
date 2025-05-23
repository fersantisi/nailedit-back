import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
  updateAProject,
} from '../controllers/project.controller';
import { createNewGoal, deleteAGoal, getAGoal, getGoalsByProjectId, updateAGoal} from '../controllers/goal.controller';
import { createNewTask, deleteATask, getATask, getTasksByGoalId, updateATask} from '../controllers/task.controller';


const router = Router();
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.get('/list', getProjectsByUserId);
router.put('/:projectId/updateProject', updateAProject)


router.post('/:projectId/createGoal', createNewGoal )
router.delete('/:projectId/goal/:goalId', deleteAGoal)
router.get('/:projectId/goal/:goalId',getAGoal)
router.get('/:projectId/goals', getGoalsByProjectId);
router.put('/:projectId/goal/:goalId/updateGoal', updateAGoal)

router.post('/:projectId/goal/:goalId/createTask', createNewTask)
router.get('/:projectId/goal/:goalId/task/:taskId', getATask)
router.delete('/:projectId/goal/:goalId/task/:taskId', deleteATask)
router.get('/:projectId/goal/:goalId/tasks', getTasksByGoalId);
router.put('/:projectId/goal/:goalId/task/:taskId/updateProject', updateATask)


export default router;
