import { Router } from 'express';
import usersRoutes from './users.routes';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import adminRoutes from './admin.routes';
import stockRoutes from './stock.routes';
import communityRoutes from './community.routes';
import shoppingListRoutes from './shoppingList.routes';
import {
  validateAdminToken,
  validateToken,
} from '../middlewares/validate-token';

const router = Router();

router.use('/users', validateToken, usersRoutes);
router.use('/project', validateToken, projectRoutes);
router.use('/stock', validateToken, stockRoutes);
router.use('/community', validateToken, communityRoutes);
router.use('/shopping-list', validateToken, shoppingListRoutes);
router.use('/auth', authRoutes);
router.use('/admin', validateAdminToken, adminRoutes);

export default router;
