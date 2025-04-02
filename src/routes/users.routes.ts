import { Router } from "express";
import {getUsers, createUser, updateUser, deleteUser, getUser} from "../controllers/users.controllers"
import validateToken from "./validation/validate-token"

const router = Router()


router.get('/users',validateToken, getUsers)
router.post('/users', createUser)
router.put('/users/:id',validateToken, updateUser)
router.delete('/users/:id',validateToken,deleteUser)
router.get('/users/:id',validateToken, getUser)

export default router