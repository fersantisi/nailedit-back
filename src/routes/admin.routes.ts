import { Router } from "express";
import { deleteAUser, getUsers } from "../controllers/admin.controller";
import { validateAdminToken } from "../middlewares/validate-token";

const router = Router()

router.put('/delete/:id', validateAdminToken, deleteAUser);
router.get('/users',validateAdminToken, getUsers)

export default router