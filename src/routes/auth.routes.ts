import { Router } from 'express';
import {
  createUser,
  forgotPassword,
  getLogin,
  recoverPassword,
  logout,
  verifyRecoveryToken,
  google,
} from '../controllers/auth.controller';

const router = Router();

router.post('/login', getLogin);
router.post('/google', google);
router.post('/signin', createUser);
router.post('/forgot-password', forgotPassword);
router.post('/recoverPassword/:jwt', recoverPassword);
router.get('/logout', logout);
router.get('/recoverPassword/:jwt', verifyRecoveryToken);

export default router;
