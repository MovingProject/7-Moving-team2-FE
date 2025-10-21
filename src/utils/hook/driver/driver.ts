import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { GetDriverListQuery, DriverListResponse } from "@/types/driver";

interface DriverListResponseRaw {
  items: DriverListResponse["items"];
  nextCursor?: string | null;
  hasNext: boolean;
}

// 기사님 목록 조회 API
export const getDriverList = async (params: GetDriverListQuery): Promise<DriverListResponse> => {
  const response = await apiClient.get<{ success: boolean; data: DriverListResponseRaw }>(
    "/drivers",
    {
      params,
    }
  );

  const raw = response.data.data;
  return {
    items: raw.items,
    nextCursor: raw.nextCursor ?? null,
    hasNextPage: raw.hasNext,
  };
};

// 단일 페이지 기사 목록 조회 훅 (필터 기반)
export const useDriverListQuery = (filters: GetDriverListQuery) => {
  return useQuery<DriverListResponse>({
    queryKey: ["driverList", filters],
    queryFn: () => getDriverList(filters),
    staleTime: 1000 * 60 * 2, // 2분 캐시
    placeholderData: keepPreviousData,
  });
};

// 무한 스크롤 기사 목록 조회 훅
export const useDriverListInfiniteQuery = (filters: Omit<GetDriverListQuery, "cursor">) => {
  return useInfiniteQuery<DriverListResponse>({
    queryKey: ["driverListInfinite", filters],
    queryFn: async ({ pageParam }): Promise<DriverListResponse> => {
      const response = await getDriverList({
        ...filters,
        cursor: pageParam as string | undefined,
      });
      return response;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
    staleTime: 1000 * 60 * 2,
  });
};
