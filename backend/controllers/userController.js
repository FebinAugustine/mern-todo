import { User } from "../database/models/User.js";
import { Todo } from "../database/models/Todo.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

const getUserProfile = asyncHandler(async (req, res) => {
  const stats = await Todo.aggregate([
    { $match: { owner: req.user._id } },
    {
      $group: {
        _id: null,
        totalTodos: { $sum: 1 },
        completedTodos: {
          $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
        stats: stats[0] || { totalTodos: 0, completedTodos: 0 },
      },
      "Profile fetched successfully"
    )
  );
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "At least one field is required");
  }

  const updateFields = {};
  if (username) {
    const existingUser = await User.findOne({ username });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(409, "Username already taken");
    }
    updateFields.username = username;
  }

  if (email) {
    const existingUser = await User.findOne({ email });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(409, "Email already in use");
    }
    updateFields.email = email;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
    select: "-password -refreshToken",
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Details updated successfully"
      )
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true, select: "-password -refreshToken" }
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, { user: updatedUser }, "Avatar updated successfully")
    );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Both current and new password are required");
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect Current Password !"); // Changed from 401 to 400
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

export { getUserProfile, updateUserDetails, updateAvatar, updatePassword };
