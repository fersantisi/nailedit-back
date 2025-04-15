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

const router = Router();


router.put('/:id', validateAdminToken, updateUser);//add user validation to route
router.get('/:id', validateToken, getUser);//add user validation to route

export default router;
