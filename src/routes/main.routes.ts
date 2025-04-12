import { Router } from 'express';
const router = Router();
import userRouter from './user.routes';
import usersRoutes from './users.routes'
import loginRoutes from './login.routes'
import projectRoutes from './project.routes';

router.use('/user', userRouter);
router.use('/users', usersRoutes);
router.use('/login', loginRoutes);
router.use('/project', projectRoutes);


export default router;
