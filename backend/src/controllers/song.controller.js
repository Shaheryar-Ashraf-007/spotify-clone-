import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Songs fetched successfully", songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getFeaturedSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
  } catch (error) {
    console.error("Error fetching featured songs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const madeForYou = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSong = async (req, res) => {
  try {
    const songs = await Song.aggregate(
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      }
    );

    res.json(songs)
  } catch (error) {
    console.error("Error fetching featured songs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
