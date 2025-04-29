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
router.delete('/:projectId/:goalId', deleteAGoal)
router.get('/:projectId/:goalId',getAGoal)
router.get('/:projectId/list', getGoalsByProjectId);
router.put('/:projectId/goal/:goalId/updateGoal', updateAGoal)

router.post('/:projectId/:goalId/createTask', createNewTask)
router.get('/:projectId/:goalId/:taskId', getATask)
router.delete('/:projectId/:goalId/:taskId', deleteATask)
router.get('/:projectId/:goalId/list', getTasksByGoalId);
router.put('/:projectId/goal/:goalId/task/:taskId/updateProject', updateATask)


export default router;
