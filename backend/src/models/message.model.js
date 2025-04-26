import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    senderId: {
        type:String,
        required: true,
    },
    receivedId:{
        type:String,
        required: true,
    },

    content:{
        type:String,
        required: true,
    }
},{timestamps: true});

export const Message = mongoose.model("Message", userSchema);


