import api from "./api";

export const getOrCreateCallRoom = async (roomKey: string): Promise<string> => {
  const response = await api.post<{ url: string }>("/calls/room", { roomKey });
  return response.data.url;
};