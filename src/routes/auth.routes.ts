import { Router } from "express";
import { createUser, getLogin } from "../controllers/auth.controller";
import { validateLogin } from "../middlewares/validateLogin";

const router = Router()


router.get('/login',validateLogin, getLogin)
router.post('/', createUser);

export default router