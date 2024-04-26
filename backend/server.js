import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./DB/Connection.js";
import {v2 as cloudinary} from "cloudinary"

import authRoutes from "./Routes/auth.router.js"
import userRoutes from "./Routes/user.router.js"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
const port = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth" , authRoutes)
app.use("/api/user" , userRoutes)


app.listen(port , ()=>{
    console.log("Server is Running on port " + port)
    connectMongoDB()
});