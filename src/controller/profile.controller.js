// controllers/user.controller.js
import UserModel from "../model/auth.model.js";
import { CatchError } from "../utils/errors.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware
    const { bio, mobile, country, state, city } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (country !== undefined) updateData.country = country;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;
    if (image !== undefined) updateData.image = image;
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires -__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    CatchError(error, res, "Profile not updating, please try again");
  }
};
