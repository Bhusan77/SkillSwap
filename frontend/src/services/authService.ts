import type { AuthResponse, LoginInput, RegisterInput } from "../types/User";
import api from "./api";

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterInput
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};