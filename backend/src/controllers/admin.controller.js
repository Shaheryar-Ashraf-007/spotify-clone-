import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const createSong = async (req, res, next) => {
  const uploadToCloudinary = async (file) => {};
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
