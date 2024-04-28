import path from "path"
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./DB/Connection.js";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./Routes/auth.router.js";
import userRoutes from "./Routes/user.router.js";
import postRoutes from "./Routes/post.router.js";
import notificationRoutes from "./Routes/notification.router.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve()

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(port, () => {
  console.log("Server is Running on port " + port);
  connectMongoDB();
});
