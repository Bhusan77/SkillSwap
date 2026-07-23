import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

const DAILY_API_URL = "https://api.daily.co/v1/rooms";

// Sanitize a raw key (session ID or sorted user IDs) into a valid Daily room name:
// lowercase letters, numbers, and hyphens only.
const sanitizeRoomName = (raw: string): string =>
  `skillswap-${raw}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

export const getOrCreateRoom = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { roomKey } = req.body;

    if (!roomKey) {
      res.status(400).json({ message: "roomKey is required" });
      return;
    }

    const apiKey = process.env.DAILY_API_KEY;
    if (!apiKey) {
      res.status(500).json({ message: "Video calling is not configured" });
      return;
    }

    const roomName = sanitizeRoomName(roomKey);

    // Check if the room already exists first, to avoid creating duplicates
    // every time the same two people start a call.
    const existing = await fetch(`${DAILY_API_URL}/${roomName}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (existing.ok) {
      const data = await existing.json();
      res.status(200).json({ url: data.url });
      return;
    }

    // Room doesn't exist yet — create it.
    const created = await fetch(DAILY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "public",
        properties: {
          enable_knocking: false,
          enable_prejoin_ui: true,
        },
      }),
    });

    if (!created.ok) {
      const errBody = await created.text();
      console.error("Daily room creation failed:", errBody);
      res.status(500).json({ message: "Failed to create video room" });
      return;
    }

    const data = await created.json();
    res.status(201).json({ url: data.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};