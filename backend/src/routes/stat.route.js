import { Router } from "express";
import { protectRoute, requiredAdmin } from "../middlewares/auth.middleware.js";
import { getAllStats } from "../controllers/stat.controller.js";


const router = Router();

router.get("/stats", protectRoute, requiredAdmin, getAllStats)

export default router;