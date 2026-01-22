import { Router } from "express"
import { verifyJWT } from "../../common/middleware/auth.middleware.js"
import { authorizeRoles } from "../../common/middleware/role.middleware.js"
import { createProject , getAllProjects, getProjectById ,addMember} from "./project.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/").get(getAllProjects)
                .post(authorizeRoles("admin" , "manager"),
                createProject)

router.route("/:projectId").get(getProjectById)

router.route("/:projectId/invite").post(verifyJWT , addMember)

export default router