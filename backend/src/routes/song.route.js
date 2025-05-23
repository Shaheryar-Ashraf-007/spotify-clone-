import { Router } from "express";
import { deleteSong, getAllSongs, getFeaturedSongs, getTrendingSong, madeForYou } from "../controllers/song.controller.js";
import { protectRoute, requiredAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",protectRoute, requiredAdmin,getAllSongs )
router.delete("/:id",protectRoute, requiredAdmin, deleteSong)
router.get("/featured", getFeaturedSongs)
router.get("/made-for-you", madeForYou)
router.get("/trending", getTrendingSong)




export default router;

