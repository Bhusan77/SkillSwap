import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

// =======================================
// Get Logged-in User
// =======================================
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("========== GET CURRENT USER ==========");
    console.log("User ID:", req.userId);

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("========== GET CURRENT USER ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

// =======================================
// Update Profile
// =======================================
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("========== UPDATE PROFILE ==========");
    console.log("User ID:", req.userId);
    console.log("Request Body:", req.body);

    const user = await User.findById(req.userId);

    console.log("User Found:", user);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    if (req.body.location !== undefined) {
      user.location = req.body.location;
    }

    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage;
    }

    if (req.body.skillsOffered !== undefined) {
      user.skillsOffered = req.body.skillsOffered;
    }

    if (req.body.skillsWanted !== undefined) {
      user.skillsWanted = req.body.skillsWanted;
    }

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    console.error("========== UPDATE PROFILE ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};
// =======================================
// Upload Profile Image
// =======================================
export const uploadProfileImageHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const file = (req as any).file;

    if (!file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    const imageUrl = `/uploads/profile-images/${file.filename}`;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("========== UPLOAD PROFILE IMAGE ERROR ==========");
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};