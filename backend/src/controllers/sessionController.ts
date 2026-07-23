import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware";
import Session from "../models/Sessions";
import Skill from "../models/Skill";

const getIdParam = (param: string | string[] | undefined): string | null => {
  if (!param) return null;
  if (Array.isArray(param)) return param[0] ?? null;
  return param;
};

const POPULATE_FIELDS = [
  { path: "skill", select: "title category level" },
  { path: "teacher", select: "name profileImage" },
  { path: "student", select: "name profileImage" },
];

// Book a session against a skill listing
export const createSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { skillId, scheduledAt, notes } = req.body;

    if (!skillId || !scheduledAt) {
      res.status(400).json({ message: "skillId and scheduledAt are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      res.status(400).json({ message: "Invalid skill ID" });
      return;
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      res.status(404).json({ message: "Skill not found" });
      return;
    }

    if (skill.owner.toString() === req.userId) {
      res.status(400).json({ message: "You cannot book a session for your own skill" });
      return;
    }

    const session = await Session.create({
      skill: skillId,
      teacher: skill.owner,
      student: req.userId,
      scheduledAt: new Date(scheduledAt),
      notes: notes || "",
    });

    const populated = await session.populate(POPULATE_FIELDS);

    res.status(201).json({
      message: "Session booked successfully",
      session: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all sessions where the current user is either teacher or student
export const getMySessions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const sessions = await Session.find({
      $or: [{ teacher: req.userId }, { student: req.userId }],
    })
      .sort({ scheduledAt: 1 })
      .populate(POPULATE_FIELDS);

    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Cancel a session — either the teacher or the student can cancel
export const cancelSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getIdParam(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid session ID" });
      return;
    }

    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const isParticipant =
      session.teacher.toString() === req.userId ||
      session.student.toString() === req.userId;

    if (!isParticipant) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    session.status = "cancelled";
    session.resolvedAt = new Date();
    await session.save();

    const populated = await session.populate(POPULATE_FIELDS);

    res.status(200).json({
      message: "Session cancelled",
      session: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark a session complete — only the teacher can confirm it happened
export const completeSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = getIdParam(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid session ID" });
      return;
    }

    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    if (session.teacher.toString() !== req.userId) {
      res.status(403).json({ message: "Only the teacher can mark a session complete" });
      return;
    }

    session.status = "completed";
    session.resolvedAt = new Date();
    await session.save();

    const populated = await session.populate(POPULATE_FIELDS);

    res.status(200).json({
      message: "Session marked complete",
      session: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};