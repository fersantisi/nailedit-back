import { Router } from "express";
import { deleteAUser, getUsers } from "../controllers/admin.controller";

const router = Router()

router.delete('/:id',deleteAUser);
router.get('/', getUsers)

export default router