import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { MoveTypeMap } from "@/types/moveTypes";

export interface LikedDriver {
  id: string;
  nickname: string;
  rating: number;
  reviewCount: number;
  careerYears: string;
  confirmedCount: number;
  likeCount: number;
  avatarUrl: string | null;
  serviceAreas: string[];
  serviceTypes: (keyof typeof MoveTypeMap)[];
  likedAt: string;
  oneLiner?: string;
}

export interface GetLikedDriversResponse {
  likedDriverList: LikedDriver[];
  nextCursor: string | null;
  hasNext: boolean;
}

// 실제 API 호출
export const getLikedDrivers = async (
  cursor?: string,
  limit: number = 10
): Promise<GetLikedDriversResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", String(limit));

  const res = await apiClient.get<GetLikedDriversResponse>(
    `/consumers/liked-drivers?${params.toString()}`
  );
  return res.data;
};

export const useLikedDriversQuery = (limit: number = 10) => {
  return useInfiniteQuery<
    GetLikedDriversResponse, // queryFn이 반환하는 타입
    Error, // 에러 타입
    InfiniteData<GetLikedDriversResponse, string | undefined>,
    ["likedDrivers"], // queryKey 타입
    string | undefined // pageParam 타입
  >({
    queryKey: ["likedDrivers"],
    queryFn: async ({ pageParam }) => getLikedDrivers(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
};
