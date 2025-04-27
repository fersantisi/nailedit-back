import { Router } from "express";
import { createUser, getLogin } from "../controllers/auth.controller";

const router = Router()


router.post('/login', getLogin)
router.post('/register', createUser);

export default router