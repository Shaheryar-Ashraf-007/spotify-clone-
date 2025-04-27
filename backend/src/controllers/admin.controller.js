import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const createSong = async (req, res, next) => {
  const uploadToCloudinary = async (file) => {

    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",

      })

      return result.secure_url;
    } catch (error) {

      console.error("Error uploading file to Cloudinary:", error);
      throw new Error("File upload failed");
      
    }

  };
  try {
    if (!req.file || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, artist, albumId, duration } = req.body;

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const newSong = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      album: albumId || null,
      duration,
    });

    await newSong.save();
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res
      .status(201)
      .json({ message: "Song created successfully", song: newSong });
  } catch (error) {
    console.log("Error creating song:", error);
    next(error);
  }
};


export const deleteSong = async (req, res, next) => {

  try {

    const {id} = req.params;
    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);
    
  } catch (error) {

    console.log("Error deleting song:", error);
    next(error);
    
  }}

  export const createAlbum = async (req, res, next) => {

    try {
      const { title, artist, releaseYear } = req.body;
      const {imageFile} = req.files;

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
  }

  export const deleteAlbum = async (req, res, next) => {
    try {

      const {id} = req.params;
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
  }


  export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true });
  }
