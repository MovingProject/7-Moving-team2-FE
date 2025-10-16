import apiClient from "../apiClient";
import type { AreaType } from "@/types/areaTypes";
import type { ServerMoveType } from "@/types/moveTypes";

// ==================== Types ====================

export interface CreateDriverProfileRequest {
  image?: string | null;
  nickname: string;
  careerYears: number;
  oneLiner: string;
  description: string;
  serviceTypes: ServerMoveType[];
  serviceAreas: AreaType[];
}

export interface DriverProfile {
  id: string;
  userId: string;
  image: string | null;
  nickname: string;
  careerYears: string;
  oneLiner: string;
  description: string;
  likeCount: number;
  rating: number;
  reviewCount: number;
  confirmedCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  data: T;
}

// ==================== API Functions ====================

export const createDriverProfile = async (
  data: CreateDriverProfileRequest
): Promise<ApiResponse<DriverProfile>> => {
  const response = await apiClient.post<ApiResponse<DriverProfile>>("/drivers/profile", data);

  return response.data;
};
