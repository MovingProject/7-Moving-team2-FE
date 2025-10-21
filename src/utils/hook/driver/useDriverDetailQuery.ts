import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { DriverItem } from "@/types/driver";

/** 단일 기사 상세 조회 API */
export const getDriverDetail = async (driverId: string): Promise<DriverItem> => {
  const res = await apiClient.get<{ success: boolean; data: DriverItem }>(`/drivers/${driverId}`);
  return res.data.data;
};

/** React Query 훅 */
export const useDriverDetailQuery = (driverId?: string) => {
  return useQuery({
    queryKey: ["driverDetail", driverId],
    queryFn: () => getDriverDetail(driverId!),
    enabled: !!driverId, // driverId 있을 때만 요청
    staleTime: 1000 * 60 * 2,
  });
};
