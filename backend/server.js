import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./DB/Connection.js";

import authRoutes from "./Routes/auth.router.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth" , authRoutes)


app.listen(port , ()=>{
    console.log("Server is Running on port " + port)
    connectMongoDB()
});