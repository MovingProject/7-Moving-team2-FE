import apiClient from "@/lib/apiClient";
import { UserData } from "@/types/card";
import { UpdateUserProfileDto } from "@/types/profile";

// 프로필 조회
export const getUserProfile = async (): Promise<UserData> => {
  const res = await apiClient.get<UserData>("/users/me");
  return res.data;
};

// 프로필 수정
export const patchUserProfile = async (dto: UpdateUserProfileDto): Promise<UserData> => {
  const res = await apiClient.patch<UserData>("/users/me/profile", dto);
  return res.data;
};

export interface UpdateBasicInfoDto {
  name?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const patchUserBasicInfo = async (dto: UpdateBasicInfoDto): Promise<UserData> => {
  const res = await apiClient.patch<UserData>("/users/me", dto);
  return res.data;
};
