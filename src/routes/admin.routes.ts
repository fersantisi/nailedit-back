import { Router } from "express";
import { deleteAUser, getUsers, isAdminLogged, getAdmin } from "../controllers/admin.controller";

const router = Router()

router.delete('/:id',deleteAUser);
router.get('/users', getUsers)
router.get('/me', isAdminLogged)
router.get('/profile/:id', getAdmin);

export default router