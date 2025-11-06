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

export const unlikeDriver = async (driverId: string): Promise<void> => {
  await apiClient.delete(`/drivers/${driverId}/likes`);
};

// 좋아요 추가 전용 훅 (리스트 페이지 & 상세 페이지 공용)
export const useLikeDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeDriver,

    onMutate: async (driverId: string) => {
      await queryClient.cancelQueries({ queryKey: ["driverListInfinite"], exact: false });
      await queryClient.cancelQueries({ queryKey: ["driverDetail", driverId] });

      // 상세 페이지 현재 상태 확인
      const detailKey = ["driverDetail", driverId] as const;
      const oldDetail = queryClient.getQueryData<DriverDetailItem>(detailKey);

      // 이미 찜한 상태면 낙관적 업데이트 안 함
      if (oldDetail?.isLikedByCurrentUser) {
        return { previousDetail: oldDetail, alreadyLiked: true };
      }

      // 리스트 페이지 낙관적 업데이트
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

      // 상세 페이지 낙관적 업데이트
      if (oldDetail) {
        queryClient.setQueryData<DriverDetailItem>(detailKey, {
          ...oldDetail,
          isLikedByCurrentUser: true,
          likeCount: (oldDetail.likeCount ?? 0) + 1,
        });
      }

      return { previousDetail: oldDetail, alreadyLiked: false };
    },

    onSuccess: (res, driverId, context) => {
      // 이미 찜한 상태였으면 invalidate만
      if (context?.alreadyLiked) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });

      // 서버 응답이 liked: false면 롤백
      if (!res.liked) {
        const detailKey = ["driverDetail", driverId] as const;
        const currentDetail = queryClient.getQueryData<DriverDetailItem>(detailKey);

        if (currentDetail) {
          queryClient.setQueryData<DriverDetailItem>(detailKey, {
            ...currentDetail,
            likeCount: Math.max((currentDetail.likeCount ?? 1) - 1, 0),
            isLikedByCurrentUser: false,
          });
        }

        // 리스트도 롤백
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
                        isLikedByCurrentUser: false,
                        likeCount: Math.max((driver.profile.likeCount ?? 1) - 1, 0),
                      },
                    }
                  : driver
              ),
            })),
          };
          queryClient.setQueryData(key, newData);
        }
      }
    },

    onError: (error, driverId) => {
      console.error("좋아요 요청 실패:", error);
      queryClient.invalidateQueries({ queryKey: ["driverDetail", driverId] });
      queryClient.invalidateQueries({ queryKey: ["driverListInfinite"] });
    },
  });
};
