import { Router } from "express";
import { getAllAlbums, getAllAlbumsBYId  } from "../controllers/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId",getAllAlbumsBYId );



export default router;