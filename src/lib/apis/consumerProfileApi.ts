import apiClient from "../apiClient";
import type { AreaType } from "@/types/areaTypes";
import type { ServerMoveType } from "@/types/moveTypes";

// ==================== Types ====================

export interface CreateConsumerProfileRequest {
  image?: string | null;
  serviceType: ServerMoveType;
  areas: AreaType;
}

export interface ConsumerProfile {
  id: string;
  userId: string;
  image: string | null;
  serviceType: ServerMoveType;
  areas: AreaType;
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

export const createConsumerProfile = async (
  data: CreateConsumerProfileRequest
): Promise<ApiResponse<ConsumerProfile>> => {
  const response = await apiClient.post<ApiResponse<ConsumerProfile>>("/consumers/profile", data);

  return response.data;
};
