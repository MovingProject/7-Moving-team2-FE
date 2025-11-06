"use client";

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { DriverListResponse, DriverDetailItem } from "@/types/driver";

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

    onSuccess: (res, driverId) => {
      const detailKey = ["driverDetail", driverId] as const;
      const oldDetail = queryClient.getQueryData<DriverDetailItem>(detailKey);

      if (oldDetail) {
        queryClient.setQueryData<DriverDetailItem>(detailKey, {
          ...oldDetail,
          isLikedByCurrentUser: true,
          likeCount: (oldDetail.likeCount ?? 0) + 1,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });
    },

    onError: (error) => {
      console.error("좋아요 요청 실패:", error);
    },
  });
};
