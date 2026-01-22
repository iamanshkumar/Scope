import { Router } from "express";
import { verifyJWT } from "../../common/middleware/auth.middleware.js";
import { authorizeRoles } from "../../common/middleware/role.middleware.js";
import { createTask , getTasksByProject , updateTaskStatus , deleteTask } from "./task.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(authorizeRoles("admin" , "manager"),createTask)
router.route("/project/:projectId").get(getTasksByProject)
router.route("/:taskId/status").patch(updateTaskStatus)
router.route("/:taskId").delete(deleteTask)

export default router