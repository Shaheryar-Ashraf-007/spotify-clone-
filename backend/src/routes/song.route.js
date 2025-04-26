import { Router } from "express";

const router = Router();

router.get("/songs", (req, res) => {
    console.log("Auth route is working");
    res.send("Auth route is working");
})

export default router;

