import { Router } from "express";
import { createUser, forgotPassword, getLogin, recoverPassword } from "../controllers/auth.controller";

const router = Router()


router.post('/login', getLogin)
router.post('/signin', createUser);
router.post('/forgot-password', forgotPassword)
router.post('/recoverPassword/:jwt', recoverPassword)

export default router