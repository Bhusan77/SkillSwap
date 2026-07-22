import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createSession,
  getMySessions,
  cancelSession,
  completeSession,
} from "../controllers/sessionController";

const router = express.Router();

router.post("/", protect, createSession);
router.get("/", protect, getMySessions);
router.put("/:id/cancel", protect, cancelSession);
router.put("/:id/complete", protect, completeSession);

export default router;