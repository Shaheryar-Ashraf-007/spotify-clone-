import { Router } from "express";

const router = Router();

router.get("/album", (req, res) => {
    res.send("Album route is working")
})

export default router;