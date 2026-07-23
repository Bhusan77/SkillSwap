import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getOrCreateRoom } from "../controllers/callController";

const router = express.Router();

router.post("/room", protect, getOrCreateRoom);

export default router;