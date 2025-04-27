import { User } from "../models/userModel.js"

export const getAllUsers = async(req,res,next)=>{
    try {

        const currentUserId = req.auth.userId
        const user  = await User.find({clerkId: {$ne : currentUserId}})

       res.status(200).join(users)
        } catch (error) {
            next(error)
        
    }

}