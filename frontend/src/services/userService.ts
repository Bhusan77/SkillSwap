import api from "./api";
import { User, UpdateProfileInput, UpdateProfileResponse } from "../types/User";

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileInput
): Promise<UpdateProfileResponse> => {
  const response = await api.put<UpdateProfileResponse>("/users/profile", data);
  return response.data;
};

export interface UploadImageResponse {
  message: string;
  imageUrl: string;
}

export const uploadProfileImage = async (
  file: File
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<UploadImageResponse>(
    "/users/upload-profile-image",
    formData,
    // Explicitly unset Content-Type (not just omit it) — api.ts sets a default
    // "application/json" header on every request, which would otherwise override
    // this call too. Setting it to undefined here removes that default so the
    // browser can generate the correct "multipart/form-data; boundary=..." header
    // itself, which multer requires to parse the upload correctly.
    { headers: { "Content-Type": undefined } }
  );
  return response.data;
};