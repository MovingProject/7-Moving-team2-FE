import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { DriverListResponse, DriverDetailItem } from "@/types/driver";

export const useUnlikeDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driverId: string) => {
      await apiClient.delete(`/drivers/${driverId}/likes`);
      return driverId;
    },

    onMutate: async (driverId: string) => {
      // 상세/리스트 캐시 업데이트 전 cancel
      await queryClient.cancelQueries({ queryKey: ["driverListInfinite"], exact: false });
      await queryClient.cancelQueries({ queryKey: ["driverDetail", driverId] });

      // 리스트 낙관적 업데이트
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

      // 상세 페이지 캐시도 같이 낙관적 업데이트
      const detailKey = ["driverDetail", driverId] as const;
      const oldDetail = queryClient.getQueryData<DriverDetailItem>(detailKey);
      if (oldDetail) {
        queryClient.setQueryData<DriverDetailItem>(detailKey, {
          ...oldDetail,
          isLikedByCurrentUser: false,
          likeCount: Math.max((oldDetail.likeCount ?? 1) - 1, 0),
        });
      }
    },

    onSuccess: (_, driverId) => {
      // 찜 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["driverDetail", driverId] });
    },

    onError: (error) => {
      console.error("좋아요 취소 실패:", error);
    },
  });
};
