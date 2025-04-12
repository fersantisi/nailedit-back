import { Router } from 'express';
const router = Router();
import { create } from '../controllers/project.controller';

router.post('/create/', create);

export default router;