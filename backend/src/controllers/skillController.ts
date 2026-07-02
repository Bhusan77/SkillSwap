import { Response } from "express";
import Skill from "../models/Skill";
import { AuthRequest } from "../middleware/authMiddleware";

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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Single Skill
export const getSkillById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update Skill
export const updateSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Skill
export const deleteSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);

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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};