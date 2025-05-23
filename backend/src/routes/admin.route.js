import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controllers/admin.controller.js";
import { protectRoute, requiredAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute, requiredAdmin)
router.get("/check", checkAdmin);
router.post("/song", createSong);
router.delete("/song/:id", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum); 


export default router;
