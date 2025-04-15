import { Router } from "express";
import { createUser, getLogin } from "../controllers/auth.controller";

const router = Router()


router.get('/login', getLogin)
router.post('/', createUser);

export default router