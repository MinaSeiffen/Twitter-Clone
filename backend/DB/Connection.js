import mongoose from "mongoose";

const connectMongoDB = async ()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB Connected Successfully")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

export default connectMongoDB