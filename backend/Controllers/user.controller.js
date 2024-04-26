import notificationModel from "../Models/notification.model.js";
import userModel from "../Models/user.model.js";
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from "cloudinary"
 
export const getUserProfile = async (req, res, next) => {
  const { userName } = req.params;

  try {
    const user = await userModel.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followOrUnfollowUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userToFollowOrUnfollow = await userModel.findById(id);
    const currentUser = await userModel.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can not follow or unfollow yourself" });
    }

    if (!userToFollowOrUnfollow || !currentUser) {
      return res.status(404).json({ error: "user not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow user
      await userModel.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      await userModel.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await userModel.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      const newNotification = new notificationModel({
        from: req.user._id,
        to: userToFollowOrUnfollow._id,
        type: "follow",
      });
      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await userModel
      .findById(userId)
      .select("following");

    const users = await userModel.aggregate([
      {
        $match: {
          _id:{ $ne :userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
    const {userName , email , fullName , currentPassword , newPassword , bio , link} = req.body
    let {profileImg , coverImg} = req.body
    
    const userId = req.user._id

   try {
    let user = await userModel.findById(userId)

    if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
        return res.status(404).json({error: "Please insert current and new passwords"})
    }

    if (newPassword && currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(404).json({error: "current password is not match"})
        }
        if (newPassword.length < 6) {
            return res.status(404).json({error: "Please make sure that your new password is more than 6 letters" })
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt)
    }

    if (profileImg) {
        if (user.profileImg) {
            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
        }
        const imgResponse = await cloudinary.uploader(profileImg)
        profileImg = imgResponse.secure_url
    }

    if (coverImg) {
        if (user.coverImg) {
            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
        }
        const imgResponse = await cloudinary.uploader(coverImg)
        coverImg = imgResponse.secure_url
    }

    user.fullName = fullName || user.fullName;
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link
    user.profileImg = profileImg || user.profileImg
    user.coverImg = coverImg || user.coverImg;

    user = await user.save()

    user.password = null;

    res.status(200).json(user)

   } catch (error) {
        res.status(500).json({error: error.message})
   }

}