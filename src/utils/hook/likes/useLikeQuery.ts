"use client";

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { DriverListResponse } from "@/types/driver";

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
    mutationFn: likeDriver,

    onMutate: async (driverId: string) => {
      // 쿼리 정지
      await queryClient.cancelQueries({ queryKey: ["driverListInfinite"], exact: false });

      const caches = queryClient.getQueriesData<InfiniteData<DriverListResponse>>({
        queryKey: ["driverListInfinite"],
      });

      for (const [key, oldData] of caches) {
        if (!oldData) continue;
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((driver) =>
              driver.user.id === driverId
                ? {
                    ...driver,
                    profile: {
                      ...driver.profile,
                      isLikedByCurrentUser: true,
                      likeCount: (driver.profile.likeCount ?? 0) + 1,
                    },
                  }
                : driver
            ),
          })),
        };
        queryClient.setQueryData(key, newData);
      }
    },

    // 성공 시 굳이 invalidate 하지 않음 (서버와 UI 동기화 이미 맞음)
    onSuccess: () => {
      // 다른 목록(찜한 기사님)만 새로고침
      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });
    },

    onError: (error) => {
      console.error("좋아요 요청 실패:", error);
    },
  });
};
