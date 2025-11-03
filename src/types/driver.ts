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
    isLikedByCurrentUser?: boolean;
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

/** 기사 상세 페이지 조회 */
export interface DriverDetailItem {
  id: string;
  userId: string;
  nickname: string;
  name: string;
  image: string | null;
  oneLiner: string | null;
  description: string | null;
  rating: number;
  careerYears: number;
  confirmedCount: number;
  reviewCount: number;
  serviceAreas: AreaType[];
  serviceTypes: MoveType[];
  likeCount: number;
  isLikedByCurrentUser?: boolean;
}
