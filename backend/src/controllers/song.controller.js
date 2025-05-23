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

    // Send the fetched songs as a response
    res.status(200).json({ songs }); // Include the songs in the response
  } catch (error) {
    console.error("Error fetching featured songs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSong = async (req, res) => {
    try {
        const { id } = req.params; // Get the song ID from the request parameters
        const result = await Song.findByIdAndDelete(id); // Delete the song

        if (!result) {
            return res.status(404).json({ message: "Song not found" }); // Handle not found
        }

        res.status(200).json({ message: "Song deleted successfully" }); // Success response
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const madeForYou = async (req, res, next) => {
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

    
    res.json({ title: 'Made For You', songs });
  } catch (error) {
    next(error); 
  }
};

export const getTrendingSong = async (req, res) => {
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
    console.error("Error fetching trending songs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};