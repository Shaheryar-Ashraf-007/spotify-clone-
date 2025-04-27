import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getTrendingSong, madeForYou } from "../controllers/song.controller.js";
import { protectRoute, requiredAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/songs",protectRoute, requiredAdmin, getAllSongs)
router.get("/featured", getFeaturedSongs)
router.get("/made-for-you", madeForYou)
router.get("/trending", getTrendingSong)




export default router;

