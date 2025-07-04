import { Router } from 'express';
import {
  updateUser,
  getUser,
  loggedIn,
  getUserProfileController,
  updateUserPasswordController,
} from '../controllers/users.controller';
import {
  validateToken,
  validateAdminToken,
} from '../middlewares/validate-token';
import { getUsers } from '../controllers/admin.controller';

import projectRoutes from './project.routes';

const router = Router();

// New profile management routes (specific routes first)
router.get('/profile', getUserProfileController);
router.put('/password', updateUserPasswordController);
router.get('/me', loggedIn);

// Legacy routes (parameterized routes last)
router.put('/:id', updateUser);
router.get('/profile/:id', getUser);

export default router;
