import api from "./api";
import { User, UpdateProfileInput, UpdateProfileResponse } from "../types/User";

// GET /api/users/me — returns the raw user object, no wrapper
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

// PUT /api/users/profile — returns { message, user }
export const updateProfile = async (
  data: UpdateProfileInput
): Promise<UpdateProfileResponse> => {
  const response = await api.put<UpdateProfileResponse>("/users/profile", data);
  return response.data;
};