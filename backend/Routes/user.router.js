import express from "express"
import { protect } from "../MiddleWare/Protect.js"
import { followOrUnfollowUser, getSuggestedUsers, getUserProfile, updateProfile } from "../Controllers/user.controller.js"

const router = express.Router()


router.get("/profile/:userName" ,protect ,getUserProfile )
router.get("/suggested" ,protect ,getSuggestedUsers )
router.post("/follow/:id" ,protect ,followOrUnfollowUser )
router.post("/update" ,protect ,updateProfile )


export default router