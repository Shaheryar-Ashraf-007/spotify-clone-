import { Router } from "express";


const router = Router();

router.get("/auth", async (req, res) => {
    req.auth.userId
    res.send("Auth route is working")
})
   

export default router;