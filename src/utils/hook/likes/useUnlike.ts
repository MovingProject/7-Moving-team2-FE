import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { DriverListResponse } from "@/types/driver";

export const useUnlikeDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driverId: string) => {
      await apiClient.delete(`/drivers/${driverId}/likes`);
      return driverId;
    },
    onMutate: async (driverId: string) => {
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
    },

    onSuccess: () => {
      // 찜 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });
    },

    onError: (error) => {
      console.error("좋아요 취소 실패:", error);
    },
  });
};
