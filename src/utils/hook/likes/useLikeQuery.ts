"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

interface LikeDriverResponse {
  liked: boolean;
  message?: string;
}

export const likeDriver = async (driverId: string): Promise<LikeDriverResponse> => {
  const res = await apiClient.post<{ success: boolean; data: LikeDriverResponse }>(
    `/drivers/${driverId}/likes`
  );
  return res.data.data;
};

export const useLikeDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverId: string) => likeDriver(driverId),
    onSuccess: (data, driverId) => {
      // 기존 찜 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });

      if (data.liked) {
        console.log(`기사님(${driverId}) 좋아요 성공`);
      } else {
        console.log(`이미 좋아요된 기사님: ${driverId}`);
      }
    },
    onError: (error) => {
      console.error("좋아요 요청 실패:", error);
    },
  });
};
