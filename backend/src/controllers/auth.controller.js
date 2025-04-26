import { Router } from "express";
import { User } from "../models/userModel.js";


const router = Router();

export const authCallback= async (req, res) => {
    try {
        const {id,firstName,lastName, imageUrl} = req.body;

        const user = await User.findOne({clerkId: id});

        if (!user) {
            const newUser = await User.create({
                clerkId: id,
                fullName:`${firstName}, ${lastName}`,
                imageUrl
            });
             res.status(201).json(newUser);
        } 
    } catch (error) {
        console.log("Error in user route", error);
        res.status(500).json({message: "Internal server error"});
        
    }
    res.log("User route is working");
}

export default router;