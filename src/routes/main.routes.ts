import { Router } from 'express';
const router = Router();
import usersRoutes from './users.routes'
import loginRoutes from './auth.routes'
import projectRoutes from './project.routes';
import authRoutes from './auth.routes'
import adminRoutes from './admin.routes'

router.use('/users', usersRoutes);
router.use('/project', projectRoutes);
router.use('/auth',authRoutes);
router.use('/admin', adminRoutes);

export default router;
