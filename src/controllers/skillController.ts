import { Response } from "express";
import mongoose from "mongoose";
import Skill from "../models/Skill";
import { AuthRequest } from "../middleware/authMiddleware";

// Helper to handle Mongoose errors consistently
const handleError = (error: any, res: Response): void => {
  console.error(error);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e: any) => e.message);
    res.status(400).json({
      message: "Validation failed",
      errors: messages,
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({
      message: "Invalid ID format",
    });
    return;
  }

  res.status(500).json({
    message: "Server Error",
  });
};

// Helper to safely extract a single string ID from req.params
// (req.params values can be typed as string | string[] depending on @types/express-serve-static-core version)
const getIdParam = (param: string | string[] | undefined): string | null => {
  if (!param) return null;
  if (Array.isArray(param)) return param[0] ?? null;
  return param;
};

// Create Skill
export const createSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, level } = req.body;

    const skill = await Skill.create({
      title,
      description,
      category,
      level,
      owner: req.userId,
    });

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get All Skills
export const getSkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const skills = await Skill.find().populate(
      "owner",
      "name email profileImage"
    );

    res.status(200).json(skills);
  } catch (error) {
    handleError(error, res);
  }
};

// Get Single Skill
export const getSkillById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getIdParam(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const skill = await Skill.findById(id).populate(
      "owner",
      "name email profileImage"
    );

    if (!skill) {
      res.status(404).json({
        message: "Skill not found",
      });
      return;
    }

    res.status(200).json(skill);
  } catch (error) {
    handleError(error, res);
  }
};

// Update Skill
export const updateSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getIdParam(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      res.status(404).json({
        message: "Skill not found",
      });
      return;
    }

    if (skill.owner.toString() !== req.userId) {
      res.status(403).json({
        message: "Not authorized",
      });
      return;
    }

    skill.title = req.body.title ?? skill.title;
    skill.description = req.body.description ?? skill.description;
    skill.category = req.body.category ?? skill.category;
    skill.level = req.body.level ?? skill.level;

    await skill.save();

    res.status(200).json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Delete Skill
export const deleteSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getIdParam(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      res.status(404).json({
        message: "Skill not found",
      });
      return;
    }

    if (skill.owner.toString() !== req.userId) {
      res.status(403).json({
        message: "Not authorized",
      });
      return;
    }

    await skill.deleteOne();

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    handleError(error, res);
  }
};