import { Router } from 'express';
import usersRoutes from './users.routes'
import authRoutes from './auth.routes'
import projectRoutes from './project.routes';
import adminRoutes from './admin.routes'
import { validateAdminToken, validateToken } from '../middlewares/validate-token';

const router = Router();

router.use('/users',validateToken, usersRoutes);
router.use('/project',validateToken, projectRoutes);
router.use('/auth',authRoutes);
router.use('/admin',validateAdminToken, adminRoutes);

export default router;
