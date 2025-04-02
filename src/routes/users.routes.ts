import { Router } from "express";
import {getUsers, createUser, updateUser, deleteUser, getUser} from "../controllers/users.controllers"

const router = Router()


router.get('/users', getUsers)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id',deleteUser)
router.get('/users/:id', getUser)

export default router