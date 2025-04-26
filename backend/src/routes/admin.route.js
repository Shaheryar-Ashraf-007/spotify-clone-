import { Router } from "express";
import { createSong } from "../controllers/admin.controller.js";
import { protectRoute, requiredAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/songs", protectRoute, requiredAdmin, createSong);

export default router;
