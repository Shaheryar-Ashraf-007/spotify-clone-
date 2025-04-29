import { Router } from "express";
import { User } from "../models/userModel.js";

const router = Router();

export const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        // Check if required fields are present
        if (!id || !firstName || !lastName || !imageUrl) {
            return res.status(400).json({ message: 'Missing required fields in request body' });
        }

        const user = await User.findOne({ clerkId: id });

        if (!user) {
            const newUser = await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`, // Corrected formatting
                imageUrl
            });
            return res.status(201).json({
                success: true,
                data: newUser
            });
        }

        // If user already exists, respond with the existing user
        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Error in authCallback:", error); // Improved logging
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default router;