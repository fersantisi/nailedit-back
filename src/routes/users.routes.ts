import { Router } from 'express';
import {
  updateUser,
  getUser,
  loggedIn,
  getUserProfileController,
  updateUserPasswordController,
  getParticipatedProjects,
  getUserPendingRequests,
} from '../controllers/users.controller';
import {
  validateToken,
  validateAdminToken,
} from '../middlewares/validate-token';
import { getUsers } from '../controllers/admin.controller';
import { getAllStock } from '../controllers/stock.controller';

import projectRoutes from './project.routes';

const router = Router();

// New profile management routes (specific routes first)
router.get('/profile', getUserProfileController);
router.put('/password', updateUserPasswordController);
router.get('/me', loggedIn);
router.get('/me/participated-projects', getParticipatedProjects);
router.get('/me/participation-requests', getUserPendingRequests);

// Legacy routes (parameterized routes last)
router.put('/:id', updateUser);
router.get('/profile/:id', getUser);
router.get('/me', loggedIn);

//get user stock
router.get('/:id/stock', getAllStock);

export default router;
