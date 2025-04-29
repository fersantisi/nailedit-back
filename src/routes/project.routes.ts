import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
  updateAProjectCategory,
  updateAProjectDescription,
  updateAProjectDuedate,
  updateAProjectImage,
  updateAProjectName,
} from '../controllers/project.controller';
import { createNewGoal, deleteAGoal, getAGoal, getGoalsByProjectId, updateAGoalDescription, updateAGoalDuedate, updateAGoalName } from '../controllers/goal.controller';
import { createNewTask, deleteATask, getATask, getTasksByGoalId, updateATaskDescription, updateATaskDuedate, updateATaskLabel, updateATaskName } from '../controllers/task.controller';


const router = Router();
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.get('/list', getProjectsByUserId);
router.put('/updateName/:projectId', updateAProjectName)
router.put('/updateDescription/:projectId', updateAProjectDescription)
router.put('/updateCategory/:projectId', updateAProjectCategory)
router.put('/updateImage/:projectId', updateAProjectImage)
router.put('/updateDuedate/:projectId', updateAProjectDuedate)


router.post('/:projectId/createGoal', createNewGoal )
router.delete('/:projectId/:goalId', deleteAGoal)
router.get('/:projectId/:goalId',getAGoal)
router.get('/:projectId/list', getGoalsByProjectId);
router.put('/updateName/:goaltId', updateAGoalName)
router.put('/updateDescription/:goaltId', updateAGoalDescription)
router.put('/updateDuedate/:goaltId', updateAGoalDuedate)

router.post('/:projectId/:goalId/createTask', createNewTask)
router.get('/:projectId/:goalId/:taskId', getATask)
router.delete('/:projectId/:goalId/:taskId', deleteATask)
router.get('/:projectId/:goalId/list', getTasksByGoalId);
router.put('/updateName/:taskId', updateATaskName)
router.put('/updateDescription/:taskId', updateATaskDescription)
router.put('/updateCategory/:taskId', updateATaskLabel)
router.put('/updateDuedate/:taskId', updateATaskDuedate)


export default router;
