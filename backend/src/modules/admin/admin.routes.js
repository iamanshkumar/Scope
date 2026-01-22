import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../../common/middleware/auth.middleware.js"; 
import { getAllUsers, updateUserProfile } from "./admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/users").get(getAllUsers);
router.route("/users/:userId").patch(updateUserProfile);

export default router;