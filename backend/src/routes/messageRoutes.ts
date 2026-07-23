import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  sendMessage,
  getConversation,
  getConversations,
  logCall,
} from "../controllers/messageController";

const router = express.Router();
console.log("🔍 DEBUG: messageRoutes.ts loaded — call-log route being registered now");

router.post("/", protect, sendMessage);
router.post("/call-log", protect, logCall);
router.get("/", protect, getConversations);
router.get("/:userId", protect, getConversation);

export default router;