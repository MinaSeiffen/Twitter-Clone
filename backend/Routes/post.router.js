import express from "express"
import { protect } from "../MiddleWare/Protect.js"
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeAndUnlikePost } from "../Controllers/post.controllers.js"

const router = express.Router()

router.get('/all', protect , getAllPosts)
router.get('/following', protect , getFollowingPosts)
router.get('/likes/:id', protect , getLikedPosts)
router.get('/user/:userName', protect , getUserPosts)
router.post("/create" , protect , createPost)
router.post("/like/:id" , protect , likeAndUnlikePost)
router.post("/comment/:id" , protect , commentOnPost)
router.delete("/:id" , protect , deletePost)


export default router