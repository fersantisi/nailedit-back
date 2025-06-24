import { Router } from 'express';
import {
  deleteAUser,
  getUsers,
  isAdminLogged,
  getAdmin,
  updateUser,
} from '../controllers/admin.controller';

const router = Router();

router.delete('/users/:id', deleteAUser);
router.get('/users', getUsers);
router.get('/me', isAdminLogged);
router.get('/profile/:id', getAdmin);
router.put('/users/:id', updateUser);

export default router;
