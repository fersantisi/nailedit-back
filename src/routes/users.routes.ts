import { Router } from 'express';
import {
  updateUser,
  getUser,
} from '../controllers/users.controller';
import {
  validateToken,
  validateAdminToken,
} from '../middlewares/validate-token';
import { getUsers } from '../controllers/admin.controller';

import projectRoutes from './project.routes';

const router = Router();


router.put('/:id', updateUser);
router.get('/profile/:id', getUser);

export default router;
