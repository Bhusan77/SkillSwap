import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware";
import Message from "../models/Message";
import User from "../models/User";

// Helper to safely extract a single string ID from req.params
const getIdParam = (param: string | string[] | undefined): string | null => {
  if (!param) return null;
  if (Array.isArray(param)) return param[0] ?? null;
  return param;
};

// Send a message
export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      res.status(400).json({ message: "receiverId and content are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      res.status(400).json({ message: "Invalid receiver ID" });
      return;
    }

    if (receiverId === req.userId) {
      res.status(400).json({ message: "You cannot message yourself" });
      return;
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      res.status(404).json({ message: "Recipient not found" });
      return;
    }

    const message = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      content: content.trim(),
    });

    const populated = await message.populate("sender receiver", "name profileImage");

    res.status(201).json({
      message: "Message sent",
      data: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get full message thread with one specific user
export const getConversation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("GET CONVERSATION");
    console.log(req.params);

    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        message: "User ID missing",
      });
      return;
    }

    const messages = await Message.find({
      $or: [
        {
          sender: req.userId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.userId,
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage");

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.userId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get list of conversations (most recent message with each person you've chatted with)
export const getConversations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.userId);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    const otherUserIds = conversations.map((c) => c._id);
    const users = await User.find({ _id: { $in: otherUserIds } }).select(
      "name profileImage"
    );
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const result = conversations.map((c) => ({
      user: userMap.get(c._id.toString()),
      lastMessage: {
        content: c.lastMessage.content,
        createdAt: c.lastMessage.createdAt,
        senderIsMe: c.lastMessage.sender.toString() === req.userId,
      },
      unreadCount: c.unreadCount,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};