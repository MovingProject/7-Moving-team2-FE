import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export const useUnlikeDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driverId: string) => {
      await apiClient.delete(`/drivers/${driverId}/likes`);
      return driverId;
    },
    onSuccess: (driverId) => {
      // 찜한 기사 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["likedDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["driverList"] });
      queryClient.invalidateQueries({ queryKey: ["driverDetail", driverId] });
    },
  });
};
