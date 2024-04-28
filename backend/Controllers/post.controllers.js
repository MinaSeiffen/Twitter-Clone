import notificationModel from "../Models/notification.model.js";
import postModel from "../Models/post.model.js";
import userModel from "../Models/user.model.js";

import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new postModel({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: "That post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ error: "You are not allowed to delete that post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await postModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!text) {
      return res.status(404).json({ error: "Text field is required" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);

    await post.save();

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const likeAndUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await postModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await userModel.updateOne(
        { _id: userId },
        { $pull: { likedPosts: postId } }
      );

      const updatedLikes = post.likes.filter((id)=> id.toString() !== userId.toString())

      res.status(200).json({updatedLikes, MSG: "Post Unliked Successfully"});

    } else {
      post.likes.push(userId);
      await userModel.updateOne(
        { _id: userId },
        { $push: { likedPosts: postId } }
      );
      await post.save();

      const newNotification = new notificationModel({
        from: userId,
        to: post.user,
        type: "like",
      });

      await newNotification.save();

      const updatedLikes = post.likes

      res.status(200).json({updatedLikes, MSG: "Post Liked Successfully"});
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const likedPosts = await postModel
      .find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({ path: "comments.user", seelect: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const following = user.following;

    const followingPosts = await postModel
      .find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(followingPosts);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await userModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const posts = await postModel
      .findOne({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};
