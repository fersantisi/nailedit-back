import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getAProject,
  getProjectsByUserId,
  updateAProject,
  checkProjectPermissionsController,
} from '../controllers/project.controller';
import {
  createNewGoal,
  deleteAGoal,
  getAGoal,
  getGoalsByProjectId,
  updateAGoal,
  getAllGoalsController,
  setGoalCompleted,
} from '../controllers/goal.controller';
import {
  createNewTask,
  deleteATask,
  getATask,
  getTasksByGoalId,
  updateATask,
  getAllTasksController,
  setTaskCompleted,
} from '../controllers/task.controller';
import {
  createNewNote,
  deleteANote,
  getAllObjectNotes,
  getANote,
  updateANote,
} from '../controllers/note.controller';
import { getNoteByGoalIdService } from '../services/note.service';
import { getAllStock } from '../controllers/stock.controller';
import {
  uploadFile,
  getFilesForProject,
  getFile,
  removeFile,
} from '../controllers/file.controller';
import { upload } from '../middlewares/file.middleware';
import {
  acceptAParticipationRequest,
  getAllParticipationRequests,
  getAllProjectParticipants,
  rejectAParticipationRequest,
  removeAParticipant,
} from '../controllers/community.controller';
import { checkOwnership } from '../middlewares/checkOwnership';
import {
  checkProjectAccess,
  checkProjectOwnership,
} from '../middlewares/checkProjectAccess';

const router = Router();

//project routes
router.post('/create', createNewProject);
router.delete('/delete/:projectId', checkProjectOwnership, deleteAProject);
router.get('/list', getProjectsByUserId);
router.put('/:projectId/updateProject', updateAProject);
router.get('/:projectId', getAProject);

//community DLC
router.get('/:projectId/participants', getAllProjectParticipants);
router.get('/:projectId/participationRequests', getAllParticipationRequests);
router.post(
  '/:projectId/participationRequest/:requestId/accept',
  acceptAParticipationRequest,
);
router.post(
  '/:projectId/participationRequest/:requestId/reject',
  rejectAParticipationRequest,
);
router.delete(
  '/:projectId/participants/:participantId/remove',
  removeAParticipant,
);

//get proyect reserved stock
router.get('/:id/stock', getAllStock);

router.post('/:projectId/createGoal', createNewGoal);
router.delete('/:projectId/goal/:goalId', checkOwnership, deleteAGoal);
router.get('/:projectId/goal/:goalId', getAGoal);
router.get('/:projectId/goals', getGoalsByProjectId);
router.put('/:projectId/goal/:goalId/updateGoal', updateAGoal);

router.post('/:projectId/goal/:goalId/createTask', createNewTask);
router.get('/:projectId/goal/:goalId/task/:taskId', getATask);
router.delete(
  '/:projectId/goal/:goalId/task/:taskId',
  checkOwnership,
  deleteATask,
);
router.get('/:projectId/goal/:goalId/tasks', getTasksByGoalId);
router.put('/:projectId/goal/:goalId/task/:taskId/updateTask', updateATask);

//goal notes routes
router.post('/:projectId/goal/:goalId/createNote', createNewNote);
router.get('/:projectId/goal/:goalId/note/:noteId', getANote);
router.delete('/:projectId/goal/:goalId/note/:noteId', deleteANote);
router.get('/:projectId/goal/:goalId/notes', getAllObjectNotes);
router.put('/:projectId/goal/:goalId/note/:noteId/updateNote', updateANote);

//task notes routes
router.post('/:projectId/goal/:goalId/task/:taskId/createNote', createNewNote);
router.get('/:projectId/goal/:goalId/task/:taskId/note/:noteId', getANote);
router.delete(
  '/:projectId/goal/:goalId/task/:taskId/note/:noteId',
  deleteANote,
);
router.get('/:projectId/goal/:goalId/task/:taskId/notes', getAllObjectNotes);
router.put(
  '/:projectId/goal/:goalId/task/:taskId/note/:noteId/updateNote',
  updateANote,
);

//project notes routes
router.post('/:projectId/createNote', createNewNote);
router.get('/:projectId/note/:noteId', getANote);
router.delete('/:projectId/note/:noteId', deleteANote);
router.get('/:projectId/notes', getAllObjectNotes);
router.put('/:projectId/note/:noteId/updateNote', updateANote);

// Global routes (not nested under specific project/goal)
router.get('/goals/list', getAllGoalsController);
router.get('/tasks/list', getAllTasksController);

router.patch('/:projectId/goal/:goalId/complete', setGoalCompleted);
router.patch(
  '/:projectId/goal/:goalId/task/:taskId/complete',
  setTaskCompleted,
);

router.post('/:projectId/upload', upload.single('file'), uploadFile);
router.get('/:projectId/files', getFilesForProject);
router.get('/:projectId/files/:fileId', getFile);
router.delete('/:projectId/files/:fileId', removeFile);

// New permission endpoint
router.get('/:projectId/permissions', checkProjectPermissionsController);

export default router;
