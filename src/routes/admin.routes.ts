import { Router } from "express";
import { deleteAUser, getUsers } from "../controllers/admin.controller";
import { validateAdminToken } from "../middlewares/validate-token";

const router = Router()

router.put('/:id', validateAdminToken, deleteAUser);
router.get('/',validateAdminToken, getUsers)

export default router