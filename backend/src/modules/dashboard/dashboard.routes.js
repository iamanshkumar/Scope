import { Router } from "express";
import { verifyJWT } from "../../common/middleware/auth.middleware.js";
import { getDashboardStats } from "./dashboard.controller.js";

const router = Router();
router.use(verifyJWT);

router.get("/stats", getDashboardStats);

export default router;