export interface MessageUser {
  _id: string;
  name: string;
  profileImage?: string;
}

export type MessageType = "text" | "call";
export type CallType = "video" | "audio" | null;

export interface Message {
  _id: string;
  sender: MessageUser;
  receiver: MessageUser;
  content: string;
  read: boolean;
  type: MessageType;
  callType: CallType;
  callDurationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageInput {
  receiverId: string;
  content: string;
}

export interface SendMessageResponse {
  message: string;
  data: Message;
}

export interface LogCallInput {
  receiverId: string;
  callType: "video" | "audio";
  durationSeconds: number;
}

export interface ConversationSummary {
  user: MessageUser;
  lastMessage: {
    content: string;
    createdAt: string;
    senderIsMe: boolean;
  };
  unreadCount: number;
}