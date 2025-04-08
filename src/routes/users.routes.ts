import { Router } from "express";
import {getUsers, createUser, updateUser, deleteUser, getUser} from "../controllers/users.controllers"
import {validateToken, validateAdminToken} from "./validation/validate-token"

const router = Router()


router.get('/users',validateAdminToken, getUsers)
router.post('/users', createUser)
router.put('/users/:id',validateAdminToken, updateUser)
router.delete('/users/:id',validateToken,deleteUser)
router.get('/users/:id',validateToken, getUser)

export default router