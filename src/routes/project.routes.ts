import { Router } from 'express';
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
  updateAProject,
} from '../controllers/project.controller';
import { createNewGoal, deleteAGoal, getAGoal, getGoalsByProjectId, updateAGoal} from '../controllers/goal.controller';
import { createNewTask, deleteATask, getATask, getTasksByGoalId, updateATask} from '../controllers/task.controller';
import { createNewNote, deleteANote, getAllObjectNotes, getANote, updateANote } from '../controllers/note.controller';
import { getNoteByGoalIdService } from '../services/note.service';


const router = Router();

//project routes
router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.get('/list', getProjectsByUserId);
router.put('/:projectId/updateProject', updateAProject)

//goal routes
router.post('/:projectId/createGoal', createNewGoal )
router.delete('/:projectId/goal/:goalId', deleteAGoal)
router.get('/:projectId/goal/:goalId',getAGoal)
router.get('/:projectId/goals', getGoalsByProjectId);
router.put('/:projectId/goal/:goalId/updateGoal', updateAGoal)


//task routes
router.post('/:projectId/goal/:goalId/createTask', createNewTask)
router.get('/:projectId/goal/:goalId/task/:taskId', getATask)
router.delete('/:projectId/goal/:goalId/task/:taskId', deleteATask)
router.get('/:projectId/goal/:goalId/tasks', getTasksByGoalId);
router.put('/:projectId/goal/:goalId/task/:taskId/updateNote', updateATask)

//goal notes routes
router.post('/:projectId/goal/:goalId/createNote', createNewNote)
router.get('/:projectId/goal/:goalId/note/:noteId', getANote)
router.delete('/:projectId/goal/:goalId/note/:noteId', deleteANote)
router.get('/:projectId/goal/:goalId/notes', getAllObjectNotes);
router.put('/:projectId/goal/:goalId/note/:noteId/updateNote', updateANote)

//task notes routes
router.post('/:projectId/goal/:goalId/task/:taskId/createNote', createNewNote)
router.get('/:projectId/goal/:goalId/task/:taskId/note/:noteId', getANote)
router.delete('/:projectId/goal/:goalId/task/:taskId/note/:noteId', deleteANote)
router.get('/:projectId/goal/:goalId/task/:taskId/notes', getAllObjectNotes);
router.put('/:projectId/goal/:goalId/task/:taskId/note/:noteId/updateNote', updateANote)

//project notes routes
router.post('/:projectId/createNote', createNewNote)
router.get('/:projectId/note/:noteId', getANote)
router.delete('/:projectId/note/:noteId', deleteANote)
router.get('/:projectId/notes', getAllObjectNotes);
router.put('/:projectId/note/:noteId/updateNote', updateANote)

export default router;
