import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  skill: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  scheduledAt: Date;
  notes: string;
  status: "upcoming" | "completed" | "cancelled";
}

const sessionSchema = new Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISession>("Session", sessionSchema);