import { generateTokenAndSetCookie } from "../Lib/Utils/generateToken.js";
import userModel from "../Models/user.model.js";
import bcrypt from "bcryptjs"

export const signupController = async (req, res, next) => {
    try {
        const {fullName , userName , email , password} = req.body
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
           return res.status(400).json({error: 'Invalid email'})
        }

        const excistingUser = await userModel.findOne({ userName})

        if(excistingUser){
           return res.status(401).json({error: 'UserName is Taken'})
        }

        const excistingEmail = await userModel.findOne({email})

        if(excistingEmail){
            return res.status(401).json({error: 'Email is Taken'})
        }

        if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

        // hashing Password

        const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            fullName,
            userName,
            email,
            password:hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id , res)
            await newUser.save()
            console.log(newUser)

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        } else {
            return res.status(400).json({error:"Invalid user data"})
        }

    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}


export const loginController = async (req, res, next) => {
    try {
        const {userName , password} = req.body

        const user = await userModel.findOne({userName})

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

       generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
        
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}


export const logoutController = async (req, res, next) => {
    try {
        res.cookie("token" , "" , {maxAge: 0})
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export const getMe = async (req, res, next) =>{
    try {
        const user = await userModel.findById(req.user._id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}