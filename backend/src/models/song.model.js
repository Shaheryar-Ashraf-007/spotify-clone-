import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },

    artist:{
        type: String,
        required: true,
    },

    imageUrl:{
        type: String,
        required: true,
    },

    audioUrl:{
        type: String,
        required: true,
    },

    duration:{
        type: Number,
        required: true,
    },

    albumId:{
        types:mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required:false
    }
},{timestamps: true});

export const Song = mongoose.model("Song", userSchema);