import jwt from "jsonwebtoken"
import userModel from "../Models/user.model.js"

export const protect = async (req , res , next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(404).json({error: "please Login first"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)

        if(!decoded){
           return res.status(404).json({error: "Invalid token"})
        }

        const user = await userModel.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(404).json({error: "User Not Found "})
        }

        req.user = user

        next()
    } catch (error) {
        res.status(500).json({error: "Invalid token to the middleware"})
    } 
}