import api from "./api";
import { Session, CreateSessionInput, SessionResponse } from "../types/session";

export const getMySessions = async (): Promise<Session[]> => {
  const response = await api.get<Session[]>("/sessions");
  return response.data;
};

export const createSession = async (
  data: CreateSessionInput
): Promise<SessionResponse> => {
  const response = await api.post<SessionResponse>("/sessions", data);
  return response.data;
};

export const cancelSession = async (id: string): Promise<SessionResponse> => {
  const response = await api.put<SessionResponse>(`/sessions/${id}/cancel`, {});
  return response.data;
};

export const completeSession = async (id: string): Promise<SessionResponse> => {
  const response = await api.put<SessionResponse>(`/sessions/${id}/complete`, {});
  return response.data;
};