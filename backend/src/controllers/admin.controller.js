import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Present" : "Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
});


  cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (file) => {
  try {
    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    console.log("Upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw error; // Rethrow original error for better debugging
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // Debug log files info
    console.log("Received audio file:", audioFile.name, audioFile.size);
    console.log("Received image file:", imageFile.name, imageFile.size);

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error deleting song:", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    console.log("Received album image file:", imageFile.name, imageFile.size);

    const imageUrl = await uploadToCloudinary(imageFile);
    const newAlbum = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await newAlbum.save();
    res.status(201).json({ message: "Album created successfully", album: newAlbum });
  } catch (error) {
    console.log("Error creating album:", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findByIdAndDelete(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    await Song.deleteMany({ albumId: id });
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error deleting album:", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
