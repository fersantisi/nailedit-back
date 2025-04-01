import { Router } from "express";
import {getUsers, createUser} from "../controllers/users.controllers"

const router = Router()


router.get('/users', getUsers)
router.post('/users', createUser)
router.put('/users:id')
router.delete('/users:id')
router.get('/users:id')

export default router