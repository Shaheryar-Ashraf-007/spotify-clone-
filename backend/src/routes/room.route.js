import express from "express";
import { getRoomState } from "../controllers/room.controller.js";

const router = express.Router();
router.get("/:roomId", getRoomState);

export default router;