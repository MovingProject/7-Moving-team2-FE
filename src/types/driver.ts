import { AreaType } from "@/types/areaTypes";
import { MoveType } from "@/types/moveTypes";

/** 기사 정렬 옵션 */
export type SortOption = "REVIEW_DESC" | "RATING_DESC" | "CAREER_DESC" | "CONFIRMED_DESC";

/** 기사 목록 조회 쿼리 */
export interface GetDriverListQuery {
  limit?: number;
  cursor?: string;
  sort?: SortOption;
  region?: AreaType;
  serviceType?: MoveType;
  keyword?: string;
}

/** 기사 목록의 단일 항목 */
export interface DriverItem {
  user: {
    id: string;
    name: string;
    role: string;
    createdAt: string;
  };
  profile: {
    userId: string;
    image: string | null;
    nickname: string;
    oneLiner: string | null;
    careerYears: number;
    rating: number;
    reviewCount: number;
    confirmedCount: number;
    likeCount: number;
    serviceAreas: string[];
    serviceTypes: string[];
    description?: string | null;
  };
  isInvitedByMe: boolean;
}

/** 기사 목록 조회 응답 구조 */
export interface DriverListResponse {
  items: DriverItem[];
  nextCursor?: string | null;
  hasNextPage: boolean;
}
