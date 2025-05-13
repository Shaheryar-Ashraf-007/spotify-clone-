import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) => {
    try {

        const albums = await Album.find();
        res.status(200).json({ message: "Albums fetched successfully", albums });

    } catch (error) {

        next(error);
        
    }
}

export const getAllAlbumsBYId = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await Album.findById(albumId).populate("songs");

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        // Send the found album back to the client
        return res.status(200).json(album);
    } catch (error) {
        next(error);
    }
};