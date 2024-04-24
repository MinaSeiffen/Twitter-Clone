
import express from "express";
import dotenv from "dotenv"
import connectMongoDB from "./DB/Connection";


dotenv.config();

const app = express();

const port = process.env.PORT || 3000

app.listen(port , ()=>{
    console.log("Server is Running on port " + port)
    connectMongoDB()
});