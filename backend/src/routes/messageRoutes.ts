import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  sendMessage,
  getConversation,
  getConversations,
} from "../controllers/messageController";

const router = express.Router();

router.get("/", protect, getConversations);

router.get("/:userId", (req, res, next) => {
  console.log("Route reached:", req.params.userId);
  next();
}, protect, getConversation);

router.post("/", protect, sendMessage);

export default router;