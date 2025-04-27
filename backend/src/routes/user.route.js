import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";


const router = Router();

router.get("/auth", protectRoute,getAllUsers)
   

export default router;