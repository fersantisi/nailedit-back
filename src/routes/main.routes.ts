import { Router } from 'express';
const router = Router();
import usersRoutes from './users.routes'
import loginRoutes from './auth.routes'
import projectRoutes from './project.routes';
import adminRoutes from './admin.routes'
import { validateAdminToken, validateToken } from '../middlewares/validate-token';




router.use('/user',validateToken, usersRoutes);
router.use('/login', loginRoutes);
router.use('/project',validateToken, projectRoutes);
router.use('/admin',validateAdminToken, adminRoutes);

export default router;
