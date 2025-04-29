import { Router } from 'express';
const router = Router();
import {
  createNewProject,
  deleteAProject,
  getProjectsByUserId,
} from '../controllers/project.controller';

router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.put('/update', )
router.get('/list', getProjectsByUserId);

export default router;
