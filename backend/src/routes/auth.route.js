import { Router } from "express";
import { authCallback } from "../controllers/auth.controller.js";

const router = Router();

router.get("/auth",authCallback )


export default router;