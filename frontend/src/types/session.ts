export type SessionStatus = "upcoming" | "completed" | "cancelled";

export interface SessionSkill {
  _id: string;
  title: string;
  category: string;
  level: string;
}

export interface SessionUser {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Session {
  _id: string;
  skill: SessionSkill;
  teacher: SessionUser;
  student: SessionUser;
  scheduledAt: string;
  notes: string;
  status: SessionStatus;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  skillId: string;
  scheduledAt: string;
  notes?: string;
}

export interface SessionResponse {
  message: string;
  session: Session;
}