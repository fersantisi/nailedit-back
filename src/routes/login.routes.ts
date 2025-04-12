import { Router } from "express";
import { getLogin } from "../controllers/login.controller";

const router = Router()


router.get('/login', getLogin)
/* router.post('/users',)
router.put('/users/:id',)
router.delete('/users/:id',)
router.get('/users/:id', ) */

export default router