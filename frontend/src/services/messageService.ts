import api from "./api";
import {
  Message,
  SendMessageInput,
  SendMessageResponse,
  ConversationSummary,
  LogCallInput,
} from "../types/message";

export const sendMessage = async (
  data: SendMessageInput
): Promise<SendMessageResponse> => {
  const response = await api.post<SendMessageResponse>("/messages", data);
  return response.data;
};

export const logCall = async (data: LogCallInput): Promise<void> => {
  await api.post("/messages/call-log", data);
};

export const getConversation = async (userId: string): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/messages/${userId}`);
  return response.data;
};

export const getConversations = async (): Promise<ConversationSummary[]> => {
  const response = await api.get<ConversationSummary[]>("/messages");
  return response.data;
};