import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";

const app = express();
console.log("Loaded CLOUDINARY_URL:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Loaded CLOUDINARY_URL:", process.env.CLOUDINARY_API_KEY);
console.log("Loaded CLOUDINARY_URL:", process.env.CLOUDINARY_API_SECRET);


const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(express.json()); 
app.use(clerkMiddleware()); 
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "tmp"),
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 },
}));

// Define your routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

// Start the server
httpServer.listen(PORT, () => console.log("Server is running on port " + PORT));

// Connect to the database
connectDB();