import apiClient from "@/lib/apiClient";
import { UpdateUserProfileDto, UserProfileResponse } from "@/types/profile";

// GET /users/me
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>("/users/me");
  return response.data;
};

// PATCH /users/me/profile
export const patchUserProfile = async (
  data: UpdateUserProfileDto
): Promise<UserProfileResponse> => {
  const response = await apiClient.patch<UserProfileResponse>("/users/me/profile", data);
  return response.data;
};
