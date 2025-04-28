import { Router } from 'express';
const router = Router();
import { createNewProject, deleteAProject} from '../controllers/project.controller';

router.post('/create', createNewProject);
router.delete('/delete/:id', deleteAProject);
router.put('/update', )

export default router;
